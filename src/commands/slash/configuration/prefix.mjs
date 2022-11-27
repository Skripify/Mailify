import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Changes the prefix for this server.")
    .addStringOption((option) =>
      option
        .setName("new_prefix")
        .setDescription("The new prefix.")
        .setMaxLength(5)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ client, interaction, args }) => {
    const newPrefix = interaction.options.getString("new_prefix");

    client.db.set(interaction.guild.id, newPrefix, "prefix");

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `Changed this server's prefix to \`${newPrefix}\`.`
        ),
      ],
      ephemeral: true,
    });
  },
};
