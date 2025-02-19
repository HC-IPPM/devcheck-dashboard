import { useLocation } from "react-router-dom";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";
// import "../../components/Table.css";
import { useTranslation } from "react-i18next";

function AccessibilitySummary() {
  const { t } = useTranslation()
  const location = useLocation();
  const { summary } = location.state || {};

  if (!summary) {
    return <GcdsText>No summary data available.</GcdsText>;
  }

  return (
    <div>
      <GcdsHeading tag="h1" visual-level="h1" style={{ textAlign: "left" }}>
      {t("pages.accessibility-summary.title")}
      </GcdsHeading>

      {/* Exemptions Section */}
      <section>
        <GcdsHeading tag="h2" visual-level="h2" characterLimit="false">
        {t("pages.accessibility-summary.table.title_exemptions")}
        </GcdsHeading>
        <table className="gcds-table">
          <thead>
            <tr>
              <th>
                <GcdsText tag="span">{t("pages.accessibility-summary.table.violation_ids")}</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">{t("pages.accessibility-summary.table.incomplete_ids")}</GcdsText>
              </th>
              <th>
              <GcdsText tag="span">{t("pages.accessibility-summary.table.url_patterns")}</GcdsText>
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
                  ""
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
        <GcdsHeading tag="h2" visual-level="h2" characterLimit="false">
          {t("pages.accessibility-summary.table.title_issues")}
        </GcdsHeading>
        <table className="gcds-table">
          <thead>
            <tr>
              <th>
                <GcdsText tag="span">{t("pages.accessibility-summary.table.endpoints")}</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">{t("pages.accessibility-summary.table.all_violation_ids")}</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">{t("pages.accessibility-summary.table.serious_impact_violation_ids")}</GcdsText>
              </th>
              <th>
                <GcdsText tag="span">{t("pages.accessibility-summary.table.incomplete_ids")}</GcdsText>
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