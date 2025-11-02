import { stdout } from 'node:process';

const ANSI_COLOR_REGEX = /\u001b\[[0-9;]*m/g;

/**
 * Centers text within a given width
 * @param {string} text - Text to center
 * @param {number} width - Total width
 */
function centerText(text, width) {
  const plainText = text.replaceAll(ANSI_COLOR_REGEX, '');
  const padding = width - plainText.length;
  const leftPadding = Math.floor(padding / 2);
  const rightPadding = padding - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
}

/**
 * Prints a directory listing table
 * @param {Array<Object>} items - Array of items with name and type
 */
export function printDirectoryTable(items) {
  if (items.length === 0) {
    return;
  }

  const headers = ['Index', 'Name', 'Type'];

  const columnWidths = headers.map((header, colIndex) => {
    let maxWidth = header.length;
    for (const [index, item] of items.entries()) {
      let cellValue;
      if (colIndex === 0) cellValue = String(index);
      else if (colIndex === 1) cellValue = item.name;
      else cellValue = item.type;
      maxWidth = Math.max(maxWidth, cellValue.length);
    }
    return maxWidth;
  });

  const centerCell = (text, colIndex) => centerText(text, columnWidths[colIndex]);

  const headerRow = headers.map((h, i) => centerCell(h, i)).join(' │ ');
  stdout.write(`${headerRow}\n`);

  const separator = columnWidths.map((w) => '-'.repeat(w)).join('─┼─');
  stdout.write(`${separator}\n`);

  for (const [index, item] of items.entries()) {
    const row = [String(index), item.name, item.type];
    const formattedRow = row.map((cell, colIndex) => centerCell(cell, colIndex)).join(' │ ');
    stdout.write(`${formattedRow}\n`);
  }
}