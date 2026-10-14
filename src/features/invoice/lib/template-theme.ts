export const DEFAULT_TEMPLATE_ACCENT = "#0755DB";
export const DEFAULT_TEMPLATE_ACCENT_DARK = "#043996";

export function normalizeAccentColor(value: string | null | undefined): string {
  const normalized = String(value ?? "").trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(normalized) ? normalized : DEFAULT_TEMPLATE_ACCENT;
}

export function darkenHex(color: string, factor = 0.72): string {
  const normalizedColor = normalizeAccentColor(color);
  if (normalizedColor === DEFAULT_TEMPLATE_ACCENT) return DEFAULT_TEMPLATE_ACCENT_DARK;
  const normalized = normalizedColor.slice(1);
  const channels = [0, 2, 4].map((offset) => Math.max(0, Math.min(255, Math.round(Number.parseInt(normalized.slice(offset, offset + 2), 16) * factor))));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}
