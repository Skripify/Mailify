import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { emotes } from "../../../config.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "links",
  description: "See all my links.",
  run: async ({ client, message }) => {
    message.reply({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji(emotes.logo)
            .setLabel("Invite me!")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=289880`
            ),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji(emotes.discord)
            .setLabel("Support server")
            .setURL("https://discord.gg/Txm4FYNpNs"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji("💻")
            .setLabel("GitHub repository")
            .setURL("https://github.com/Skripify/Mailify")
        ),
      ],
    });
  },
};
