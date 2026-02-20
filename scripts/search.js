export function compileRegex(input, flags = 'i') {
  try {
    return input ? new RegExp(input, flags) : null;
  } catch (e) {
    return null; // Safe compiler
  }
}

export function highlight(text, re) {
  if (!re) return text;
  // Convert text to string and escape it before highlighting to prevent XSS
  const strText = text.toString();
  // Temporarily store matches, escape text, then restore marks
  // Simple approach: we escape HTML, then highlight.
  let escaped = escapeHTML(strText);
  return escaped.replace(re, m => `<mark>${m}</mark>`);
}

export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
