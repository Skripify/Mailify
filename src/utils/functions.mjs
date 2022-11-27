/** @param {string} path */
export async function importFile(path) {
  return (await import(path))?.default;
}

/** @param {string} str */
export function capitalize(str) {
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}
