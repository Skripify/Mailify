import { PermissionsBitField } from "discord.js";
import { Embed, FailEmbed } from "../../../structures/Embed.mjs";
import fs from "fs";
import { capitalize } from "../../../utils/functions.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "help",
  description: "View my commands.",
  usage: "[command]",
  run: async ({ client, message, args, prefix }) => {
    const cmd = args[0]?.toLowerCase();
    if (cmd) {
      const command =
        client.commands.message.get(cmd) ||
        client.commands.message.find((c) => c.aliases?.includes(cmd));
      if (!command)
        return message.reply({
          embeds: [
            new FailEmbed().setDescription(
              `Unknown command. Use \`${prefix}help\` to view all my commands.`
            ),
          ],
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

      return message.reply({
        embeds: [embed.setDescription(description)],
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
            if (!file?.name) return;

            return `\`${file.name}\``;
          })
        ).then((x) => x.filter(Boolean).sort((a, b) => a.localeCompare(b)));

        if (!cmds) return;

        categories.push({
          name: `${capitalize(dir)} [${cmds.length}]`,
          value: cmds.join(", "),
        });
      }

      return message.reply({
        embeds: [
          new Embed()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setFields(categories),
        ],
      });
    }
  },
};
