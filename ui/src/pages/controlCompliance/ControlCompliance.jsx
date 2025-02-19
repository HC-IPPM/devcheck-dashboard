// import FetchControls from "../../components/FetchControls.jsx";

// import { useState, useEffect } from "react";
// import { GcdsInput, GcdsTextarea, GcdsButton, GcdsHeading, GcdsSelect, GcdsText } from "@cdssnc/gcds-components-react";
// import { useTranslation } from "react-i18next";


// export default function ControlCompliance() {
//     const { t } = useTranslation()

//     return (
//         <div>
//             <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
//                 {t("pages.control-compliance.title")}
//             </GcdsHeading>
//             <GcdsText tag="p" style={{ textAlign: "left" }} characterLimit="false">
//                 {t("pages.control-compliance.para")}
//             </GcdsText>
//             {/* <FetchControls/> */}
//             <FetchControls /> 
//         </div>
//     );
// }


import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/DataTable";
import useFetchData from "../../hooks/useFetchData"; 

export default function ControlCompliance() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("controls"); 

  // Transform data for table
  const detailedResults = data.flatMap((control) =>
    control.results.map((result) => ({
      control: control.controls.replace(/[\[\]]/g, ""), // Remove brackets - as controls come back as an array
      policy: control.policy,
      resource: result.resources?.[0]?.name || "N/A",
      rule: result.rule,
      result: result.result,
    }))
  );

  return (
    <div>
    <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
        {t("pages.control-compliance.title")}
    </GcdsHeading>
    <GcdsText tag="p" style={{ textAlign: "left" }} characterLimit="false">
        {t("pages.control-compliance.para")}
    </GcdsText>

      {loading ? (
        <GcdsText>Loading...</GcdsText>
      ) : error ? (
        <GcdsText>Error: {error}</GcdsText>
      ) : (
        <DataTable
          headers={[
            t("pages.control-compliance.table.control"),
            t("pages.control-compliance.table.policy"),
            t("pages.control-compliance.table.resource"),
            t("pages.control-compliance.table.rule"),
            t("pages.control-compliance.table.result"),
          ]}
          rows={detailedResults}
          keys={["control", "policy", "resource", "rule", "result"]}
        />
      )}
    </div>
  );
}
