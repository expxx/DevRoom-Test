import { Client, Events, GuildMember, TextChannel } from "discord.js";
import loadDB from "../db/keyv";

export default {
    name: Events.GuildMemberAdd,
    once: false,
    async handle(client: Client, member: GuildMember) {
        const db = loadDB()
        const data = await db.get(`welcome:${member.guild.id}`) as { channel: string, message: string } | undefined;
        if (!data) return;
        const channel = member.guild.channels.cache.get(data.channel);
        if (!channel || !channel.isSendable() || !(channel instanceof TextChannel)) return;
        (channel as TextChannel).send(data.message.replace(/{user}/g, `<@${member.id}>`));
    }
}