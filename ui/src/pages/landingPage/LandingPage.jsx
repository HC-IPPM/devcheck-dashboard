import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css";
import { useTranslation } from "react-i18next";
import VulnerabilitySummary from "../../components/LandingPageVulnerabilitySummary";
import TestCoverageSummary from "../../components/LandingPageTestCoverageSummary";
import AccessibilityScanSummary from "../../components/LandingPageAccessibilitySummary";
import ControlSummary from "../../components/LandingPageControlSummary";
import "./LandingPage.css"; // ✅ Ensure CSS is imported

export default function LandingPage() {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({});
  const [sectionStatuses, setSectionStatuses] = useState({
    vulnerability: "",
    accessibility: "",
    testCoverage: "",
    controlCompliance: "",
  });

  const tableRefs = useRef({});

  // ✅ Define sections with references
  const sections = useMemo(() => [
    { key: "vulnerability", component: <VulnerabilitySummary /> },
    { key: "accessibility", component: <AccessibilityScanSummary /> },
    { key: "testCoverage", component: <TestCoverageSummary /> },
    { key: "controlCompliance", component: <ControlSummary /> },
  ], []);

  useEffect(() => {
    const updateStatuses = () => {
      let needsUpdate = false;
      const updatedStatuses = { ...sectionStatuses };

      Object.keys(sectionStatuses).forEach((key) => {
        const table = tableRefs.current[key];
        if (table) {
          const hasFail = table.innerHTML.includes("❌");
          const hasPass = table.innerHTML.includes("✅");

          const newStatus = hasFail ? "❌" : hasPass ? "✅" : "";
          if (updatedStatuses[key] !== newStatus) {
            updatedStatuses[key] = newStatus;
            needsUpdate = true;
          }
        }
      });

      if (needsUpdate) {
        setSectionStatuses(updatedStatuses);
      }
    };

    // ✅ Run once when the component mounts & when navigating back
    updateStatuses();

    // ✅ Observe changes to table contents dynamically
    const observer = new MutationObserver(updateStatuses);
    Object.values(tableRefs.current).forEach((table) => {
      if (table) observer.observe(table, { childList: true, subtree: true });
    });

    return () => observer.disconnect(); // ✅ Cleanup observer on unmount
  }, [sections]); // ✅ Re-run when `sections` change (e.g., when navigating back)

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* ✅ Welcome Section */}
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

      {/* ✅ Main Content */}
      <GcdsContainer
        size="xl"
        centered
        className="landing-page-container"
        id="main-content"
        role="main"
        aria-label={t("pages.landingPage.title")}
      >
        <GcdsText tag="p" characterLimit="false">
          {t("pages.landingPage.landingPagePara").split("Observatory")[0]}
          <a href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca" target="_blank" rel="noopener noreferrer">
            Observatory
          </a>
          {t("pages.landingPage.landingPagePara2").split("Observatory")[1]}
        </GcdsText>
        <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara2")}</GcdsText>

        {/* ✅ Sections (Dropdowns) */}
        {sections.map(({ key, component }) => (
          <div key={key}>
            {/* ✅ Expandable Heading */}
            <button
              onClick={() => toggleSection(key)}
              className="landing-page-button"
              aria-expanded={expandedSections[key]}
            >
              {/* ✅ Chevron Icon */}
              <i
                className={`fa ${expandedSections[key] ? "fa-chevron-down" : "fa-chevron-right"} landing-page-chevron`}
              ></i>

              {/* ✅ Title & Status Icon Wrapper */}
              <div className="landing-page-header-wrapper">
                <GcdsHeading tag="h2" characterLimit="false" className="landing-page-heading">
                  {t(`pages.landingPage.${key}Title`)}
                </GcdsHeading>

                {/* ✅ Status Icon (✅ ❌) */}
                <span className="landing-page-status">
                  {sectionStatuses[key]}
                </span>
              </div>
            </button>

            {/* ✅ Expandable Content */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: expandedSections[key] ? "auto" : 0, opacity: expandedSections[key] ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="landing-page-content"
            >
              <GcdsText tag="p" characterLimit="false">{t(`pages.landingPage.${key}Para`)}</GcdsText>
              <div ref={(el) => (tableRefs.current[key] = el)}>{component}</div>
            </motion.div>
          </div>
        ))}
      </GcdsContainer>
    </>
  );
}



