import useFetchData from "../hooks/useFetchData";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable"; // Import the reusable DataTable component

export default function FetchTestCoverage() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("test-coverage");

  // Handle loading and errors
  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  // Keep the latest commit per service/branch
  const branchGroups = data.reduce((acc, file) => {
    const key = `${file.service}/${file.branch}`;
    if (!acc[key] || new Date(file.date) > new Date(acc[key].date)) {
      acc[key] = file;
    }
    return acc;
  }, {});

  // Sort by latest commit date, grouping by module
  const sortedRecentCommits = Object.values(branchGroups).sort((a, b) => {
    if (a.service === b.service) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.service.localeCompare(b.service);
  });

  // Sort all commits for the "All Commits" table
  const sortedFiles = [...data].sort((a, b) => {
    if (a.service === b.service) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.service.localeCompare(b.service);
  });

  // Format data for DataTable
  const formatData = (files) =>
    files.map((file) => ({
      service: file.service,
      branch: file.branch,
      shortSha: file.shortSha,
      date: file.date,
      coverage: file.coverage,
      // difference: file.difference ?? "N/A",
      difference: file.difference !== undefined && file.difference !== null
      ? String(file.difference) // Ensure 0 is displayed properly
      : "N/A",
      view: (
        <GcdsButton
          type="button"
          button-style="link"
          onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
        >
          {t("pages.test-coverage.button.view_results")}
        </GcdsButton>
      ),
    }));

  return (
    <div>
      {/* Most Recent Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">{t("pages.test-coverage.table.title_overview")}</GcdsHeading>
      <DataTable
        headers={[
          t("pages.test-coverage.table.module"),
          t("pages.test-coverage.table.branch"),
          t("pages.test-coverage.table.commit_sha"),
          t("pages.test-coverage.table.date"),
          t("pages.test-coverage.table.test_coverage"),
          t("pages.test-coverage.table.test_coverage_difference"),
          t("pages.test-coverage.table.view"),
        ]}
        rows={formatData(sortedRecentCommits)}
        keys={["service", "branch", "shortSha", "date", "coverage", "difference", "view"]}
      />

      {/* All Commits Table */}
      <GcdsHeading tag="h2" visual-level="h2">{t("pages.test-coverage.table.title_sub")}</GcdsHeading>
      <DataTable
        headers={[
          t("pages.test-coverage.table.module"),
          t("pages.test-coverage.table.branch"),
          t("pages.test-coverage.table.commit_sha"),
          t("pages.test-coverage.table.date"),
          t("pages.test-coverage.table.test_coverage"),
          t("pages.test-coverage.table.test_coverage_difference"),
          t("pages.test-coverage.table.view"),
        ]}
        rows={formatData(sortedFiles)}
        keys={["service", "branch", "shortSha", "date", "coverage", "difference", "view"]}
      />
    </div>
  );
}
