import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("disable")
    .setDescription("Disables the ModMail system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ client, interaction }) => {
    client.db.ensure(interaction.guild.id, {
      enabled: false,
      category: null,
      message: "What do you need help with?",
    });

    if (client.db.get(interaction.guild.id, "enabled") === false)
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            "This server hasn't enabled the ModMail system yet."
          ),
        ],
        ephemeral: true,
      });

    client.db.set(interaction.guild.id, false, "enabled");
    client.db.set(interaction.guild.id, null, "category");

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          "Successfully disabled the ModMail system!"
        ),
      ],
      ephemeral: true,
    });
  },
};