// import { useState, useRef, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
// import "@cdssnc/gcds-components-react/gcds.css";
// import { useTranslation } from "react-i18next";
// import VulnerabilitySummary from "../../components/LandingPageVulnerabilitySummary";
// import TestCoverageSummary from "../../components/LandingPageTestCoverageSummary";
// import AccessibilityScanSummary from "../../components/LandingPageAccessibilitySummary";
// import ControlSummary from "../../components/LandingPageControlSummary";
// import "./LandingPage.css"; //

// export default function LandingPage() {
//   const { t } = useTranslation();
//   const [expandedSections, setExpandedSections] = useState({});
//   const [sectionStatuses, setSectionStatuses] = useState({
//     vulnerability: "",
//     accessibility: "",
//     testCoverage: "",
//     controlCompliance: "",
//   });

//   const tableRefs = useRef({});

//   const sections = useMemo(() => [
//     { key: "vulnerability", component: <VulnerabilitySummary /> },
//     { key: "accessibility", component: <AccessibilityScanSummary /> },
//     { key: "testCoverage", component: <TestCoverageSummary /> },
//     { key: "controlCompliance", component: <ControlSummary /> },
//   ], []);

//   // useEffect(() => {
//   //   const updatedStatuses = { ...sectionStatuses };
  
//   //   Object.keys(sectionStatuses).forEach((key) => {
//   //     const table = tableRefs.current[key];
//   //     if (table) {
//   //       const hasFail = table.innerHTML.includes("❌");
//   //       const hasPass = table.innerHTML.includes("✅");
  
//   //       if (updatedStatuses[key] === "") {
//   //         updatedStatuses[key] = hasFail ? "❌" : hasPass ? "✅" : "";
//   //       }
//   //     }
//   //   });
  
//   //   setSectionStatuses(updatedStatuses);
//   // }, [sectionStatuses]);

//   useEffect(() => {
//     let needsUpdate = false;
//     const updatedStatuses = { ...sectionStatuses };
  
//     Object.keys(sectionStatuses).forEach((key) => {
//       const table = tableRefs.current[key];
//       if (table) {
//         const hasFail = table.innerHTML.includes("❌");
//         const hasPass = table.innerHTML.includes("✅");
        
//         // Only update if value changes to avoid unnecessary re-renders
//         const newStatus = hasFail ? "❌" : hasPass ? "✅" : "";
//         if (updatedStatuses[key] !== newStatus) {
//           updatedStatuses[key] = newStatus;
//           needsUpdate = true;
//         }
//       }
//     });
  
//     if (needsUpdate) {
//       setSectionStatuses(updatedStatuses);
//     }
//   }, []);
  
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
//         // color="black"
//         className="landing-page-container"
//         id="main-content"
//         role="main"
//         aria-label={t("pages.landingPage.title")}
//       >
//         <GcdsText tag="p" characterLimit="false">
//           {t("pages.landingPage.landingPagePara").split("Observatory")[0]}
//           <a href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca" target="_blank" rel="noopener noreferrer">
//             Observatory
//           </a>
//           {t("pages.landingPage.landingPagePara2").split("Observatory")[1]}
//         </GcdsText>
//         <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara2")}</GcdsText>
//         {/* <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara3")}</GcdsText> */}


//         {/* Sections (Dropdowns) */}
//         {sections.map(({ key, component }) => (
//           <div key={key}>
//             {/* Expandable Heading */}
//             <button
//               onClick={() => toggleSection(key)}
//               className="landing-page-button"
//               aria-expanded={expandedSections[key]}
//             >
//               {/* Chevron Icon */}
//               <i
//                 className={`fa ${expandedSections[key] ? "fa-chevron-down" : "fa-chevron-right"} landing-page-chevron`}
//               ></i>

//               {/* Title & Status Icon Wrapper */}
//               <div className="landing-page-header-wrapper">
//                 {/* Section Title */}
//                 <GcdsHeading tag="h2" characterLimit="false" className="landing-page-heading">
//                   {t(`pages.landingPage.${key}Title`)}
//                 </GcdsHeading>

//                 {/* Status Icon (✅ ❌) */}
//                 <span className="landing-page-status">
//                   {sectionStatuses[key]}
//                 </span>
//               </div>
//             </button>

