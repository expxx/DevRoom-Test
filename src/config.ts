import dotenv from 'dotenv';
import { fatal } from './util/logger';
dotenv.config();

export default {
    botToken: process.env.BOT_TOKEN || (fatal(`No bot token provided.`), ''),
    botClientId: process.env.BOT_CLIENT_ID || (fatal(`No bot client ID provided.`), ''),
    botGuildId: process.env.BOT_GUILD_ID || (fatal(`No bot guild ID provided.`), ''),
}