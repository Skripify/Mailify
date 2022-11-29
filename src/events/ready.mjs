import { postStats } from "../config.mjs";
import { Poster } from "dbots";

/** @param {import("../structures/BotClient.mjs").BotClient} client */
export default (client) => {
  console.log(`Logged in as ${client.user.tag}`);

  if (postStats) {
    const poster = new Poster({
      client,
      apiKeys: {
        infinitybotlist: process.env.INFINITYBOTS_TOKEN,
      },
      clientLibrary: "discord.js",
    });

    poster.startInterval();
  }
};
