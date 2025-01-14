import FetchTestCoverage from "../../components/FetchTestCoverage.jsx"
import { useState, useEffect } from "react"
import { GcdsInput, GcdsTextarea, GcdsButton, GcdsHeading, GcdsSelect, GcdsText } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"

export default function TestCoverage() {
    const { t } = useTranslation()
    return (
        <div>
            <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
                {t("pages.test-coverage.title")}
            </GcdsHeading>
            <GcdsText tag="p" style={{ textAlign: "left" }} characterLimit="false">
                {t("pages.test-coverage.para")}
            </GcdsText>
            <FetchTestCoverage />
        </div>
    );
};
