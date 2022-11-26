import { Embed } from "../../../structures/Embed.mjs";

/** @type {import("../../../utils/types.mjs").MessageCommand} */
export default {
  name: "ping",
  description: "Pings the bot.",
  run: async ({ client, message }) => {
    await message
      .reply({
        embeds: [new Embed().setDescription("Pinging...")],
      })
      .then((res) => {
        const ping = res.createdTimestamp - message.createdTimestamp;

        res.edit({
          embeds: [
            new Embed().setDescription(
              `**🧠 Bot**: ${ping}ms\n**📶 API**: ${client.ws.ping}ms`
            ),
          ],
        });
      });
  },
};
