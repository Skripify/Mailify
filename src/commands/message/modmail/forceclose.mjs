import { FailEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "forceclose",
  description: "Forcibly closes the ticket.",
  userPermissions: ["ManageGuild"],
  run: async ({ client, message }) => {
    if (
      client.db.get(message.guild.id, "category") !== message.channel.parentId
    )
      return message.reply({
        embeds: [
          new FailEmbed().setDescription("This channel isn't a ticket."),
        ],
      });

    const authorId = client.db.findKey(
      (d) => d.guild === message.guild.id && d.ticket === message.channel.id
    );
    if (authorId) client.db.delete(authorId);

    message.channel.delete();
  },
};
