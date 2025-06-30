export const ensureArray = (input: any): any[] => {
  if (Array.isArray(input)) return input;
  if (input === undefined || input === null) return [];
  return [input]; // Handle case where it's a single value
};
