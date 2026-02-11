/**
 * Table converters for Payload Lexical rich text → HTML
 * - Preserves nested HTML (uploads, headings, bold/italic, lists, links, etc.)
 * - Emits <thead>/<tbody>
 * - Applies USWDS table classes
 * - Handles headerState, scope, colSpan/rowSpan
 *
 * Integration: pass a `renderChildren(children?: any[]) => string` function
 * from the Astro converter that calls `convertLexicalToHTML` with
 * nestedConverters.
 */

type RenderChildren = (children?: any[]) => string;

/**
 * Decide if a row is a header row.
 * Treat a row as a header row when ALL cells are column headers (headerState 1 or 3).
 */
const isHeaderRow = (row: any): boolean => {
  const cells = Array.isArray(row?.children) ? row.children : [];
  if (cells.length === 0) return false;
  return cells.every(
    (cell: any) => cell?.headerState === 1 || cell?.headerState === 3,
  );
};

/** Render a single table cell with proper semantics and spans. */
const renderCell = (
  cell: any,
  {
    inThead,
    renderChildren,
  }: { inThead: boolean; renderChildren: RenderChildren },
): string => {
  const inner = renderChildren(cell?.children);

  const colSpan =
    cell?.colSpan && cell.colSpan !== 1
      ? ` colspan="${String(cell.colSpan)}"`
      : "";
  const rowSpan =
    cell?.rowSpan && cell.rowSpan !== 1
      ? ` rowspan="${String(cell.rowSpan)}"`
      : "";

  // In THEAD, treat cells as column headers
  if (inThead) {
    return `<th scope="col"${colSpan}${rowSpan}>${inner}</th>`;
  }

  // In TBODY, headerState==2 => row header
  if (cell?.headerState === 2) {
    return `<th scope="row"${colSpan}${rowSpan}>${inner}</th>`;
  }

  // Otherwise, regular data cell
  return `<td${colSpan}${rowSpan}>${inner}</td>`;
};

/** Render a table row. */
const renderRow = (
  row: any,
  {
    inThead,
    renderChildren,
  }: { inThead: boolean; renderChildren: RenderChildren },
): string => {
  const cells = Array.isArray(row?.children) ? row.children : [];
  const htmlCells = cells
    .map((cell: any) => renderCell(cell, { inThead, renderChildren }))
    .join("");
  return `<tr>${htmlCells}</tr>`;
};

/** Full table renderer with USWDS classes and thead/tbody split. */
export const table = ({
  node,
  renderChildren,
}: {
  node: any;
  renderChildren: RenderChildren;
}): string => {
  const rows = Array.isArray(node?.children) ? node.children : [];
  const classNames = "usa-table usa-table--striped table-centered";

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
    ? `<thead>${headerRows
        .map((row: any) => renderRow(row, { inThead: true, renderChildren }))
        .join("")}</thead>`
    : "";

  const tbody = `<tbody>${bodyRows
    .map((row: any) => renderRow(row, { inThead: false, renderChildren }))
    .join("")}</tbody>`;

  return `

        <div class="usa-table-container--scrollable">
          <table class="${classNames}">${thead}${tbody}</table>
        </div>

    `;
};

/**
 * Row-only converter (defaults to tbody semantics).
 * Useful when Payload invokes `tablerow` directly.
 */
export const tablerow = ({
  node,
  renderChildren,
}: {
  node: any;
  renderChildren: RenderChildren;
}): string => {
  return renderRow(node, { inThead: false, renderChildren });
};

/**
 * Cell-only converter (no thead context available here).
 * We infer header semantics from `headerState`:
 * - 1 or 3 => column header
 * - 2   => row header
 * - else => data cell
 */
export const tablecell = ({
  node,
  renderChildren,
}: {
  node: any;
  renderChildren: RenderChildren;
}): string => {
  const inner = renderChildren(node?.children);

  const colSpan =
    node?.colSpan && node.colSpan !== 1
      ? ` colspan="${String(node.colSpan)}"`
      : "";
  const rowSpan =
    node?.rowSpan && node.rowSpan !== 1
      ? ` rowspan="${String(node.rowSpan)}"`
      : "";

  const isColHeader = node?.headerState === 1 || node?.headerState === 3;
  const isRowHeader = node?.headerState === 2;

  if (isColHeader) return `<th scope="col"${colSpan}${rowSpan}>${inner}</th>`;
  if (isRowHeader) return `<th scope="row"${colSpan}${rowSpan}>${inner}</th>`;
  return `<td${colSpan}${rowSpan}>${inner}</td>`;
};
