import { ChannelType } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import('../.././../utils/types.mjs').MessageCommand} */
export default {
  name: "category",
  description: "Create or update the category where the ticket channels go.",
  usage: "[category ID]",
  userPermissions: ["ManageGuild"],
  run: async ({ client, message, args }) => {
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

    client.db.set(message.guild.id, category.id, "category");

    message.reply({
      embeds: [
        new SuccessEmbed().setDescription("Category updated successfully!"),
      ],
    });
  },
};
