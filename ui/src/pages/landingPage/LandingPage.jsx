// import { useEffect, useState } from "react";
import { GcdsContainer, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css";
import { useTranslation } from "react-i18next";
import VulnerabilitySummary from "../../components/VulnerabilitySummary";
import TestCoverageSummary from "../../components/TestCoverageSummary";
import AccessibilityScanSummary from "../../components/AccessibilityScanSummary";

export default function LandingPage() {
  const { t } = useTranslation();

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

        {/* Vulnerability Summary */}
        <VulnerabilitySummary />

        {/* Accessibility Scan Summary */}
        <AccessibilityScanSummary />

        {/* Test Coverage Summary */}
        <TestCoverageSummary />
      </GcdsContainer>
    </>
  );
}
