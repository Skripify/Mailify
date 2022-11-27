import { ChannelType } from "discord.js";
import { Embed, FailEmbed } from "../structures/Embed.mjs";

/** @param {string} str */
function escapeRegex(str) {
  return str?.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

/**
 * @param {import("../structures/BotClient.mjs").BotClient} client
 * @param {import("discord.js").Message} message
 */
export default async (client, message) => {
  if (
    !message.guild ||
    message.channel.type === ChannelType.DM ||
    message.author.bot
  )
    return;

  client.db.ensure(message.guild.id, {
    prefix: client.env.prefix,
  });

  const prefix = client.db.get(message.guild.id, "prefix");

  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  const [, mPrefix] = message.content.match(prefixRegex);

  const [cmd, ...args] = message.content
    .slice(mPrefix.length)
    .trim()
    .split(/ +/);

  if (cmd.length === 0 && mPrefix.includes(client.user.id))
    return message.reply({
      embeds: [
        new Embed().setDescription(
          `My prefix in this server is \`${prefix}\`.\nRun \`${prefix}help\` to view all my commands.`
        ),
      ],
    });

  const command =
    client.commands.message.get(cmd.toLowerCase()) ||
    client.commands.message.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command)
    return message.reply({
      embeds: [new FailEmbed().setDescription("Unknown command.")],
    });

  try {
    if (
      command.userPermissions &&
      !message.member.permissions.has(command.userPermissions)
    )
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            "You don't have permission to run that command."
          ),
        ],
      });

    await command.run({ client, message, args, prefix });
  } catch (err) {
    console.log(err);
    message.reply({
      embeds: [
        new FailEmbed().addFields({
          name: "An error occured.",
          value: `\`\`\`${err}\`\`\``,
        }),
      ],
    });
  }
};
