import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { emotes } from "../../../config.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "support",
  description: "Join my support server.",
  aliases: ["server"],
  run: async ({ message }) => {
    message.reply({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji(emotes.discord)
            .setLabel("Support server")
            .setURL("https://discord.gg/Txm4FYNpNs")
        ),
      ],
    });
  },
};
