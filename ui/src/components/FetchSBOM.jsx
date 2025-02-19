import useFetchData from "../hooks/useFetchData";
import { GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";
import DataTable from "./DataTable";

export default function FetchSBOM() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchData("SBOM"); // Fetch data using the hook

  // Handle loading and errors
  if (loading) return <GcdsText>{`Loading...`}</GcdsText>;
  if (error) return <GcdsText>{`Error: ${error}`}</GcdsText>;

  // Process files: Remove "SBOM-" prefix and sort by date (most recent first)
  const processedFiles = data
    .map((file) => ({
      sha: file.sha.replace(/^SBOM\/SBOM-/, ""), // Remove "SBOM-" prefix
      date: file.date,
      viewButton: (
        <GcdsButton
          type="button"
          button-style="link"
          onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
        >
          {t("pages.sbom.button.view_sbom")}
        </GcdsButton>
      ),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date

  return (
    <div>
      <DataTable
        headers={[
          t("pages.sbom.table.sha"),
          t("pages.sbom.table.date"),
          t("pages.sbom.table.view"),
        ]}
        rows={processedFiles}
        keys={["sha", "date", "viewButton"]}
      />
    </div>
  );
}