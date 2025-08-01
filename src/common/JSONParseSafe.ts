/**
 * Safely parses a JSON string without throwing errors
 * @param jsonString JSON string to parse
 * @param defaultValue Value to return if parsing fails (default: {})
 * @returns Parsed object or default value
 */
function JSONParseSafe(jsonString: string, defaultValue: unknown = {}): unknown {
  if (!jsonString) {
    return defaultValue;
  }

  try {
    return JSON.parse(jsonString);
  } catch (_error) {
    return defaultValue;
  }
}

export { JSONParseSafe };
