/**
 * @typedef {{ token: string; prefix: string }} EnvConfig
 */

/**
 * @typedef {Object} MessageCommand
 * @prop {string} name
 * @prop {string} [description]
 * @prop {string[]} [aliases]
 * @prop {string} [usage]
 * @prop {string} [directory] - Added by the handler.
 * @prop {import("discord.js").PermissionResolvable[]} [userPermissions]
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, message: import("discord.js").Message, args: string[], prefix: string }) => any} run
 */

/**
 * @typedef {Object} SlashCommand
 * @prop {import("discord.js").SlashCommandBuilder} data
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, interaction: import("discord.js").ChatInputCommandInteraction, prefix: string }) => Promise<any>} run
 * @prop {(params: { client: import("../structures/BotClient.mjs").BotClient, interaction: import("discord.js").ChatInputCommandInteraction }) => Promise<any>} autocomplete
 */

/** @typedef {{ message: import("discord.js").Collection<string, MessageCommand>, slash: import("discord.js").Collection<string, SlashCommand> }} Commands */
