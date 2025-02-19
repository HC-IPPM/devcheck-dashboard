import { GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";
import useFetchData from "../hooks/useFetchData";

export default function TestCoverageSummary() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("test-coverage");

  // Filter only the main branch data
  const mainBranchData = data.filter((file) => file.branch === "main");

  // Get the latest commit per service
  const latestCommits = mainBranchData.reduce((acc, file) => {
    if (!acc[file.service] || new Date(file.date) > new Date(acc[file.service].date)) {
      acc[file.service] = file;
    }
    return acc;
  }, {});

  // Process the data with status column
  const formattedData = Object.values(latestCommits).map(file => {
    const differenceValue = file.difference ?? "N/A"; // Handle missing values

    // Convert `difference` to a number and determine pass/fail
    const differenceNum = Number(differenceValue);
    const status = differenceNum <= -10 ? "❌ Fail" : "✅ Pass";

    return {
      ...file,
      difference: differenceValue.toString(), // Ensure it doesn't show "None"
      status,
    };
  });

  return (
    <>
      {loading ? (
        <GcdsText>Loading...</GcdsText>
      ) : error ? (
        <GcdsText>Error: {error}</GcdsText>
      ) : (
        <DataTable
          headers={[
            t("pages.test-coverage.table.module"),
            t("pages.test-coverage.table.test_coverage"),
            t("pages.test-coverage.table.test_coverage_difference"),
            t("pages.test-coverage.table.status"),
          ]}
          rows={formattedData.map(row => ({
            ...row,
            difference: row.difference === "0" ? "0" : row.difference,  // Ensure `0` is not treated as empty
          }))}
          keys={["service", "coverage", "difference", "status"]}
        />
      )}
    </>
  );
}
