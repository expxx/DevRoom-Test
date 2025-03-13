import { Client, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Event from "./Event";

export default interface Extension {
    run(client: Client): void;
    setupCommands(): Promise<Map<SlashCommandBuilder, Command>>;
    setupEvents(): Promise<Event[]>;
    messages: {
        prefix: string;
        load: string;
        unload: string;
        reload: string;
    };
    settings: {
        name: string;
        description: string;
        adminApproved: boolean;
        disabled: boolean;
    };
}