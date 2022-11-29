/**
 *
 * @param {string} path
 * @returns any
 */
export async function importFile(path) {
  return (await import(path))?.default;
}

/**
 *
 * @param {string} str
 * @returns string
 */
export function capitalize(str) {
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}

/**
 *
 * @param {string} message
 * @param {import('discord.js').User} user
 * @returns string
 */
export function replaceTags(message, user) {
  return message
    .replace("{user.name}", user.username)
    .replace("{user.tag}", user.tag)
    .replace("{user.id}", user.id)
    .replace("{user.mention}", `<@${user.id}>`);
}
