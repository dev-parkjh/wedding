export function getPublishedPhone(contact) {
  if (contact?.confirmed !== true || typeof contact.number !== 'string') return null;
  const digits = contact.number.replace(/[\s-]/g, '');
  return /^01[016789]\d{7,8}$/.test(digits) && /[1-9]/.test(digits.slice(3)) ? digits : null;
}
