const buckets = new Map();

export function tooMany(key, max, windowMs) {
  const now = Date.now();
  const row = buckets.get(key);
  if (!row || now - row.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return false;
  }
  row.count += 1;
  return row.count > max;
}

export function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
}
