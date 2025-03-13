import { SlashCommandBuilder, Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Echo a message as the bot.')
        .addStringOption(option => option.setName('message').setDescription('The message to echo.').setRequired(true)),
    async handle(client: Client, interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const message = options.getString('message')!;

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(message)
            .setColor('Random')
            .setTimestamp()
        
        await interaction.reply({ embeds: [embed] });
    }
}