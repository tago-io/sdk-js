function JSONParseSafe(jsonString: string, defaultValue: any = {}) {
  if (!jsonString) {
    return defaultValue;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
}

export { JSONParseSafe };
