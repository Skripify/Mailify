import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { emotes } from "../../../config.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "invite",
  description: "Invite me to your server!",
  aliases: ["add"],
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
            )
        ),
      ],
    });
  },
};
