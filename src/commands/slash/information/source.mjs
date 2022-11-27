import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("source")
    .setDescription("View my source code."),
  run: async ({ interaction }) => {
    interaction.reply({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji("💻")
            .setLabel("GitHub repository")
            .setURL("https://github.com/Skripify/Mailify")
        ),
      ],
      ephemeral: true,
    });
  },
};
