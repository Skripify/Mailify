import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "disable",
  description: "Disables the ModMail system.",
  aliases: ["deletesetup"],
  userPermissions: ["ManageGuild"],
  run: async ({ client, message }) => {
    client.db.ensure(message.guild.id, {
      enabled: false,
      category: null,
      message: "What do you need help with?",
    });

    if (client.db.get(message.guild.id, "enabled") === false)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            "This server hasn't enabled the ModMail system yet."
          ),
        ],
      });

    client.db.set(message.guild.id, false, "enabled");
    client.db.set(message.guild.id, null, "category");

    message.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          "Successfully disabled the ModMail system!"
        ),
      ],
    });
  },
};
