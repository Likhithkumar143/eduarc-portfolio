// Client runtime error logger for production and development.
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[Runtime Error]", error, context);
}
