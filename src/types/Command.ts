import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Options from "./Options";

export default interface Command {
    data: SlashCommandBuilder;
    opts?: Options
    handle(client: Client, interaction: CommandInteraction): void;
}