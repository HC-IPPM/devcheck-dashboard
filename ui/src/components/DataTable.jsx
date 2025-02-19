import { GcdsText } from "@cdssnc/gcds-components-react";
import "./Table.css";
/**
 * Reusable table component for displaying structured data.
 * @param {Object} props
 * @param {string[]} props.headers - Array of table column headers.
 * @param {Array<Object>} props.rows - Array of objects representing table rows.
 * @param {string[]} props.keys - Array of object keys to display in the table.
 */
export default function DataTable({ headers, rows, keys }) {
  return (
    <table className="gcds-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}><GcdsText>{header}</GcdsText></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headers.length}><GcdsText>No data available.</GcdsText></td>
          </tr>
        ) : (
          rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {keys.map((key, colIndex) => (
                <td key={colIndex}>
                  <GcdsText>
                    {Array.isArray(row[key]) ? row[key].join(", ") : row[key] || "None"}
                  </GcdsText>
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
