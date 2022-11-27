import { ActivityType } from "discord.js";

/**
 * @param {import("../structures/BotClient.mjs").BotClient} client
 * @param {string} id
 */
export default (client, id) => {
  console.log(`Launched shard #${id}.`);

  client.user.setActivity(`my DMs | Shard #${id}`, {
    shardId: id,
    type: ActivityType.Watching,
  });
};
