import FetchAccessibilityScans from "../../components/FetchAccessibilityScans.jsx";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";

export default function Accessibility() {
  const { t } = useTranslation();

  return (
    <div>
        <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
            {t("pages.accessibility.title")}
        </GcdsHeading>
        <GcdsText tag="p" style={{ textAlign: "left" }} characterLimit="false">
            {t("pages.accessibility.para")}
        </GcdsText>
        <FetchAccessibilityScans />
    </div>
  );
}
