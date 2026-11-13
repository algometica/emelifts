export const UNDO_WINDOW_MS = 30_000;
export const EDIT_WINDOW_MS = 2 * 60 * 60 * 1000;

export function canEditMessage(createdAt, now = Date.now()) {
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return false;
  return now - created <= EDIT_WINDOW_MS;
}
