import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Embed, FailEmbed } from "../../../structures/Embed.mjs";
import fs from "fs";
import { capitalize } from "../../../utils/functions.mjs";

/** @type {import("../../../utils/types.mjs").SlashCommand} */
export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View my commands.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to get information about.")
        .setRequired(false)
        .setAutocomplete(true)
    ),
  autocomplete: async ({ client, interaction }) => {
    const focusedValue = interaction.options.getFocused();
    const choices = client.commands.message
      .map((x) => x.name)
      .sort((a, b) => a.localeCompare(b));
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  run: async ({ client, interaction, prefix }) => {
    const cmd = interaction.options.getString("command");
    if (cmd) {
      const command =
        client.commands.message.get(cmd) ||
        client.commands.message.find((c) => c.aliases?.includes(cmd));
      if (!command)
        return interaction.reply({
          embeds: [
            new FailEmbed().setDescription(
              `Unknown command. Use \`${prefix}help\` to view all my commands.`
            ),
          ],
          ephemeral: true,
        });

      /** @type {string} */
      let description = "";
      const embed = new Embed().setTitle(command.name);

      if (command.description) description += command.description + "\n\n";
      if (command.aliases)
        description += `**Aliases**: ${command.aliases
          .map((v) => `\`${v}\``)
          .join(", ")}\n`;
      if (command.usage) {
        description += `**Usage**: ${prefix}${command.name} ${command.usage}\n`;
        embed.setFooter({
          text: "<> = required, [] = optional",
        });
      }
      if (command.userPermissions)
        description += `**Requried permissions**: ${new PermissionsBitField(
          command.userPermissions
        )
          .toArray()
          .map((x) => `\`${x}\``)
          .join(", ")}\n`;

      return interaction.reply({
        embeds: [embed.setDescription(description)],
        ephemeral: true,
      });
    } else {
      const categories = [];

      for (const dir of fs.readdirSync("./src/commands/message")) {
        const commands = fs
          .readdirSync(`./src/commands/message/${dir}`)
          .filter((file) => file.endsWith("js"));

        const cmds = await Promise.all(
          commands.map(async (command) => {
            let file = await import(
              `../../../commands/message/${dir}/${command}`
            ).then((x) => x?.default);
            if (!file?.name) return false;

            return `\`${file.name}\``;
          })
        ).then((x) => x.filter(Boolean).sort((a, b) => a.localeCompare(b)));

        if (!cmds) return;

        categories.push({
          name: `${capitalize(dir)} [${cmds.length}]`,
          value: cmds.join(", "),
        });
      }

      return interaction.reply({
        embeds: [
          new Embed()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setFields(categories),
        ],
        ephemeral: true,
      });
    }
  },
};
