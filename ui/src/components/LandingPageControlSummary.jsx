import useFetchData from "../hooks/useFetchData";
import { GcdsText } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";

export default function ControlSummary() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("controls");

  if (loading) return <GcdsText>Loading...</GcdsText>;
  if (error) return <GcdsText>Error: {error}</GcdsText>;

  // **Transform Data for Summary Table**
  const summaryData = data.flatMap((controlItem) => {
    // **Ensure each control appears as a separate row**
    return controlItem.controls
      .replace(/[\[\]]/g, "") // Remove brackets
      .split(",") // Split multiple controls
      .map((singleControl) => ({
        control: singleControl.trim(), // Ensure no extra spaces
        status: controlItem.results.some(result => result.result === "fail") ? "❌ Fail" : "✅ Pass",
      }));
  });

  return (
    <>
      <DataTable
        headers={[
          t("pages.control-compliance.table.control"),
          t("pages.control-compliance.table.status"),
        ]}
        rows={summaryData}
        keys={["control", "status"]}
      />
    </>
  );
}
