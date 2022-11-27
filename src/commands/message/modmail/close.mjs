import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "close",
  description: "Closes the ticket.",
  usage: "[reason]",
  userPermissions: ["ManageGuild"],
  run: async ({ client, message, args, prefix }) => {
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
    if (!authorId)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            `Couldn't find the user.\nClose this ticket by running \`${prefix}forceclose\`.`
          ),
        ],
      });

    let author = message.guild.members.cache.get(authorId);
    if (!author)
      author = await message.guild.members.fetch(authorId).catch(() => {});
    if (!author)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            `The user left the server.\nClose this ticket by running \`${prefix}forceclose\`.`
          ),
        ],
      });

    const reason = args.join(" ") || "No reason provided.";

    client.db.delete(authorId);
    await author.send({
      embeds: [
        new SuccessEmbed()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTitle("Ticket closed.")
          .setDescription(reason),
      ],
    });
    message.channel.delete();
  },
};
