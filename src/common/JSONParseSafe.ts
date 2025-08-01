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
