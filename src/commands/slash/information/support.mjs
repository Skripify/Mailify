import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { emotes } from "../../../config.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Join my support server."),
  run: async ({ interaction }) => {
    interaction.reply({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji(emotes.discord)
            .setLabel("Support server")
            .setURL("https://discord.gg/Txm4FYNpNs")
        ),
      ],
      ephemeral: true,
    });
  },
};
