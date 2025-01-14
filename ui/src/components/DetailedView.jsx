import React from "react";
import PropTypes from "prop-types";
import { GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import "./Table.css";

const DetailedView = ({ entry, onClose }) => (
  <div className="modal">
    <GcdsText tag="h2" characterLimit="false">
      Commits for {entry.vulnerabilityId} - {entry.packageName} (v{entry.version}) on {entry.imageName}
    </GcdsText>
    <table className="gcds-table">
      <thead>
        <tr>
          <th>
            <GcdsText tag="span">Commit SHA</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">Date</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">Severity</GcdsText>
          </th>
          <th>
            <GcdsText tag="span">View</GcdsText>
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
              <GcdsText>{commit.date || "N/A"}</GcdsText>
            </td>
            <td>
              <GcdsText>{commit.severity}</GcdsText>
            </td>
            <td>
              <a
                href={commit.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GcdsButton type="button" button-style="link">
                  View File
                </GcdsButton>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <GcdsButton 
      type="button" 
      onClick={onClose} 
      className="modal-close-button"
    >
      Close
    </GcdsButton>
  </div>
);

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
