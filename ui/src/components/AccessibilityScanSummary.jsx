import { useEffect, useState } from "react";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";

export default function AccessibilityScanSummary() {
  const { t } = useTranslation();
  const [accessibilityScans, setAccessibilityScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const fetchAccessibilityScans = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const response = await fetch(`${API_URL}/accessibility-compliance-scans`, { credentials: "include" });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        const processedFiles = data.map(file => ({
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
          seriousViolations: [...new Set(file.summary.urlsWithSeriousImpactViolations.flatMap(([_, v]) => v))],
          nonSeriousViolations: [...new Set(
            file.summary.urlsWithViolations.flatMap(([_, v]) => v)
            .filter(id => !file.summary.urlsWithSeriousImpactViolations.flatMap(([_, v]) => v).includes(id))
          )],
          incompleteViolations: [...new Set(file.summary.urlsWithIncompletes.flatMap(([_, i]) => i))]
        }));

        const latestScans = processedFiles.reduce((acc, file) => {
          if (!acc[file.branch] || new Date(file.date) > new Date(acc[file.branch].date)) {
            acc[file.branch] = file;
          }
          return acc;
        }, {});

        setAccessibilityScans(Object.values(latestScans));
      } catch (err) {
        console.error("Error fetching accessibility scans:", err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchAccessibilityScans();
  }, [API_URL]);

  return (
    <>
      <GcdsHeading tag="h2">{t("pages.landingPage.accessibilityTitle")}</GcdsHeading>
      <GcdsText tag="p">{t("pages.landingPage.accessibilityText")}</GcdsText> 
      {loading ? (
        <GcdsText>Loading...</GcdsText>
      ) : error ? (
        <GcdsText>Error: {error}</GcdsText>
      ) : (
        <DataTable
          headers={[
            t("pages.accessibility.table.branch"),
            t("pages.accessibility.table.commit_sha"),
            t("pages.accessibility.table.date"),
            t("pages.accessibility.table.issues"),
            t("pages.accessibility-summary.table.serious_impact_violation_ids"),
            t("pages.accessibility-summary.table.non_serious_violation_ids"),
            t("pages.accessibility-summary.table.incomplete_ids")
          ]}
          rows={accessibilityScans}
          keys={["branch", "commit", "date", "issues", "seriousViolations", "nonSeriousViolations", "incompleteViolations"]}
        />
      )}
    </>
  );
}
