import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { emotes } from "../../../config.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite me to your server!"),
  run: async ({ client, interaction }) => {
    interaction.reply({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji(emotes.logo)
            .setLabel("Invite me!")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=289880`
            )
        ),
      ],
      ephemeral: true,
    });
  },
};
