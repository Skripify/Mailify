import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "source",
  description: "View my source code.",
  aliases: ["github"],
  run: async ({ message }) => {
    message.reply({
      components: [
        new ActionRowBuilder().addComponents(
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
