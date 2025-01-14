import FetchSBOM from "../../components/FetchSBOM.jsx";

import { useState, useEffect } from "react";
import { GcdsInput, GcdsTextarea, GcdsButton, GcdsHeading, GcdsSelect, GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";

export default function SBOM() {
    const { t } = useTranslation()

    return (
        <div>
            <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
                {t("pages.sbom.title")}
            </GcdsHeading>
            <GcdsText tag="p" style={{ textAlign: "left" }} characterLimit="false">
                {t("pages.sbom.para")}
            </GcdsText>
            {/* <FetchSBOM/> */}
            <FetchSBOM /> 
        </div>
    );
}
