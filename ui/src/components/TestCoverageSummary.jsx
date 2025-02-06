import { useEffect, useState } from "react";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";

export default function TestCoverageSummary() {
  const { t } = useTranslation();
  const [testCoverage, setTestCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const fetchTestCoverage = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const response = await fetch(`${API_URL}/test-coverage`, { credentials: "include" });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const mainBranchData = data.filter(file => file.branch === "main");

        const latestCommits = mainBranchData.reduce((acc, file) => {
          if (!acc[file.service] || new Date(file.date) > new Date(acc[file.service].date)) {
            acc[file.service] = file;
          }
          return acc;
        }, {});

        setTestCoverage(Object.values(latestCommits));
        // setTestCoverage(
        //   Object.values(latestCommits).map(file => ({
        //     ...file,
        //     difference: file.difference !== null && file.difference !== undefined ? file.difference : "N/A"
        //   }))
        // );
      } catch (err) {
        console.error("Error fetching test coverage:", err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchTestCoverage();
  }, [API_URL]);

  return (
    <>
      <GcdsHeading tag="h2">{t("pages.landingPage.codeCoverageTitle")}</GcdsHeading>
      <GcdsText tag="p">{t("pages.landingPage.codeCoverageText")}</GcdsText>
      {loading ? (
        <GcdsText>Loading...</GcdsText>
      ) : error ? (
        <GcdsText>Error: {error}</GcdsText>
      ) : (
        <DataTable
          headers={[
            t("pages.test-coverage.table.module"),
            t("pages.test-coverage.table.commit_sha"),
            t("pages.test-coverage.table.date"),
            t("pages.test-coverage.table.test_coverage"),
            t("pages.test-coverage.table.test_coverage_difference"),
          ]}
          rows={testCoverage}
          keys={["service", "shortSha", "date", "coverage", "difference"]}
        />
    )}
    </>
  );
}
