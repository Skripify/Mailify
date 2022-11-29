import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Update the ModMail system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("category")
        .setDescription(
          "Create or update the category where the ticket channels go."
        )
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription(
              "The category where the ticket channels are supposed to go."
            )
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription(
          "Update the message that is sent whenever a new ticket is opened."
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              "The message to be sent whenever a new ticket is opened."
            )
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "category") {
      let category = interaction.options.getChannel("category");
      if (!category)
        category = await interaction.guild.channels.create({
          name: "ModMail",
          type: ChannelType.GuildCategory,
        });

      client.db.set(interaction.guild.id, category.id, "category");

      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription("Category updated successfully!"),
        ],
        ephemeral: true,
      });
    } else if (subcommand === "openmessage") {
      const openmsg = interaction.options.getString("message");

      client.db.set(interaction.guild.id, openmsg, "message");

      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            "Opening message updated successfully!"
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
