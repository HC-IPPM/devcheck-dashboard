import React from "react";
import FetchVulnerabilities from "../../components/FetchVulnerabilities";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation, Trans } from "react-i18next";

export default function Vulnerabilities() {
  const { t } = useTranslation();

  return (
    <div>
      <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
        {t("pages.vulnerabilities.title")}
      </GcdsHeading>
      <GcdsText tag="p" style={{ textAlign: "left" }} characterLimit="false">
        <Trans i18nKey="pages.vulnerabilities.para">
          <a
            // href="https://docs.renovatebot.com/"
            href="https://github.com/dependabot/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dependabot
          </a>
        </Trans>
      </GcdsText>
      <FetchVulnerabilities />
    </div>
  );
}
