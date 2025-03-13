import { ButtonBuilder, ButtonInteraction, Client } from 'discord.js';
import Options from "./Options";

export default interface Button {
    customId: string;
    opts?: Options;
    handle: (client: Client, interaction: ButtonInteraction) => void;
    get: () => ButtonBuilder;
}