/** @param {string} path */
export async function importFile(path) {
  return (await import(path))?.default;
}
