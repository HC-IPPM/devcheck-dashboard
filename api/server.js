import express from "express";
import { Storage } from "@google-cloud/storage";
import cors from "cors";
import { listFiles } from "./src/listFiles.js";
import { generateSignedUrls } from "./src/generateSignedUrls.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const API_URL = process.env.API_URL || "https://localhost:3000";
console.log(API_URL)
const UI_URL = process.env.UI_URL || "https://localhost:5173";
console.log(UI_URL)
const BUCKET_NAME =
  process.env.BUCKET_NAME || "safe-inputs-devsecops-outputs-for-dashboard";
const KEY_PATH = process.env.KEY_PATH || "./sa-key.json";
const CLOUDRUN_UI_URL = process.env.CLOUDRUN_UI_URL || "https://ui-744920990938.northamerica-northeast1.run.app; "
// const CLOUDRUN_API_URL = process.env.CLOUDRUN_API_URL || https://api-744920990938.northamerica-northeast1.run.app; 


const allowedOrigins = [
  API_URL,
  UI_URL,
  CLOUDRUN_UI_URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// app.use(cors({ origin: "*" }));


// Load the service account key file (this will be a gcp secret in the future!)
const storage = new Storage({ keyFilename: KEY_PATH });

// Endpoint to list files in the bucket
app.get("/", (req, res) => {
  res.send("Welcome to the Google Cloud Storage API Server");
});

app.get("/listFiles", async (req, res) => {
  // This isn't needed - but pulls a list of all files from the bucket
  try {
    console.log("Fetching files from bucket...");
    const fileNames = await listFiles(storage, BUCKET_NAME);
    const signedUrls = await generateSignedUrls(
      storage,
      BUCKET_NAME,
      fileNames,
    );
    res.json(signedUrls); // Return an array of { filename, signedUrl }
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).send("Error fetching files: " + error.message);
  }
});



