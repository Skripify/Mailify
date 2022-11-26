import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import Enmap from "enmap";
import { importFile } from "../utils/functions.mjs";
import { guildId } from "../config.mjs";

export class BotClient extends Client {
  /** @type {import('../utils/types.mjs').Commands} */
  commands = {
    message: new Collection(),
    slash: new Collection(),
  };

  db = new Enmap({
    name: "db",
    dataDir: "./db",
  });

  /** @type {import("../utils/types.mjs").EnvConfig} */
  env = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
  };

  /** @param {Omit<import("discord.js").ClientOptions, "intents">} options */
  constructor(options = {}) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
      ...options,
    });
  }

  async init() {
    await this.ensureEnv();
    await this.registerMessageCommands();
    await this.registerSlashCommands();
    await this.registerEvents();
    this.login(process.env.TOKEN);
  }

  async ensureEnv() {
    if (this.env.token?.length < 10)
      throw new SyntaxError("No valid token provided.");
    if (!this.env.prefix?.length) this.env.prefix = "!";
  }

  async registerMessageCommands() {
    fs.readdirSync("./src/commands/message").forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(`./src/commands/message/${dir}`)
        .filter((file) => file.endsWith("js"));

      for (const file of commandFiles) {
        const command = await importFile(`../commands/message/${dir}/${file}`);
        if (!command.name) continue;
        if (!command.run) continue;

        this.commands.message.set(command.name, { directory: dir, ...command });
      }
    });
  }

  async registerSlashCommands() {
    /** @type {ApplicationCommandDataResolvable[]} */
    const commands = [];
    fs.readdirSync("./src/commands/slash").forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(`./src/commands/slash/${dir}`)
        .filter((file) => file.endsWith("js"));

      for (const file of commandFiles) {
        const command = await importFile(`../commands/slash/${dir}/${file}`);
        if (!command.data) continue;
        if (!command.run) continue;

        this.commands.slash.set(command.data.toJSON().name, command);
        commands.push(command.data.toJSON());
      }
    });

    this.on("ready", async () => {
      if (guildId?.length) {
        const guild = await this.guilds.cache.get(guildId);
        if (!guild) return;
        await guild.commands.set(commands);
      } else {
        await this.application?.commands.set(commands);
      }
    });
  }

  async registerEvents() {
    const eventFiles = fs
      .readdirSync("./src/events")
      .filter((file) => file.endsWith("js"));

    for (const file of eventFiles) {
      const event = await importFile(`../events/${file}`);
      const eventName = file.split(".")[0];
      this.on(eventName, event.bind(null, this));
    }
  }
}
