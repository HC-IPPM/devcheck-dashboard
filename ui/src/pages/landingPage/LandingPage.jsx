// import { useEffect, useState } from "react"
// import { GcdsButton, GcdsContainer, GcdsGrid, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
// import "@cdssnc/gcds-components-react/gcds.css"
// import { useTranslation } from "react-i18next"

// const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SEVERITY_UNSPECIFIED", "UNKNOWN"];


// export default function LandingPage() {
// 	const { t, i18n } = useTranslation()

// 	const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080)
// 	const [summary, setSummary] = useState({}); // Store the count per severity
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
  
// 	const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

// 	useEffect(() => {
// 		const mediaQuery = window.matchMedia("(min-width: 1080px)")
// 		const handleMediaChange = () => setIsWideScreen(mediaQuery.matches)

// 		mediaQuery.addEventListener("change", handleMediaChange)
// 		return () => mediaQuery.removeEventListener("change", handleMediaChange)
// 	}, [])


// 	// get vuln count - remove this out in the future 

// 	// Fetch vulnerability summary
// 	useEffect(() => {
// 		const fetchSummary = async () => {
// 		try {
// 			const response = await fetch(`${API_URL}/vulnerabilities`, {
// 			credentials: "include",
// 			});

// 			if (!response.ok) {
// 			throw new Error(`Error: ${response.statusText}`);
// 			}

// 			const result = await response.json();

// 			// Count occurrences by severity
// 			const counts = result.reduce((acc, item) => {
// 			acc[item.severity] = (acc[item.severity] || 0) + 1;
// 			return acc;
// 			}, {});

// 			setSummary(counts);
// 		} catch (err) {
// 			setError(err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 		};

// 		fetchSummary();
// 	}, [API_URL]);




// 	return (
// 		<>
// 			{/* Start welcome section */}
// 			<div>
// 				<div
// 					style={{
// 						display: "flex",
// 						alignItems: "center",
// 						justifyContent: "center",
// 						backgroundColor: "rgba(38, 55, 74, 0.9)", // Semi-transparent background for text
// 						boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)", // White box shadow for text container
// 						borderRadius: "5px",
// 						color: "white",
// 						padding: "60px 5vw",
// 						textAlign: "center",
// 						position: "relative", // Ensure this is above the blurred background
// 						zIndex: 1,
// 					}}
// 				>
// 					<h1>{t("pages.landingPage.title")} </h1>
// 					{/* Main title */}
// 				</div>
// 			</div>
// 			{/* End of welcome section */}

// 			{/* Start of container for paragraphs and summary fetch items */}
// 			<GcdsContainer
// 				size="xl"
// 				centered
// 				color="black"
// 				style={{ flexGrow: "1",textAlign: "left" }}
// 				padding="400"
// 				id="main-content"
// 				role="main" // Landmark role for main content
// 				aria-label={t("pages.landingPage.title")} // Associate container with a heading
// 			>
// 				<GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara")}</GcdsText> {/* Main paragraph text */}
// 				<GcdsText tag="p" characterLimit="false">
// 					{t("pages.landingPage.landingPagePara2").split("Observatory")[0]}
// 					<a
// 					href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca"
// 					target="_blank"
// 					rel="noopener noreferrer"
// 					>
// 					Observatory
// 					</a>
//         			{t("pages.landingPage.landingPagePara2").split("Observatory")[1]}</GcdsText> 
// 					<GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara3")}</GcdsText>


// 			  {/* Vulnerability Summary Section */}
// 			  <GcdsHeading tag="h2">{t("pages.landingPage.vulnerabilitySummary")}</GcdsHeading>
// 				{loading ? (
// 				<GcdsText>Loading...</GcdsText>
// 				) : error ? (
// 				<GcdsText>Error: {error}</GcdsText>
// 				) : (
// 				<table className="gcds-table">
// 					<thead>
// 					<tr>
// 						<th><GcdsText tag="span">Severity</GcdsText></th>
// 						<th><GcdsText tag="span">Count</GcdsText></th>
// 					</tr>
// 					</thead>
// 					<tbody>
// 						{severityOrder.map((severity) => (
// 							<tr key={severity}>
// 							<td><GcdsText>{severity}</GcdsText></td>
// 							<td><GcdsText>{summary[severity] || 0}</GcdsText></td>
// 							</tr>
// 						))}
// 						</tbody>
// 					</table>
// 				)}

// 				<div>

// 				</div>
// 			</GcdsContainer>
// 		</>
// 	)
// }
import { useEffect, useState } from "react";
import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css";
import { useTranslation } from "react-i18next";

const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SEVERITY_UNSPECIFIED", "UNKNOWN"];

export default function LandingPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

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
        <GcdsHeading tag="h2" characterLimit="false">{t("pages.landingPage.vulnerabilitySummary")}</GcdsHeading>

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
      </GcdsContainer>
    </>
  );
}