app.get("/vulnerabilities", async (req, res) => {
  try {
    console.log("Fetching commit SHAs from bucket...");
    const commitFiles = await listFiles(storage, BUCKET_NAME, "COMMIT_SHAs/");

    if (commitFiles.length === 0) {
      console.log("No commit SHAs found.");
      return res.status(404).json({ error: "No commit SHAs found." });
    }

    // Extract latest short SHAs dynamically
    const latestShortSHAs = {};
    const shaTimestamps = [];

    commitFiles.forEach(file => {
      const match = file.match(/COMMIT_SHAs\/(.+?)__(.{12})\.txt$/);
      if (match) {
        const service = match[1]; // Extract module name (e.g., api, ui, new-service)
        const shortSha = match[2]; // Extract short SHA (12 chars)

        // Retrieve file metadata to get creation timestamp
        shaTimestamps.push({ service, shortSha, file });
      } else {
        console.log(`Skipping file (no match): ${file}`);
      }
    });

    // Get latest SHA per service based on file timestamp
    for (const { service, shortSha, file } of shaTimestamps) {
      const fileObj = storage.bucket(BUCKET_NAME).file(file);
      const [metadata] = await fileObj.getMetadata();
      const timestamp = new Date(metadata.updated); // Use updated timestamp

      if (!latestShortSHAs[service] || timestamp > latestShortSHAs[service].timestamp) {
        latestShortSHAs[service] = { sha: shortSha, timestamp };
      }
    }

    // Keep only the latest SHA per service
    const latestSHAs = Object.fromEntries(
      Object.entries(latestShortSHAs).map(([service, { sha }]) => [service, sha])
    );

    console.log("Latest Short SHAs:", latestSHAs);

    // -------------------------------------------

    // Fetch vulnerabilities
    console.log("Fetching vulnerability files...");
    const vulnerabilityFiles = await listFiles(storage, BUCKET_NAME, "vulnerabilities");

    if (vulnerabilityFiles.length === 0) {
      return res.status(404).json({ error: "No vulnerabilities found." });
    }

    const vulnerabilityData = await Promise.all(
      vulnerabilityFiles.map(async (fileName) => {
        // Extract SHA from the filename
        const match = fileName.match(
          /^vulnerabilities\/([^_]+)__(.+?)__(.+?)__(.+?)@sha256:([a-f0-9]{12})\.json$/
        );
        if (!match) {
          console.log(`Skipping unmatched file (incorrect format): ${fileName}`);
          return null;
        }

        const [, vulnerabilityId, packageName, version, imageName, commitSha] = match;

        // console.log(`Checking vulnerability file: ${fileName}`);
        // console.log(`Extracted SHA: ${commitSha}`);

        // Determine if this vulnerability is for the latest SHA
        const relevantModule = Object.keys(latestSHAs).find(service => imageName.includes(service));

        if (!relevantModule || commitSha !== latestSHAs[relevantModule]) {
          // console.log(`Skipping ${fileName}: SHA mismatch (Expected: ${latestSHAs[relevantModule] || "N/A"} - Found: ${commitSha})`);
          return null;
        }

        const file = storage.bucket(BUCKET_NAME).file(fileName);
        const [metadata] = await file.getMetadata();
        const updatedDate = new Date(metadata.updated).toLocaleString();
        const [content] = await file.download();
        const jsonData = JSON.parse(content.toString());

        console.log(`Processing File (Matched): ${latestSHAs[relevantModule]} -  ${fileName}`);

        const effectiveSeverity = jsonData.vulnerability?.effectiveSeverity || "Unknown";
        const fixAvailable = jsonData.vulnerability?.fixAvailable || false;

        // Generate a signed URL for the file
        const [signedUrl] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
        });

        return {
          vulnerabilityId,
          packageName,
          version,
          imageName,
          commitSha,
          date: updatedDate,
          severity: effectiveSeverity,
          fixAvailable,
          signedUrl,
        };
      })
    );

    // Filter out null results
    const filteredVulnerabilities = vulnerabilityData.filter(entry => entry !== null);

    console.log(`Filtered Vulnerabilities: ${filteredVulnerabilities.length} entries found`);

    res.json(filteredVulnerabilities);
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error.message);
    res.status(500).send("Error fetching vulnerabilities: " + error.message);
  }
});





app.get("/accessibility-compliance-scans", async (req, res) => {
  try {
    const fileNames = await listFiles(storage, BUCKET_NAME, "axe-ci-results");
    const filteredFileNames = fileNames.filter(
      (filename) => !filename.includes("renovate"),
    );

    const fileData = await Promise.all(
      filteredFileNames.map(async (filename) => {
        const file = storage.bucket(BUCKET_NAME).file(filename);
        const [metadata] = await file.getMetadata();
        const updatedDate = new Date(metadata.updated).toLocaleString();
        const [branchName, commitSha] = filename
          .replace(/^axe-ci-results\//, "")
          .split(/-(?=[a-f0-9]+\.json$)/);

        const [content] = await file.download();
        const jsonData = JSON.parse(content.toString());

        // Extract summary data (for summary table)
        const summary = {
          exemptedViolationIds: jsonData.exemptedViolationIds || [],
          exemptedIncompleteIds: jsonData.exemptedIncompleteIds || [],
          exemptedUrlPatterns: jsonData.exemptedUrlPatterns || [],
          urlsWithViolations: jsonData.urlsWithViolations || [],
          urlsWithSeriousImpactViolations:
            jsonData.urlsWithSeriousImpactViolations || [],
          urlsWithIncompletes: jsonData.urlsWithIncompletes || [],
        };

        // Determine "issues" field - this will be
        const issues =
          summary.urlsWithViolations.length > 0
            ? "Violations"
            : "No Violations";

        const signedUrl = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        });

        return {
          branchName,
          commitSha: commitSha.replace(".json", ""),
          date: updatedDate,
          summary,
          issues,
          signedUrl,
        };
      }),
    );

    res.json(fileData);
  } catch (error) {
    console.error(
      "Error fetching accessibility compliance scans:",
      error.message,
    );
    res
      .status(500)
      .send("Error fetching accessibility compliance scans: " + error.message);
  }
});

