import { Client, CommandInteraction, Events } from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async handle(client: Client, interaction: CommandInteraction) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            command.handle(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
}