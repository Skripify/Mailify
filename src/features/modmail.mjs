import { AttachmentBuilder, ChannelType, DiscordAPIError } from "discord.js";
import { emotes } from "../config.mjs";
import { Embed, FailEmbed, SuccessEmbed } from "../structures/Embed.mjs";

/** @type {import("../utils/types.mjs").Feature} */
export default (client) => {
  // Server
  client.on("messageCreate", async (message) => {
    if (
      !message.guild ||
      message.channel.type === ChannelType.DM ||
      message.author.bot
    )
      return;

    client.db.ensure(message.guild.id, {
      prefix: client.env.prefix,
      enabled: false,
      category: null,
      message: "What do you need help with?",
    });

    const serverauthor = message.author;
    const data = client.db.get(message.guild.id);
    if (
      message.content.startsWith(data.prefix) ||
      data.category !== message.channel.parentId
    )
      return;

    const authorId = client.db.findKey(
      (d) => d.guild === message.guild.id && d.ticket === message.channel.id
    );
    if (!authorId) return;

    let author = message.guild.members.cache.get(authorId);
    if (!author)
      author = await message.guild.members.fetch(authorId).catch(() => {});
    if (!author)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            `The user left the server. Close this ticket by running \`${data.prefix}forceclose\`.`
          ),
        ],
      });

    message.react("📨");

    let files = [];
    if (message.attachments.size > 0) {
      if (
        !["png", "jpeg", "jpg", "gif", "webp"].some((i) =>
          message.attachments.first()?.url?.toLowerCase()?.includes(i)
        )
      )
        files = [];
      files = [new AttachmentBuilder(message.attachments.first()?.url)];
    }

    const embed = new Embed()
      .setAuthor({
        name: serverauthor.tag,
        iconURL: serverauthor.displayAvatarURL(),
      })
      .setTitle("📨 Recieved a message");

    if (message.content)
      embed.setDescription(message.content.substring(0, 2048));
    if (files.length > 0) embed.setImage("attachment://unknown.png");

    author
      .send({
        embeds: [embed],
        files,
      })
      .then(() => message.react(emotes.success))
      .catch((err) => {
        console.log(err);
        message.react(emotes.fail);
      });
  });

  // DMs
  client.on("messageCreate", async (message) => {
    if (
      message.guild ||
      message.channel.type !== ChannelType.DM ||
      message.author.bot
    )
      return;

    const dmauthor = message.author;
    if (!client.db.has(dmauthor.id)) {
      /** @type {import('discord.js').Guild[]} */
      const mutualGuilds = [];

      for (const guild of [...client.guilds.cache.values()].filter(
        (g) => client.db.has(g.id) && client.db.get(g.id, "enabled")
      )) {
        try {
          await guild.members.fetch(dmauthor.id);
          mutualGuilds.push(guild.id);
        } catch {}
      }

      if (!mutualGuilds || mutualGuilds.length === 0)
        return message.reply({
          embeds: [
            new FailEmbed().setDescription("We don't share any servers."),
          ],
        });
      else if (mutualGuilds.length === 1) {
        const guild = client.guilds.cache.get(mutualGuilds[0]);
        createTicket(message, guild, dmauthor);
      } else {
        const selectedId = message.content;
        const guild = client.guilds.cache.get(selectedId);
        if (guild) {
          return createTicket(message, guild, dmauthor);
        } else if (!isNaN(selectedId) && !guild)
          return message.reply({
            embeds: [new FailEmbed().setDescription("Invalid server ID.")],
          });

        message.reply({
          embeds: [
            new Embed()
              .setTitle("Select what server you want to contact")
              .setDescription(
                `You can do this by sending the server's ID.\n**Example**: ${mutualGuilds[0]}`
              ),
            new Embed()
              .setTitle("All servers we are both in")
              .setDescription(
                mutualGuilds
                  .map((id) =>
                    client.guilds.cache.get(id)
                      ? `**${client.guilds.cache.get(id).name}** (\`${id}\`)`
                      : `\`${id}\``
                  )
                  .join("\n")
                  .substring(0, 2048)
              )
              .setFooter({
                text: "If the server you want isn't here, just send it's ID!",
              }),
          ],
        });
      }
    } else {
      const guild = client.guilds.cache.get(
        client.db.get(dmauthor.id, "guild")
      );
      if (!guild) {
        client.db.delete(dmauthor.id);
        return message.reply({
          embeds: [
            new FailEmbed().setDescription(
              "The server you were talking to could not be found. Try again."
            ),
          ],
        });
      }

      const channel = guild.channels.cache.get(
        client.db.get(dmauthor.id, "ticket")
      );
      if (!channel) {
        client.db.delete(dmauthor.id);
        return message.reply({
          embeds: [
            new FailEmbed().setDescription(
              "The server you were talking to could not be found. Try again."
            ),
          ],
        });
      }

      message.react("📨");

      let files = [];
      if (message.attachments.size > 0) {
        if (
          !["png", "jpeg", "jpg", "gif", "webp"].some((i) =>
            message.attachments.first()?.url?.toLowerCase()?.includes(i)
          )
        )
          files = [];
        files = [new AttachmentBuilder(message.attachments.first()?.url)];
      }

      const embed = new Embed()
        .setAuthor({
          name: dmauthor.tag,
          iconURL: dmauthor.displayAvatarURL(),
        })
        .setTitle("📨 Sent a message");

      if (message.content)
        embed.setDescription(message.content.substring(0, 2048));
      if (files.length > 0) embed.setImage("attachment://unknown.png");

      channel
        .send({
          embeds: [embed],
          files,
        })
        .then(() => message.react(emotes.success))
        .catch((err) => {
          console.log(err);
          message.react(emotes.fail);
        });
    }
  });

  /**
   *
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Guild} guild
   * @param {import('discord.js').User} dmauthor
   */
  function createTicket(message, guild, dmauthor) {
    client.db.ensure(guild.id, {
      enabled: false,
      category: null,
      message: "What do you need help with?",
    });

    const data = client.db.get(guild.id);
    if (!data.enabled)
      return message.reply({
        embeds: [
          new FailEmbed().setDescription(
            "The specified server doesn't have the ModMail system enabled."
          ),
        ],
      });

    let category = guild.channels.cache.get(data.category);
    if (
      category &&
      category.type === ChannelType.GuildCategory &&
      category.children.cache.size
    )
      category = null;

    guild.channels
      .create({
        name: `ticket-${dmauthor.username}`,
        type: ChannelType.GuildText,
        topic: `**Ticket for**: ${dmauthor.tag} | ${dmauthor.id}`,
      })
      .then((channel) => {
        if (category) {
          channel.setParent(category.id).then((c) => c.lockPermissions());
        } else {
          channel.permissionOverwrites.edit(guild.roles.everyone, {
            ViewChannel: false,
          });
        }

        client.db.set(dmauthor.id, guild.id, "guild");
        client.db.set(dmauthor.id, channel.id, "ticket");

        message
          .reply({
            embeds: [
              new SuccessEmbed().addFields({
                name: "Successfully created your ticket!",
                value: data.message,
              }),
            ],
          })
          .catch(() => {});

        channel.send({
          embeds: [
            new Embed()
              .setAuthor({
                name: dmauthor.tag,
                iconURL: dmauthor.displayAvatarURL(),
              })
              .setTitle("Created a ticket!")
              .addFields({
                name: "Visibility",
                value: !category ? "Admins only" : "Specified by the category",
              }),
          ],
        });
      });
  }
};
