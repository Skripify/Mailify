import { InteractionType } from "discord.js";
import { FailEmbed } from "../structures/Embed.mjs";

/**
 * @param {import("../structures/BotClient.mjs").BotClient} client
 * @param {import("discord.js").Interaction} interaction
 */
export default async (client, interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = client.commands.slash.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run({
        client,
        interaction,
        prefix: client.db.get(interaction.guild.id, "prefix"),
      });
    } catch (err) {
      console.log(err);
      interaction.reply({
        embeds: [
          new FailEmbed().addFields({
            name: "An error occured.",
            value: `\`\`\`${err}\`\`\``,
          }),
        ],
        ephemeral: true,
      });
    }
  } else if (
    interaction.type === InteractionType.ApplicationCommandAutocomplete
  ) {
    const command = client.commands.slash.get(interaction.commandName);
    if (!command) return;

    try {
      await command.autocomplete({ client, interaction });
    } catch (err) {
      console.log(err);
    }
  }
};
