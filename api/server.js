import express from "express";
import fetch from 'node-fetch';
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
const CLOUDRUN_API_URL = process.env.CLOUDRUN_API_URL;
const CLOUDRUN_UI_URL = process.env.CLOUDRUN_UI_URL;
const BUCKET_NAME =
  process.env.BUCKET_NAME || "safe-inputs-devsecops-outputs-for-dashboard";
const KEY_PATH = process.env.KEY_PATH || "./sa-key.json";
const apiAudience = process.env.API_AUDIENCE || "https://api-oduxqcmvlq-nn.a.run.app";

const PRIVATE_API_URL = "https://api-oduxqcmvlq-nn.a.run.app"

const allowedOrigins = [
  // API_URL,
  UI_URL,
  // CLOUDRUN_API_URL,
  CLOUDRUN_UI_URL,
  // "https://api-744920990938.northamerica-northeast1.run.app",
  // "https://api-oduxqcmvlq-nn.a.run.app",
  "https://ui-744920990938.northamerica-northeast1.run.app", 
  "https://ui"
];

// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     req.headers.origin || "https://ui-744920990938.northamerica-northeast1.run.app"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   console.log("CORS headers set for origin:", req.headers.origin);
//   next();
// });

// // Handle OPTIONS preflight requests
// app.options("*", (req, res) => {
//   res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
//   res.set("Access-Control-Allow-Credentials", "true");
//   res.status(204).end();
// });

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors());

// Load the service account key file (this will be a gcp secret in the future!)
const storage = new Storage({ keyFilename: KEY_PATH });


app.get(
  "/get-identity-token",
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('origin being used here:', origin)
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
  async (req, res) => {
    try {
      const response = await fetch(
        `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${apiAudience}`,
        {
          headers: { "Metadata-Flavor": "Google" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch identity token");
      }

      const token = await response.text();
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching identity token");
    }
  }
);

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

// app.get(
//   "/get-identity-token",
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.error(`CORS Error: Origin ${origin} not allowed`);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   }),
//   async (req, res) => {
//     try {
//       const response = await fetch(
//         `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${apiAudience}`,
//         {
//           headers: { "Metadata-Flavor": "Google" },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch identity token");
//       }

//       const token = await response.text();
//       res.json({ token });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error fetching identity token");
//     }
//   }
// );


app.get("/proxy/sbom", async (req, res) => {
  try {
    const audience = "https://api-744920990938.northamerica-northeast1.run.app";

    // Fetch the identity token from the metadata server
    const response = await fetch(
      `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${audience}`,
      {
        headers: { "Metadata-Flavor": "Google" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch identity token");
    }

    const token = await response.text();

    // Make the authenticated request to the target API
    const apiResponse = await fetch(`${audience}/SBOM`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error("Error in /proxy/sbom:", error.message);
    res.status(500).send("Failed to fetch SBOM data");
  }
});


app.get("/vulnerabilities", async (req, res) => {
  try {
    console.log("Fetching files from bucket...");
    const fileNames = await listFiles(storage, BUCKET_NAME, "vulnerabilities");

    if (fileNames.length === 0) {
      return res.status(404).json({ error: "No vulnerabilities found." });
    }

    const vulnerabilityData = await Promise.all(
      fileNames.map(async (fileName) => {
        const file = storage.bucket(BUCKET_NAME).file(fileName);
        const [metadata] = await file.getMetadata();
        const updatedDate = new Date(metadata.updated).toLocaleString();
        const [content] = await file.download();
        const jsonData = JSON.parse(content.toString());

        console.log("File Data:", {
          fileName,
          fixAvailable: jsonData.vulnerability?.fixAvailable,
        });

        const match = fileName.match(
          /^vulnerabilities\/([^_]+)__(.+?)__(.+?)__(.+?)@sha256:([a-f0-9]+)\.json$/
        );
        if (!match) {
          console.log(`Skipping unmatched file: ${fileName}`);
          return null;
        }

        const [, vulnerabilityId, packageName, version, imageName, commitSha] = match;
        const effectiveSeverity = jsonData.vulnerability?.effectiveSeverity || "Unknown";
        const fixAvailable = jsonData.vulnerability?.fixAvailable || false;

        // Generate a valid signed URL
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
          signedUrl, // Correct signed URL
        };
      })
    );

    const groupedData = Object.values(
      vulnerabilityData.reduce((acc, entry) => {
        if (!entry) return acc;

        const key = `${entry.vulnerabilityId}__${entry.packageName}__${entry.version}__${entry.imageName}`;
        if (!acc[key]) {
          acc[key] = {
            vulnerabilityId: entry.vulnerabilityId,
            packageName: entry.packageName,
            version: entry.version,
            imageName: entry.imageName,
            severity: entry.severity,
            fixAvailable: entry.fixAvailable,
            entries: [],
          };
        }

        acc[key].entries.push({
          commitSha: entry.commitSha,
          date: entry.date,
          severity: entry.severity,
          signedUrl: entry.signedUrl,
          fixAvailable: entry.fixAvailable,
        });

        return acc;
      }, {})
    );

    groupedData.forEach((group) => {
      group.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    res.json(groupedData);
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

        return {
          service,
          branch,
          shortSha,
          date: updatedDate,
          coverage,
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
  console.log(`Server running on ${CLOUDRUN_API_URL}`);
});