app.get("/SBOM", async (req, res) => {
  try {
    console.log("Fetching files from bucket...");
    const fileNames = await listFiles(storage, BUCKET_NAME, "SBOM");

    if (fileNames.length === 0) {
      return res.status(404).json({ error: "No SBOM files found." });
    }

    const sbomFiles = await Promise.all(
      fileNames.map(async (fileName) => {
        const file = storage.bucket(BUCKET_NAME).file(fileName);
        const [metadata] = await file.getMetadata(); // Fetch file metadata
        const sha = fileName.replace(/^SBOM-/, "").replace(/\.json$/, ""); // Extract SHA
        const updatedDate = new Date(metadata.updated).toLocaleString(); // Format the date
        const [signedUrl] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        });

        return {
          sha,
          date: updatedDate,
          signedUrl,
        };
      }),
    );

    res.json(sbomFiles); // Return an array of { sha, date, signedUrl }
  } catch (error) {
    res.status(500).send("Error fetching files: " + error.message);
  }
});



app.get("/controls", async (req, res) => {
  try {
    console.log("Fetching control results from bucket...");

    // Define the file path in GCS
    const filePath = "policy-reports/final-control-results.json"; 
    const file = storage.bucket(BUCKET_NAME).file(filePath);

    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      console.error("Control results file not found.");
      return res.status(404).json({ error: "Control results file not found." });
    }

    // Download the file from GCS
    const [content] = await file.download();
    const jsonData = JSON.parse(content.toString());

    console.log("Control results fetched successfully.");
    res.json(jsonData);
  } catch (error) {
    console.error("Error fetching control results:", error.message);
    res.status(500).json({ error: "Error fetching control results" });
  }
});




app.get("/test-coverage", async (req, res) => {
  try {
    console.log("Fetching files from bucket...");
    const fileNames = await listFiles(storage, BUCKET_NAME, "test-coverage");

    if (fileNames.length === 0) {
      return res.status(404).json({ error: "No test coverage files found." });
    }

    // Filter out any file names containing "renovate"
    const filteredFileNames = fileNames.filter(
      (file) => !file.includes("/renovate/"),
    );

    // Generate signed URLs and metadata for each file
    const fileData = await Promise.all(
      filteredFileNames.map(async (fileName) => {
        const file = storage.bucket(BUCKET_NAME).file(fileName);
        const [metadata] = await file.getMetadata();
        const updatedDate = new Date(metadata.updated).toLocaleString();
        const [signedUrl] = await file.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        });

        // Extract service, branch, and short SHA
        const match = fileName.match(
          /^test-coverage\/([^/]+)\/([^_]+)__\d+__([a-f0-9]+)\.json$/,
        );
        const service = match ? match[1] : "Unknown Service";
        const branch = match ? match[2] : "Unknown Branch";
        const shortSha = match ? match[3] : "Unknown SHA";

        // Download and parse file content
        const [content] = await file.download();
        const jsonData = JSON.parse(content.toString());

        // Get coverage from total.statements.pct
        const coverage = jsonData.total?.statements?.pct || "Unknown";
        const difference = jsonData.difference_from_last_commit?.statements_pct ?? "N/A";


        return {
          service,
          branch,
          shortSha,
          date: updatedDate,
          coverage,
          difference,
          signedUrl,
        };
      }),
    );

    res.json(fileData); // Return a flat list of all files
  } catch (error) {
    console.error("Error fetching test coverage files:", error.message);
    res
      .status(500)
      .send("Error fetching test coverage files: " + error.message);
  }
});



app.listen(port, "0.0.0.0", () => {
  // console.log(`Server running on http://localhost:${port}`);
  console.log(`Server running on ${API_URL}`);
  console.log(`Server is running...`)
});
