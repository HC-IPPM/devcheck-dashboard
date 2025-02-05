import { useEffect, useState } from "react";
import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css";
import { useTranslation } from "react-i18next";

const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SEVERITY_UNSPECIFIED", "UNKNOWN"];

export default function LandingPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState({}); // this is vuln summary - will need to change name 
  const [testCoverage, setTestCoverage] = useState([]);
  const [accessibilityScans, setAccessibilityScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  // Fetch Vulnerability Summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${API_URL}/vulnerabilities`, { credentials: "include" });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();

        // Count occurrences by severity
        const counts = result.reduce((acc, item) => {
          acc[item.severity] = (acc[item.severity] || 0) + 1;
          return acc;
        }, {});

        setSummary(counts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [API_URL]);


    // Fetch Test Coverage Data
    useEffect(() => {
      const fetchTestCoverage = async () => {
        try {
          const response = await fetch(`${API_URL}/test-coverage`, {
            credentials: "include",
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
  
          const data = await response.json();
  
          // Filter to keep only "main" branch entries
          const mainBranchData = data.filter(file => file.branch === "main");
  
          // Get the most recent commit per module (service)
          const latestCommits = mainBranchData.reduce((acc, file) => {
            if (!acc[file.service] || new Date(file.date) > new Date(acc[file.service].date)) {
              acc[file.service] = file;
            }
            return acc;
          }, {});
  
          // Convert object back to array
          setTestCoverage(Object.values(latestCommits));
        } catch (err) {
          console.error("Error fetching test coverage:", err.message);
        }
      };
  
      fetchTestCoverage();
    }, [API_URL]);

  // Fetch Accessibility Scan Data (Most Recent Per Branch)
  useEffect(() => {
    const fetchAccessibilityScans = async () => {
      try {
        const response = await fetch(`${API_URL}/accessibility-compliance-scans`, { credentials: "include" });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
        const data = await response.json();
  
        const processedFiles = data.map(file => ({
          ...file,
          issues: file.summary.urlsWithSeriousImpactViolations.length > 0
            ? "Serious Violations"
            : file.summary.urlsWithViolations.length > 0
            ? "Violations"
            : file.summary.urlsWithIncompletes.length > 0
            ? "Incompletes"
            : "None",
  
          // Extract unique sets of violation IDs correctly
          seriousViolationIds: [...new Set(file.summary.urlsWithSeriousImpactViolations.flatMap(([_, violations]) => violations))],
          nonSeriousViolationIds: [...new Set(
            file.summary.urlsWithViolations.flatMap(([_, violations]) => violations)
            .filter(id => !file.summary.urlsWithSeriousImpactViolations.flatMap(([_, violations]) => violations).includes(id))
          )],
          incompleteIds: [...new Set(file.summary.urlsWithIncompletes.flatMap(([_, incompletes]) => incompletes))]
        }));
  
        const branches = {};
        processedFiles.forEach(file => {
          if (!branches[file.branchName] || new Date(file.date) > new Date(branches[file.branchName].date)) {
            branches[file.branchName] = file;
          }
        });
  
        setAccessibilityScans(Object.values(branches));
      } catch (err) {
        console.error("Error fetching accessibility scans:", err.message);
      }
    };
  
    fetchAccessibilityScans();
  }, [API_URL]);
  

  // Only keep severities that have a count > 0
  const activeSeverities = severityOrder.filter(severity => summary[severity] > 0);

  return (
    <>
      {/* Start welcome section */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(38, 55, 74, 0.9)",
            boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)",
            borderRadius: "5px",
            color: "white",
            padding: "60px 5vw",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1>{t("pages.landingPage.title")}</h1>
        </div>
      </div>
      {/* End of welcome section */}

      <GcdsContainer
        size="xl"
        centered
        color="black"
        style={{ flexGrow: "1", textAlign: "left" }}
        padding="400"
        id="main-content"
        role="main"
        aria-label={t("pages.landingPage.title")}
      >
        <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara")}</GcdsText>
        <GcdsText tag="p" characterLimit="false">
          {t("pages.landingPage.landingPagePara2").split("Observatory")[0]}
          <a href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca" target="_blank" rel="noopener noreferrer">
            Observatory
          </a>
          {t("pages.landingPage.landingPagePara2").split("Observatory")[1]}
        </GcdsText>
        <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara3")}</GcdsText>

        {/* Vulnerability Summary Section */}
        <GcdsHeading tag="h2" characterLimit="false">{t("pages.landingPage.vulnerabilityTitle")}</GcdsHeading>
		<GcdsText tag="p" characterLimit="false">{t("pages.landingPage.vulnerabilityText")}</GcdsText>

        {loading ? (
          <GcdsText>Loading...</GcdsText>
        ) : error ? (
          <GcdsText>Error: {error}</GcdsText>
        ) : activeSeverities.length === 0 ? (
          <GcdsText>No vulnerabilities found.</GcdsText>
        ) : (
          <table className="gcds-table">
            <thead>
              <tr>
                {activeSeverities.map((severity) => (
                  <th key={severity}>
                    <GcdsText tag="span">{severity}</GcdsText>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {activeSeverities.map((severity) => (
                  <td key={severity}>
                    <GcdsText>{summary[severity]}</GcdsText>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}


        {/* Accessibility Scan Summary */}
        <GcdsHeading tag="h2">{t("pages.landingPage.accessibilityTitle")}</GcdsHeading>
        <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.accessibilityText")}</GcdsText>
        {accessibilityScans.length === 0 ? (
          <GcdsText>No accessibility scan data available.</GcdsText>
        ) : (
          <table className="gcds-table">
            <thead>
              <tr>
                <th><GcdsText>Branch</GcdsText></th>
                <th><GcdsText>Commit SHA</GcdsText></th>
                <th><GcdsText>Date</GcdsText></th>
                <th><GcdsText>Issues</GcdsText></th>
                <th><GcdsText>Serious Violations</GcdsText></th>
                <th><GcdsText>Non-Serious Violations</GcdsText></th>
                <th><GcdsText>Incomplete Violations</GcdsText></th>
              </tr>
            </thead>
            <tbody>
              {accessibilityScans.map((file, index) => (
                <tr key={index}>
                  <td><GcdsText>{file.branchName}</GcdsText></td>
                  <td><GcdsText>{file.commitSha}</GcdsText></td>
                  <td><GcdsText>{file.date}</GcdsText></td>
                  <td><GcdsText>{file.issues}</GcdsText></td>
                  <td><GcdsText>{file.seriousViolationIds.length > 0 ? file.seriousViolationIds.join(", ") : "None"}</GcdsText></td>
                  <td><GcdsText>{file.nonSeriousViolationIds.length > 0 ? file.nonSeriousViolationIds.join(", ") : "None"}</GcdsText></td>
                  <td><GcdsText>{file.incompleteIds.length > 0 ? file.incompleteIds.join(", ") : "None"}</GcdsText></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


		{/* Code Coverage Summary Section */}
		<GcdsHeading tag="h2" characterLimit="false">{t("pages.landingPage.codeCoverageTitle")}</GcdsHeading>
		<GcdsText tag="p" characterLimit="false">{t("pages.landingPage.codeCoverageText")}</GcdsText>
    

    {/* Test Coverage Table (Latest Commit per Module, Main Branch Only) */}
    {testCoverage.length === 0 ? (
      <GcdsText>No test coverage data available.</GcdsText>
    ) : (
      <table className="gcds-table">
        <thead>
          <tr>
            <th><GcdsText tag="span">{t("pages.test-coverage.table.module")}</GcdsText></th>
            <th><GcdsText tag="span">{t("pages.test-coverage.table.commit_sha")}</GcdsText></th>
            <th><GcdsText tag="span">{t("pages.test-coverage.table.date")}</GcdsText></th>
            <th><GcdsText tag="span">{t("pages.test-coverage.table.test_coverage")}</GcdsText></th>
            <th><GcdsText tag="span">{t("pages.test-coverage.table.test_coverage_difference")}</GcdsText></th>
          </tr>
        </thead>
        <tbody>
          {testCoverage.map((file, index) => (
            <tr key={index}>
              <td><GcdsText>{file.service}</GcdsText></td>
              <td><GcdsText>{file.shortSha}</GcdsText></td>
              <td><GcdsText>{file.date}</GcdsText></td>
              <td><GcdsText>{file.coverage}%</GcdsText></td>
              <td><GcdsText>{file.difference}%</GcdsText></td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

		{/* Control Compliance Summary Section */}
		<GcdsHeading tag="h2" characterLimit="false">{t("pages.landingPage.controlComplianceTitle")}</GcdsHeading>
		<GcdsText tag="p" characterLimit="false">{t("pages.landingPage.controlComplianceText")}</GcdsText>


      </GcdsContainer>
    </>
  );
}
