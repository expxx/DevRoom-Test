import { Client, ModalBuilder, ModalSubmitInteraction, User } from "discord.js";
import Options from "./Options";

export default interface Modal {
    customId: string;
    opts?: Options;
    handle: (client: Client, interaction: ModalSubmitInteraction) => void;
    get: () => ModalBuilder;
    show: (user: User) => void;
}