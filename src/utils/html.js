/**
 * Escapes a string for safe insertion as HTML text content.
 * Prevents XSS when building innerHTML from user input.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
