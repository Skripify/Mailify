import "dotenv/config";

import { BotClient } from "./structures/BotClient.mjs";
import { ActivityType } from "discord.js";

const client = new BotClient({
  allowedMentions: {
    parse: [],
    roles: [],
    users: [],
    repliedUser: false,
  },
  presence: {
    activities: [
      {
        name: "my DMs",
        type: ActivityType.Watching,
      },
    ],
  },
  shards: "auto",
});

client.init();
