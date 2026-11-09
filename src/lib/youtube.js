/** Parse a YouTube watch / share / embed URL into a video id. */
export function youtubeId(url) {
  if (!url) return null;
  const raw = String(url).trim();
  if (!raw) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match) return match[1];
  }
  try {
    const parsed = new URL(raw);
    const v = parsed.searchParams.get('v');
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  } catch {
    return null;
  }
  return null;
}

export function youtubeEmbedUrl(url) {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function youtubeThumb(url) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
