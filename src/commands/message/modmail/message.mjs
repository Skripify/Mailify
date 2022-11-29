import { FailEmbed, SuccessEmbed } from "../../../structures/Embed.mjs";

/** @type {import('../../../utils/types.mjs').MessageCommand} */
export default {
  name: "message",
  description:
    "Update the message that is sent whenever a new ticket is opened. Tags `{user.name}`, `{user.tag}`, `{user.id}`, and `{user.mention}` can be used.",
  usage: "<message>",
  aliases: [
    "msg",
    "openmessage",
    "openmsg",
    "greetingmessage",
    "greetingmsg",
    "greetmessage",
    "welcomemessage",
    "welcomemsg",
  ],
  userPermissions: ["ManageGuild"],
  run: async ({ client, message, args }) => {
    const openmsg = args.join(" ");
    if (!openmsg)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            "A message is required. Tags `{user.name}`, `{user.tag}`, `{user.id}`, and `{user.mention}` can be used."
          ),
        ],
      });

    client.db.set(message.guild.id, openmsg, "message");

    message.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          "Opening message updated successfully!"
        ),
      ],
    });
  },
};
