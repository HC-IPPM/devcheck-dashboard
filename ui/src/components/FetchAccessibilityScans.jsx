import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";

export default function FetchAccessibilityScans() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData("accessibility-compliance-scans");

  // Handle loading and errors
  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  // Process and Sort Data
  const processedFiles = data
    .map((file) => ({
      branch: file.branchName,
      commit: file.commitSha,
      date: file.date,
      issues: file.summary.urlsWithSeriousImpactViolations.length > 0
        ? "Serious Violations"
        : file.summary.urlsWithViolations.length > 0
        ? "Violations"
        : file.summary.urlsWithIncompletes.length > 0
        ? "Incompletes"
        : "None",
      summaryButton: (
        <GcdsButton type="button" button-style="primary" onClick={() => handleViewSummary(file.summary)}>
          {t("pages.accessibility.button.view_summary")}
        </GcdsButton>
      ),
      fullResultsButton: (
        <GcdsButton type="button" button-style="link" onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}>
          {t("pages.accessibility.button.view_full_results")}
        </GcdsButton>
      ),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get latest scan per branch
  const branches = {};
  processedFiles.forEach((file) => {
    if (!branches[file.branch] || new Date(file.date) > new Date(branches[file.branch].date)) {
      branches[file.branch] = file;
    }
  });
  const recentCommits = Object.values(branches);

  const handleViewSummary = (summary) => {
    navigate("/accessibility-summary", { state: { summary } });
  };

  return (
    <div>
      {/* Most Recent Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">{t("pages.accessibility.table.title_overview")}</GcdsHeading>
      <DataTable
        headers={[
          t("pages.accessibility.table.branch"),
          t("pages.accessibility.table.commit_sha"),
          t("pages.accessibility.table.date"),
          t("pages.accessibility.table.issues"),
          t("pages.accessibility.table.view_summary"),
          t("pages.accessibility.table.view_full_results"),
        ]}
        rows={recentCommits}
        keys={["branch", "commit", "date", "issues", "summaryButton", "fullResultsButton"]}
      />

      {/* All Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">{t("pages.accessibility.table.title_sub")}</GcdsHeading>
      <DataTable
        headers={[
          t("pages.accessibility.table.branch"),
          t("pages.accessibility.table.commit_sha"),
          t("pages.accessibility.table.date"),
          t("pages.accessibility.table.issues"),
          t("pages.accessibility.table.view_summary"),
          t("pages.accessibility.table.view_full_results"),
        ]}
        rows={processedFiles}
        keys={["branch", "commit", "date", "issues", "summaryButton", "fullResultsButton"]}
      />
    </div>
  );
}
