import useFetchData from "../hooks/useFetchData";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable"; // Import the reusable DataTable component

const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SEVERITY_UNSPECIFIED", "UNKNOWN"];

// Function to sort vulnerabilities by severity
const sortBySeverity = (data) => {
  return data.sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );
};

export default function FetchVulnerabilities() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("vulnerabilities");

  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  // Sort vulnerabilities by severity
  const sortedData = sortBySeverity(data);

  // Format rows for DataTable
  const formattedData = sortedData.map(entry => ({
    vulnerabilityId: entry.vulnerabilityId,
    packageName: entry.packageName,
    version: entry.version,
    imageName: entry.imageName,
    commitSha: entry.commitSha,
    severity: entry.severity,
    fixAvailable: entry.fixAvailable === true || entry.fixAvailable === "true" ? "Yes" : "No",
    date: entry.date || "N/A",
    view: entry.signedUrl ? (
      <a href={entry.signedUrl} target="_blank" rel="noopener noreferrer">
        <GcdsButton type="button" button-style="link">
          {t("pages.vulnerabilities.button.view_file")}
        </GcdsButton>
      </a>
    ) : (
      <GcdsText>N/A</GcdsText>
    ),
  }));

  return (
    <div>
      <GcdsHeading tag="h2" visual-level="h2">
        {t("pages.vulnerabilities.table.title_overview")}
      </GcdsHeading>
      
      <DataTable
        headers={[
          t("pages.vulnerabilities.table.vulnerability_id"),
          t("pages.vulnerabilities.table.package"),
          t("pages.vulnerabilities.table.version"),
          t("pages.vulnerabilities.table.image_name"),
          t("pages.vulnerabilities.table.commit_sha"),
          t("pages.vulnerabilities.table.severity"),
          t("pages.vulnerabilities.table.fix_available"),
          t("pages.vulnerabilities.table.date"),
          t("pages.vulnerabilities.table.view"),
        ]}
        rows={formattedData}
        keys={[
          "vulnerabilityId",
          "packageName",
          "version",
          "imageName",
          "commitSha",
          "severity",
          "fixAvailable",
          "date",
          "view",
        ]}
      />
    </div>
  );
}