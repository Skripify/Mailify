import { ChannelType } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "setup",
  description: "Setup the ModMail system.",
  usage: "[category ID]",
  userPermissions: ["ManageGuild"],
  run: async ({ client, message, args }) => {
    client.db.ensure(message.guild.id, {
      enabled: false,
      category: null,
      message: "What do you need help with?",
    });

    const categoryId = args[0];
    let category = await message.guild.channels.cache.get(categoryId);
    if (!categoryId)
      category = await message.guild.channels.create({
        name: "ModMail",
        type: ChannelType.GuildCategory,
      });
    if (!category || category.type !== ChannelType.GuildCategory)
      return message.reply({
        embeds: [new FailEmbed().setDescription("Invalid category ID.")],
      });

    client.db.set(message.guild.id, true, "enabled");
    client.db.set(message.guild.id, category.id, "category");
    if (args[1])
      client.db.set(
        message.guild.id,
        args.slice(1).join(" ").slice(2048),
        "message"
      );

    message.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          "ModMail system successfully enabled!"
        ),
      ],
    });
  },
};
