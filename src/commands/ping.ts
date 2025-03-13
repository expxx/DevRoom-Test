import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async handle(client: Client, interaction: CommandInteraction) {
        await interaction.reply("Pong!");
    }
}