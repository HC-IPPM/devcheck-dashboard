import React from "react";
import PropTypes from "prop-types";
import { GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import "./Table.css";
import { useTranslation } from "react-i18next";

const DetailedView = ({ entry, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="modal">
      <GcdsText tag="h2" characterLimit="false">
        {t("pages.vulnerabilities.table.title_detailed_view", {
          vulnerabilityId: entry.vulnerabilityId,
          packageName: entry.packageName,
          version: entry.version,
          imageName: entry.imageName,
        })}
      </GcdsText>
      <table className="gcds-table">
        <thead>
          <tr>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.commit_sha")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.date")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.severity")}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{t("pages.vulnerabilities.table.view")}</GcdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {entry.entries.map((commit, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{commit.commitSha}</GcdsText>
              </td>
              <td>
                <GcdsText>{commit.date || t("pages.vulnerabilities.table.not_available")}</GcdsText>
              </td>
              <td>
                <GcdsText>{commit.severity}</GcdsText>
              </td>
              <td>
                <a href={commit.signedUrl} target="_blank" rel="noopener noreferrer">
                  <GcdsButton type="button" button-style="link">
                    {t("pages.vulnerabilities.button.view_file")}
                  </GcdsButton>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <GcdsButton type="button" onClick={onClose} className="modal-close-button">
        {t("pages.vulnerabilities.button.close")}
      </GcdsButton>
    </div>
  );
};

DetailedView.propTypes = {
  entry: PropTypes.shape({
    vulnerabilityId: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    imageName: PropTypes.string.isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        commitSha: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        severity: PropTypes.string.isRequired,
        signedUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedView;
