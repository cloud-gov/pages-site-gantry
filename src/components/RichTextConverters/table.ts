import { getTextContent } from "./helpers";

/**
 * Full table renderer: adds USWDS classes and emits <thead>/<tbody>.
 * Uses the provided "table" + "tablerow" + "tablecell" structure from your Lexical JSON.
 */

/**
 * Decide if a row is a header row.
 * We treat a row as a header row when ALL cells are column headers/empty headers (1 or 3),
 * which matches the first row in stringified content JSON.
 */
const isHeaderRow = (row: any): boolean => {
  const cells = Array.isArray(row?.children) ? row.children : [];
  if (cells.length === 0) return false;
  return cells.every(
    (cell: any) => cell?.headerState === 1 || cell?.headerState === 3,
  );
};

/**
 * Build a <tr> HTML string from a row node using headerState rules.
 */
const renderRow = (row: any, { inThead }: { inThead: boolean }): string => {
  const cells = Array.isArray(row?.children) ? row.children : [];

  const htmlCells = cells
    .map((cell: any, idx: number) => {
      const inner = (cell?.children || []).map(getTextContent).join("");

      // Column headers (first/thead rows): 1 or 3 => <th scope="col">
      if (inThead && (cell?.headerState === 1 || cell?.headerState === 3)) {
        return `<th scope="col">${inner}</th>`;
      }

      // Row headers inside tbody: 2 => <th scope="row">
      if (!inThead && cell?.headerState === 2) {
        return `<th scope="row">${inner}</th>`;
      }

      // Normal cell: 0 => <td>
      // Fallback: if an unexpected headerState shows up in tbody, treat non-first cells as <td>.
      return `<td>${inner}</td>`;
    })
    .join("");

  return `<tr>${htmlCells}</tr>`;
};

export const table = ({ node }): string => {
  const rows = Array.isArray(node?.children) ? node.children : [];
  const classNames = "usa-table usa-table--striped";

  if (rows.length === 0) {
    return `<table class="${classNames}"></table>`;
  }

  // Split into thead (leading contiguous header rows) and tbody (the rest)
  let splitIndex = 0;
  while (splitIndex < rows.length && isHeaderRow(rows[splitIndex])) {
    splitIndex++;
  }
  const headerRows = rows.slice(0, splitIndex);
  const bodyRows = rows.slice(splitIndex);

  const thead = headerRows.length
    ? `<thead>${headerRows.map((row) => renderRow(row, { inThead: true })).join("")}</thead>`
    : "";

  const tbody = `<tbody>${bodyRows.map((row) => renderRow(row, { inThead: false })).join("")}</tbody>`;

  return `<table class="${classNames}">${thead}${tbody}</table>`;
};

export const tablerow = ({ node }): string => {
  return renderRow(node, { inThead: false });
};

export const tablecell = ({ node }): string => {
  const inner = (node?.children || []).map(getTextContent).join("");
  const isColHeader = node?.headerState === 1 || node?.headerState === 3;
  const isRowHeader = node?.headerState === 2;

  if (isColHeader) return `<th scope="col">${inner}</th>`;
  if (isRowHeader) return `<th scope="row">${inner}</th>`;
  return `<td>${inner}</td>`;
};
