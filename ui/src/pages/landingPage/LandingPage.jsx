// // import { useEffect, useState } from "react";
// import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
// import "@cdssnc/gcds-components-react/gcds.css";
// import { useTranslation } from "react-i18next";
// import VulnerabilitySummary from "../../components/LandingPageVulnerabilitySummary";
// import TestCoverageSummary from "../../components/LandingPageTestCoverageSummary";
// import AccessibilityScanSummary from "../../components/LandingPageAccessibilitySummary";
// import ControlSummary from "../../components/LandingPageControlSummary";

// export default function LandingPage() {
//   const { t } = useTranslation();

//   return (
//     <>
//       {/* Welcome Section */}
//       <div>
//         {/* This blob title was from Pelias */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "rgba(38, 55, 74, 0.9)",
//             boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)",
//             borderRadius: "5px",
//             color: "white",
//             padding: "60px 5vw",
//             textAlign: "center",
//             position: "relative",
//             zIndex: 1,
//           }}
//         >
//           <h1>{t("pages.landingPage.title")}</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <GcdsContainer
//         size="xl"
//         centered
//         color="black"
//         style={{ flexGrow: "1", textAlign: "left" }}
//         padding="400"
//         id="main-content"
//         role="main"
//         aria-label={t("pages.landingPage.title")}
//       >
//         <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara")}</GcdsText>
//         <GcdsText tag="p" characterLimit="false">
//           {t("pages.landingPage.landingPagePara2").split("Observatory")[0]}
//           <a href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca" target="_blank" rel="noopener noreferrer">
//             Observatory
//           </a>
//           {t("pages.landingPage.landingPagePara2").split("Observatory")[1]}
//         </GcdsText>
//         <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara3")}</GcdsText>

//         {/* Vulnerability Summary */}
//         <GcdsHeading tag="h2">{t("pages.landingPage.vulnerabilityTitle")}</GcdsHeading>
//         <GcdsText>{t("pages.landingPage.vulnerabilityPara")}</GcdsText>
//         <VulnerabilitySummary />

//         {/* Accessibility Scan Summary */}
//         <GcdsHeading tag="h2">{t("pages.landingPage.accessibilityTitle")}</GcdsHeading>
//         <GcdsText tag="p">{t("pages.landingPage.accessibilityPara")}</GcdsText> 
//         <AccessibilityScanSummary />

//         {/* Test Coverage Summary */}
//         <GcdsHeading tag="h2">{t("pages.landingPage.codeCoverageTitle")}</GcdsHeading>
//         <GcdsText tag="p">{t("pages.landingPage.codeCoveragePara")}</GcdsText>
//         <TestCoverageSummary />

//         {/* Control Compliance Summary */}
//         <GcdsHeading tag="h2">{t("pages.landingPage.controlComplianceTitle")}</GcdsHeading>
//         <GcdsText tag="p">{t("pages.landingPage.controlCompliancePara")}</GcdsText>
//         <ControlSummary />

//       </GcdsContainer>
//     </>
//   );
// }









// import { useState } from "react";
// import { motion } from "framer-motion";
// import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
// import "@cdssnc/gcds-components-react/gcds.css";
// import { useTranslation } from "react-i18next";
// import VulnerabilitySummary from "../../components/LandingPageVulnerabilitySummary";
// import TestCoverageSummary from "../../components/LandingPageTestCoverageSummary";
// import AccessibilityScanSummary from "../../components/LandingPageAccessibilitySummary";
// import ControlSummary from "../../components/LandingPageControlSummary";

// export default function LandingPage() {
//   const { t } = useTranslation();
//   const [expandedSections, setExpandedSections] = useState({});

//   // Sections with title and components
//   const sections = [
//     { key: "vulnerability", title: t("pages.landingPage.vulnerabilityTitle"), component: <VulnerabilitySummary /> },
//     { key: "accessibility", title: t("pages.landingPage.accessibilityTitle"), component: <AccessibilityScanSummary /> },
//     { key: "testCoverage", title: t("pages.landingPage.codeCoverageTitle"), component: <TestCoverageSummary /> },
//     { key: "controlCompliance", title: t("pages.landingPage.controlComplianceTitle"), component: <ControlSummary /> },
//   ];

