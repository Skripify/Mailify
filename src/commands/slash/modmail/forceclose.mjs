import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { FailEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("forceclose")
    .setDescription("Forcibly closes the ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ client, interaction }) => {
    if (
      client.db.get(interaction.guild.id, "category") !==
      interaction.channel.parentId
    )
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription("This channel isn't a ticket."),
        ],
        ephemeral: true,
      });

    const authorId = client.db.findKey(
      (d) =>
        d.guild === interaction.guild.id && d.ticket === interaction.channel.id
    );
    if (authorId) client.db.delete(authorId);

    interaction.channel.delete();
  },
};
