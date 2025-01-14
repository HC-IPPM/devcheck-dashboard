import { useLocation } from "react-router-dom";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import "../../components/Table.css";

function AccessibilitySummary() {
  const location = useLocation();
  const { summary } = location.state || {};

  if (!summary) {
    return <GcdsText>No summary data available.</GcdsText>;
  }

  return (
    <div>
      <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
        Accessibility Summary
      </GcdsHeading>

      {/* Exemptions Section */}
      <section>
        <GcdsHeading tag="h2" visual-level="h2">
          Exemptions (bypassed IDs or URL patterns)
        </GcdsHeading>
        <table className="gcds-table">
          <thead>
            <tr>
              <th>
                <GcdsText tag="span">Violation IDs</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">Incomplete IDs</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">URL Patterns</GcdsText>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {summary.exemptedViolationIds.length > 0 ? (
                  <ul>
                    {summary.exemptedViolationIds.map((id, index) => (
                      <li key={index}>
                        <GcdsText>{id}</GcdsText>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <GcdsText>No exempted violations.</GcdsText>
                )}
              </td>
              <td>
                {summary.exemptedIncompleteIds.length > 0 ? (
                  <ul>
                    {summary.exemptedIncompleteIds.map((id, index) => (
                      <li key={index}>
                        <GcdsText>{id}</GcdsText>
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </td>
              <td>
                {summary.exemptedUrlPatterns.length > 0 ? (
                  <ul>
                    {summary.exemptedUrlPatterns
                      .filter((pattern) => Object.keys(pattern).length > 0)
                      .map((pattern, index) => (
                        <li key={index}>
                          <GcdsText>{JSON.stringify(pattern)}</GcdsText>
                        </li>
                      ))}
                  </ul>
                ) : (
                  ""
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* URLs Section */}
      <section>
        <GcdsHeading tag="h2" visual-level="h2">
          Accessibility Issues Identified During Scan
        </GcdsHeading>
        <table className="gcds-table">
          <thead>
            <tr>
              <th>
                <GcdsText tag="span">Endpoints</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">All Violation IDs</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">Serious Impact Violation IDs</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">Incomplete IDs</GcdsText>
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.urlsWithViolations.map(([url, violations], index) => (
              <tr key={index}>
                <td>
                  <GcdsText>{url}</GcdsText>
                </td>
                <td>
                  {violations.length > 0 ? (
                    <ul>
                      {violations.map((violation, vIndex) => (
                        <li key={vIndex}>
                          <GcdsText>{violation}</GcdsText>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  {summary.urlsWithSeriousImpactViolations.find(
                    ([seriousUrl]) => seriousUrl === url
                  )?.[1]?.length > 0 ? (
                    <ul>
                      {summary.urlsWithSeriousImpactViolations
                        .find(([seriousUrl]) => seriousUrl === url)?.[1]
                        .map((violation, vIndex) => (
                          <li key={vIndex}>
                            <GcdsText>{violation}</GcdsText>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  {summary.urlsWithIncompletes.find(
                    ([incompleteUrl]) => incompleteUrl === url
                  )?.[1]?.length > 0 ? (
                    <ul>
                      {summary.urlsWithIncompletes
                        .find(([incompleteUrl]) => incompleteUrl === url)?.[1]
                        .map((incomplete, iIndex) => (
                          <li key={iIndex}>
                            <GcdsText>{incomplete}</GcdsText>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AccessibilitySummary;