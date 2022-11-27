import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "prefix",
  description: "Changes the prefix for this server.",
  usage: "<new prefix>",
  userPermissions: ["ManageGuild"],
  run: async ({ client, message, args }) => {
    if (!args[0])
      return message.reply({
        embeds: [
          new FailEmbed().setDescription("You need to provide a prefix."),
        ],
      });
    if (args[0].length > 5)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            "Prefix can't be longer than 5 characters."
          ),
        ],
      });

    client.db.set(message.guild.id, args[0], "prefix");

    message.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `Changed this server's prefix to \`${args[0]}\`.`
        ),
      ],
    });
  },
};
