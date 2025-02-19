import useFetchData from "../hooks/useFetchData";
import { GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";

export default function AccessibilityScanSummary() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("accessibility-compliance-scans");

  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  // Transform Data for Accessibility Summary Table
  const processedFiles = data.map(file => {
    // populate issues column with the highest violation severity
    const issues = file.summary.urlsWithSeriousImpactViolations.length > 0
      ? "Serious Violations"
      : file.summary.urlsWithViolations.length > 0
      ? "Violations"
      : file.summary.urlsWithIncompletes.length > 0
      ? "Incompletes"
      : "None";

    return {
      branch: file.branchName,
      commit: file.commitSha,
      date: file.date,
      issues, // Uses hierarchical logic
      seriousViolations: [...new Set(file.summary.urlsWithSeriousImpactViolations.flatMap(([_, v]) => v))],
      nonSeriousViolations: [...new Set(
        file.summary.urlsWithViolations.flatMap(([_, v]) => v)
        .filter(id => !file.summary.urlsWithSeriousImpactViolations.flatMap(([_, v]) => v).includes(id))
      )],
      incompleteViolations: [...new Set(file.summary.urlsWithIncompletes.flatMap(([_, i]) => i))],
      status: issues === "None" ? "✅ Pass" : "❌ Fail", // Status based on issue severity (right now if any it fails)
    };
  });

  // Get latest scan per branch
  const latestScans = Object.values(
    processedFiles.reduce((acc, file) => {
      if (!acc[file.branch] || new Date(file.date) > new Date(acc[file.branch].date)) {
        acc[file.branch] = file;
      }
      return acc;
    }, {})
  );

  return (
    <>
      <DataTable
        headers={[
          t("pages.accessibility.table.branch"),
          t("pages.accessibility.table.issues"),
          t("pages.accessibility-summary.table.serious_impact_violation_ids"),
          t("pages.accessibility-summary.table.non_serious_violation_ids"),
          t("pages.accessibility-summary.table.incomplete_ids"),
          t("pages.accessibility-summary.table.status"), 
        ]}
        rows={latestScans}
        keys={["branch", "issues", "seriousViolations", "nonSeriousViolations", "incompleteViolations", "status"]} 
      />
    </>
  );
}
