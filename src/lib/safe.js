const ID = /^[a-z0-9]{20,40}$/i;

export function isId(value) {
  return typeof value === 'string' && ID.test(value);
}

export function cleanText(value, max = 2000) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

export function cleanEmail(value) {
  const email = String(value ?? '')
    .trim()
    .toLowerCase()
    .slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '';
  return email;
}

export function safeNextPath(path) {
  const value = String(path ?? '');
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '';
  }
  if (value.startsWith('/app') || value.startsWith('/coach')) return value;
  return '';
}

export function toFiniteNumber(value, fallback = null) {
  if (value === '' || value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
