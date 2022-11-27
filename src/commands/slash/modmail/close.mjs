import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Closes the ticket.")
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you're closing this ticket.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ client, interaction, prefix }) => {
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
    if (!authorId)
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            `Couldn't find the user.\nClose this ticket by running \`${prefix}forceclose\`.`
          ),
        ],
        ephemeral: true,
      });

    let author = interaction.guild.members.cache.get(authorId);
    if (!author)
      author = await interaction.guild.members.fetch(authorId).catch(() => {});
    if (!author)
      return interaction.reply({
        embeds: [
          new FailEmbed().setDescription(
            `The user left the server.\nClose this ticket by running \`${prefix}forceclose\`.`
          ),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    client.db.delete(authorId);
    await author.send({
      embeds: [
        new SuccessEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle("Ticket closed.")
          .setDescription(reason),
      ],
    });
    interaction.channel.delete();
  },
};
