import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the ModMail system.")
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription(
          "The category where the ticket channels are supposed to go."
        )
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send when a user opens a ticket.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ client, interaction }) => {
    client.db.ensure(interaction.guild.id, {
      enabled: false,
      category: null,
      message: "What do you need help with?",
    });

    const categoryId = interaction.options.getChannel("channel");
    let category = await interaction.guild.channels.cache.get(categoryId);
    if (!categoryId)
      category = await interaction.guild.channels.create({
        name: "ModMail",
        type: ChannelType.GuildCategory,
      });
    if (!category || category.type !== ChannelType.GuildCategory)
      return interaction.reply({
        embeds: [new FailEmbed().setDescription("Invalid category.")],
        ephemeral: true,
      });

    client.db.set(interaction.guild.id, true, "enabled");
    client.db.set(interaction.guild.id, category.id, "category");

    const message = interaction.options.getString("message");
    if (message) client.db.set(interaction.guild.id, message, "message");

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          "ModMail system successfully enabled!"
        ),
      ],
      ephemeral: true,
    });
  },
};
