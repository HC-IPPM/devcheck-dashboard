import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
// import "./FetchSBOM.css"; 
import "./Table.css"; 

function FetchAccessibilityScans() {
  const [files, setFiles] = useState([]);
  const [recentCommits, setRecentCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/accessibility-compliance-scans`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Sort files by date (most recent first)
        const processedFiles = data
          .map((file) => ({
            ...file,
            // Determine the issues based on the provided criteria
            issues: file.summary.urlsWithSeriousImpactViolations.length > 0
              ? "Serious Violations"
              : file.summary.urlsWithViolations.length > 0
              ? "Violations"
              : file.summary.urlsWithIncompletes.length > 0
              ? "Incompletes"
              : "None",
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setFiles(processedFiles);

        // Group by branch and find the most recent commit for each branch
        const branches = {};
        processedFiles.forEach((file) => {
          if (!branches[file.branchName] || new Date(file.date) > new Date(branches[file.branchName].date)) {
            branches[file.branchName] = file;
          }
        });

        setRecentCommits(Object.values(branches));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) return <GcdsText>{`Loading...`}</GcdsText>;
  if (error) return <GcdsText>{`Error: ${error}`}</GcdsText>;

  const handleViewSummary = (summary) => {
    navigate("/accessibility-summary", { state: { summary } });
  };

  return (
    <div>
      {/* Most Recent Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">Most Recent Commit per Branch</GcdsHeading>
      <table className="gcds-table">
        <thead>
          <tr>
            <th>
              <GcdsText tag="span">{`Branch`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`Commit SHA`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`Date`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`Issues`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`View Summary`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`View Full Results`}</GcdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {recentCommits.map((file, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{file.branchName}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.commitSha}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.date}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.issues}</GcdsText>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="primary"
                  onClick={() => handleViewSummary(file.summary)}
                >
                  View Summary
                </GcdsButton>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="link"
                  onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
                >
                  View Full Results
                </GcdsButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* All Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">All Commits</GcdsHeading>
      <table className="gcds-table">
      <thead>
        <tr>
          <th>
            <GcdsText tag="span">{`Branch`}</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">{`Commit SHA`}</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">{`Date`}</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">{`Issues`}</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">{`View Summary`}</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">{`View Full Results`}</GcdsText>
          </th>
        </tr>
      </thead>

        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{file.branchName}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.commitSha}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.date}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.issues}</GcdsText>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="primary"
                  onClick={() => handleViewSummary(file.summary)}
                >
                  View Summary
                </GcdsButton>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="link"
                  onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
                >
                  View Full Results
                </GcdsButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FetchAccessibilityScans;
