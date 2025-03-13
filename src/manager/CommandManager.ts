import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import Command from "../types/Command";
import { debug, error, info } from "../util/logger";
import fs from 'fs';
import path from "path";
import config from "../config";

class CommandManager {
    public static commands: Map<SlashCommandBuilder, Command> = new Map();

    constructor() {
        CommandManager.commands = new Map<SlashCommandBuilder, Command>();
    }

    public registerCommand(data: SlashCommandBuilder, command: Command) {
        info(`[CMD-MNGR] Adding command ${data.name}`);
        CommandManager.commands.set(data, command);
    }

    public getCommands() {
        return CommandManager.commands;
    }

    public setCommands(commands: Map<SlashCommandBuilder, Command>) {
        CommandManager.commands = commands;
    }

    public getDeployableCommands(): SlashCommandBuilder[] {
        return Array.from(CommandManager.commands.keys());
    }

    public registerToClient(client: Client) {
        for (const [data, command] of CommandManager.commands) {
            info(`[CMD] [CLIENT] Registering command ${data.name}`);
            client.commands.set(data.name, command);
        }
    }

    public async loadCommands(dir: string) {
        if (!dir) dir = __dirname + '/../commands';
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            try {
                if (file.isDirectory()) {
                    info(`[CMD] [DIR] Surfing ${file.name}`);
                    await this.loadCommands(path.join(dir, file.name));
                } else {
                    if(file.name.endsWith(".sig")) continue;
                    info(`[CMD] [FILE] Slapping ${file.name}`);
                    const commandPath = path.join(dir, file.name);
                    const command = (await import(`${commandPath}`)).default as Command;
                    this.registerCommand(command.data, command);
                }
            } catch (ex: any) {
                error(`[CMD] Error loading command ${file.name}: ${ex}: ${ex.stack}`);
            }
        }
    }

    public async deployCommandsToGuild(id: string) {
        const commands = this.getDeployableCommands();
        const rest = new REST().setToken(config.botToken);
        try {
            info(`[CMD] Deploying ${commands.length} commands to guild ${id}`);
            await rest.put(
                Routes.applicationGuildCommands(config.botClientId, id),
                { body: commands }
            );
            info(`[CMD] Successfully deployed ${commands.length} commands to guild ${id}`);
        } catch (ex) {
            error(`[CMD] Error deploying commands to guild ${id}: ${ex}`);
        }
    }
}

export default CommandManager;