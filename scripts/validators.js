// Regex rules as specified by rubric
export const regexRules = {
  // Description: no leading/trailing spaces
  description: /^\S(?:.*\S)?$/,
  
  // Amount: positive numbers, up to 2 decimal places
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  
  // Date: YYYY-MM-DD
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  
  // Category: letters, spaces, hyphen
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  
  // Advanced: Duplicate word detection (Lookahead/Backreference)
  duplicateWord: /\b(\w+)\s+\1\b/i
};

export function validateInput(inputId, value, rule, errorMsg, allowEmpty = false) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(`${inputId}-error`);
  
  if (allowEmpty && !value) {
    setValid(inputEl, errorEl);
    return true;
  }

  if (!value) {
    setInvalid(inputEl, errorEl, 'Field is required');
    return false;
  }

  // Check advanced regex (duplicate words shouldn't exist in text fields)
  if ((inputId === 'txn-desc' || inputId === 'bud-name') && regexRules.duplicateWord.test(value)) {
    setInvalid(inputEl, errorEl, 'Duplicate words detected');
    return false;
  }

  if (!rule.test(value)) {
    setInvalid(inputEl, errorEl, errorMsg);
    return false;
  }

  setValid(inputEl, errorEl);
  return true;
}

function setInvalid(inputEl, errorEl, msg) {
  if (inputEl) inputEl.setAttribute('aria-invalid', 'true');
  if (errorEl) errorEl.textContent = msg;
}

function setValid(inputEl, errorEl) {
  if (inputEl) inputEl.removeAttribute('aria-invalid');
  if (errorEl) errorEl.textContent = '';
}
