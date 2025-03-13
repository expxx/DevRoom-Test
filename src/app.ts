import config from './config';
import { fatal } from './util/logger';
import Command from './types/Command';
import { Client, Collection, IntentsBitField, Partials } from 'discord.js';
import CommandManager from './manager/CommandManager';
import EventManager from './manager/EventManager';
import { verifyAllFiles } from './util/sig';
const cmdManager = new CommandManager();
const eventManager = new EventManager();

(async () => {

    const client = new Client({
        intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildPresences],
        partials: [Partials.GuildMember, Partials.User]
    });

    client.commands = new Collection();

    await eventManager.loadEvents(__dirname + '/events');
    await cmdManager.loadCommands(__dirname + '/commands');
    eventManager.registerToClient(client);
    cmdManager.registerToClient(client);

    await cmdManager.deployCommandsToGuild(config.botGuildId);

    await client.login(config.botToken);
})();

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, Command>;
	}
}