//             {/* Expandable Content */}
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: expandedSections[key] ? "auto" : 0, opacity: expandedSections[key] ? 1 : 0 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//               className="landing-page-content"
//             >
//               {/* {console.log("Translation key:", `pages.landingPage.${key}Para`)} */}
//               {/* {console.log("Current translation:", t(`pages.landingPage.${key}Para`))} */}
//               <GcdsText tag="p" characterLimit="false">{t(`pages.landingPage.${key}Para`)}</GcdsText>
//               <div ref={(el) => (tableRefs.current[key] = el)}>{component}</div>
//             </motion.div>
//           </div>
//         ))}
//       </GcdsContainer>
//     </>
//   );
// }












// import { useState, useRef, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
// import "@cdssnc/gcds-components-react/gcds.css";
// import { useTranslation } from "react-i18next";
// import VulnerabilitySummary from "../../components/LandingPageVulnerabilitySummary";
// import TestCoverageSummary from "../../components/LandingPageTestCoverageSummary";
// import AccessibilityScanSummary from "../../components/LandingPageAccessibilitySummary";
// import ControlSummary from "../../components/LandingPageControlSummary";
// import "./LandingPage.css"; // ✅ Import the CSS file

// export default function LandingPage() {
//   const { t } = useTranslation();
//   const [expandedSections, setExpandedSections] = useState({});
//   const [sectionStatuses, setSectionStatuses] = useState({
//     vulnerability: "",
//     accessibility: "",
//     testCoverage: "",
//     controlCompliance: "",
//   });

//   const sections = useMemo(
//     () => [
//       { key: "vulnerability", component: <VulnerabilitySummary onStatusUpdate={(status) => updateStatus("vulnerability", status)} /> },
//       { key: "accessibility", component: <AccessibilityScanSummary onStatusUpdate={(status) => updateStatus("accessibility", status)} /> },
//       { key: "testCoverage", component: <TestCoverageSummary onStatusUpdate={(status) => updateStatus("testCoverage", status)} /> },
//       { key: "controlCompliance", component: <ControlSummary onStatusUpdate={(status) => updateStatus("controlCompliance", status)} /> },
//     ],
//     []
//   );

//   // ✅ Function to update section status based on child component updates
//   const updateStatus = (key, status) => {
//     setSectionStatuses((prev) => ({
//       ...prev,
//       [key]: status,
//     }));
//   };

//   // ✅ Ensure we only update when there are actual changes
//   useEffect(() => {
//     let needsUpdate = false;
//     const updatedStatuses = { ...sectionStatuses };

//     Object.keys(sectionStatuses).forEach((key) => {
//       const currentStatus = sectionStatuses[key];
//       if (updatedStatuses[key] !== currentStatus) {
//         updatedStatuses[key] = currentStatus;
//         needsUpdate = true;
//       }
//     });

//     if (needsUpdate) {
//       setSectionStatuses(updatedStatuses);
//     }
//   }, []); // ✅ Runs only once

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
//       <GcdsContainer size="xl" centered className="landing-page-container" id="main-content" role="main" aria-label={t("pages.landingPage.title")}>
//         <GcdsText tag="p" characterLimit="false">
//           {t("pages.landingPage.landingPagePara").split("Observatory")[0]}
//           <a href="https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca" target="_blank" rel="noopener noreferrer">
//             Observatory
//           </a>
//           {t("pages.landingPage.landingPagePara2").split("Observatory")[1]}
//         </GcdsText>
//         <GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara2")}</GcdsText>

//         {/* Sections (Dropdowns) */}
//         {sections.map(({ key, component }) => (
//           <div key={key}>
//             {/* Expandable Heading */}
//             <button onClick={() => toggleSection(key)} className="landing-page-button" aria-expanded={expandedSections[key]}>
//               <i className={`fa ${expandedSections[key] ? "fa-chevron-down" : "fa-chevron-right"} landing-page-chevron`}></i>

//               {/* Title & Status Icon Wrapper */}
//               <div className="landing-page-header-wrapper">
//                 <GcdsHeading tag="h2" characterLimit="false" className="landing-page-heading">
//                   {t(`pages.landingPage.${key}Title`)}
//                 </GcdsHeading>
//                 <span className="landing-page-status">{sectionStatuses[key]}</span>
//               </div>
//             </button>

//             {/* Expandable Content */}
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: expandedSections[key] ? "auto" : 0, opacity: expandedSections[key] ? 1 : 0 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//               className="landing-page-content"
//             >
//               <GcdsText tag="p" characterLimit="false">{t(`pages.landingPage.${key}Para`)}</GcdsText>
//               {component}
//             </motion.div>
//           </div>
//         ))}
//       </GcdsContainer>
//     </>
//   );
// }
