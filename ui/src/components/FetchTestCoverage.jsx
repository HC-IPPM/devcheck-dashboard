import { useEffect, useState } from "react";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import "./Table.css"; 


function FetchTestCoverage() {
  const [files, setFiles] = useState([]);
  const [recentCommits, setRecentCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/test-coverage`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        // Set all commits
        setFiles(data || []);

        // Group by unique module/branch combinations
        const branchGroups = data.reduce((acc, file) => {
          const key = `${file.service}/${file.branch}`;
          if (!acc[key] || new Date(file.date) > new Date(acc[key].date)) {
            acc[key] = file;
          }
          return acc;
        }, {});

        // Sort by the most recent commit date, keeping modules grouped together
        const sortedRecentCommits = Object.values(branchGroups).sort((a, b) => {
          if (a.service === b.service) {
            return new Date(b.date) - new Date(a.date);
          }
          return a.service.localeCompare(b.service);
        });

        setRecentCommits(sortedRecentCommits);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  // Sort all commits for the All Commits table
  const sortedFiles = [...files].sort((a, b) => {
    if (a.service === b.service) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.service.localeCompare(b.service);
  });

  return (
    <div>
      {/* Most Recent Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">Most Recent Commit per Module/Branch</GcdsHeading>
      <table className="gcds-table">
        <thead>
          <tr>
            <th>
              <GcdsText tag="span">Module</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Branch</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Commit SHA</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Date</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Test Coverage (%)</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">View</GcdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {recentCommits.map((file, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{file.service}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.branch}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.shortSha}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.date}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.coverage}</GcdsText>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="link"
                  onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
                >
                  View Results
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
              <GcdsText tag="span">Module</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Branch</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Commit SHA</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Date</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">Test Coverage (%)</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">View</GcdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map((file, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{file.service}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.branch}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.shortSha}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.date}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.coverage}</GcdsText>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="link"
                  onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
                >
                  View Results
                </GcdsButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FetchTestCoverage;
