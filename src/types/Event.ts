import { Client, ClientEvents } from "discord.js";
import Options from "./Options";

export default interface Event {
    name: keyof ClientEvents;
    once: boolean;
    opts?: Options;
    handle(client: Client, ...args: any[]): void;
}