//   const toggleSection = (key) => {
//     setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   return (
//     <>
//       {/* Welcome Section */}
//       <div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "rgba(38, 55, 74, 0.9)",
//             boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)",
//             borderRadius: "5px",
//             color: "white",
//             padding: "60px 5vw",
//             textAlign: "center",
//             position: "relative",
//             zIndex: 1,
//           }}
//         >
//           <h1>{t("pages.landingPage.title")}</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <GcdsContainer
//         size="xl"
//         centered
//         color="black"
//         style={{ flexGrow: "1", textAlign: "left", padding: "40px 0" }}
//         id="main-content"
//         role="main"
//         aria-label={t("pages.landingPage.title")}
//       >
//         {sections.map(({ key, title, component }) => (
//           <div key={key} style={{ marginBottom: "16px" }}> {/* No border-bottom! */}
//             {/* Expandable Heading */}
//             <button
//               onClick={() => toggleSection(key)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 width: "100%",
//                 background: "none",
//                 border: "none",
//                 padding: "8px 0",
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 color: "#26374A",
//                 cursor: "pointer",
//                 textAlign: "left",
//               }}
//               aria-expanded={expandedSections[key]}
//             >
//               {/* Chevron Icon (On the Left) */}
//               <i
//                 className={`fa ${expandedSections[key] ? "fa-chevron-down" : "fa-chevron-right"}`}
//                 style={{
//                   fontSize: "18px",
//                   transition: "transform 0.3s ease",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "24px",
//                   marginRight: "8px",
//                 }}
//               ></i>

//               {/* Section Title */}
//               <GcdsHeading tag="h2" style={{ margin: 0, lineHeight: "24px" }}>
//                 {title}
//               </GcdsHeading>
//             </button>

//             {/* Expandable Description (Above the Table) */}
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: expandedSections[key] ? "auto" : 0, opacity: expandedSections[key] ? 1 : 0 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//               style={{
//                 overflow: "hidden",
//                 marginBottom: expandedSections[key] ? "8px" : "0px", // 🔹 Reduce spacing when collapsed
//               }}
//             >
//               <GcdsText tag="p">
//                 {t(`pages.landingPage.${key}Para`)}
//               </GcdsText>
//             </motion.div>

//             {/* Always Visible Table */}
//             <div>{component}</div>
//           </div>
//         ))}
//       </GcdsContainer>
//     </>
//   );
// }


import { useState } from "react";
import { motion } from "framer-motion";
import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css";
import { useTranslation } from "react-i18next";
import VulnerabilitySummary from "../../components/LandingPageVulnerabilitySummary";
import TestCoverageSummary from "../../components/LandingPageTestCoverageSummary";
import AccessibilityScanSummary from "../../components/LandingPageAccessibilitySummary";
import ControlSummary from "../../components/LandingPageControlSummary";

export default function LandingPage() {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({});

  // Sections with title and components
  const sections = [
    { key: "vulnerability", title: t("pages.landingPage.vulnerabilityTitle"), component: <VulnerabilitySummary /> },
    { key: "accessibility", title: t("pages.landingPage.accessibilityTitle"), component: <AccessibilityScanSummary /> },
    { key: "testCoverage", title: t("pages.landingPage.codeCoverageTitle"), component: <TestCoverageSummary /> },
    { key: "controlCompliance", title: t("pages.landingPage.controlComplianceTitle"), component: <ControlSummary /> },
  ];

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Welcome Section */}
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

      {/* Main Content */}
      <GcdsContainer
        size="xl"
        centered
        color="black"
        style={{ flexGrow: "1", textAlign: "left", padding: "30px 0" }}
        id="main-content"
        role="main"
        aria-label={t("pages.landingPage.title")}
      >
        {/* 🔹 Paragraph Under Title */}
        <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara")}</GcdsText>
        <GcdsText tag="p" characterLimit="false">
          {t("pages.landingPage.landingPagePara2").split("Observatory")[0]}
          <a href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca" target="_blank" rel="noopener noreferrer">
            Observatory
          </a>
          {t("pages.landingPage.landingPagePara2").split("Observatory")[1]}
        </GcdsText>
        <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara3")}</GcdsText>

        {sections.map(({ key, title, component }, index) => (
          <div key={key} style={{ marginBottom: index === sections.length - 1 ? "0px" : "12px" }}>
            {/* Expandable Heading */}
            <button
              onClick={() => toggleSection(key)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "none",
                padding: "6px 0",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#26374A",
                cursor: "pointer",
                textAlign: "left",
              }}
              aria-expanded={expandedSections[key]}
            >
              {/* Chevron Icon (On the Left) */}
              <i
                className={`fa ${expandedSections[key] ? "fa-chevron-down" : "fa-chevron-right"}`}
                style={{
                  fontSize: "18px",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  marginRight: "8px",
                }}
              ></i>

              {/* Section Title */}
              <GcdsHeading tag="h2" style={{ margin: 0, lineHeight: "24px" }}>
                {title}
              </GcdsHeading>
            </button>

            {/* Expandable Description (Above the Table) */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: expandedSections[key] ? "auto" : 0, opacity: expandedSections[key] ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                overflow: "hidden",
                marginBottom: expandedSections[key] ? "6px" : "0px",
              }}
            >
              <GcdsText tag="p" characterLimit="false">{t(`pages.landingPage.${key}Para`)}</GcdsText>
            </motion.div>

            {/* Always Visible Table */}
            <div>{component}</div>
          </div>
        ))}
      </GcdsContainer>
    </>
  );
}
