import React, { useEffect, useState } from "react";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import "./Table.css";
import DetailedView from "./DetailedView";
import { useTranslation } from "react-i18next";

const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SEVERITY_UNSPECIFIED", "UNKNOWN"];

const sortBySeverity = (data) => {
  return data.sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );
};

function FetchVulnerabilities() {
  const { t } = useTranslation()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null); // State for detailed view

  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/vulnerabilities`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result)
        const sortedData = sortBySeverity(result); // Sort data by severity
        setData(sortedData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleViewMore = (entry) => {
    console.log("Viewing detailed entry:", entry); // Debugging
    setSelectedEntry(entry);
  };

  const closeDetailedView = () => {
    setSelectedEntry(null);
  };

  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  return (
    <div>
      <GcdsHeading tag="h2" visual-level="h2">
      {t("pages.vulnerabilities.table.title_overview")}
      </GcdsHeading>
      <table className="gcds-table">
        <thead>
          <tr>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.vulnerability_id")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.package")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.version")}</GcdsText>
            </th>
            <th className="image-name-column">
              <GcdsText tag="span">{t("pages.vulnerabilities.table.image_name")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.severity")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.fix_available")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.date")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.view")}</GcdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{entry.vulnerabilityId}</GcdsText>
              </td>
              <td>
                <GcdsText>{entry.packageName}</GcdsText>
              </td>
              <td>
                <GcdsText>{entry.version}</GcdsText>
              </td>
              <td className="image-name-column">
                <GcdsText>{entry.imageName}</GcdsText>
              </td>
              <td>
                <GcdsText>{entry.severity}</GcdsText>
              </td>
              <td>
                <GcdsText>{entry.fixAvailable === true || entry.fixAvailable === "true" ? "Yes" : "No"}</GcdsText>
              </td>
              <td>
                <GcdsText>{entry.entries?.[0]?.date || "N/A"}</GcdsText>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="link"
                  onClick={() => handleViewMore(entry)}
                >
                  {t("pages.vulnerabilities.button.view_commits")}
                </GcdsButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEntry && (
        <DetailedView entry={selectedEntry} onClose={closeDetailedView} />
      )}
    </div>
  );
}

export default FetchVulnerabilities;
