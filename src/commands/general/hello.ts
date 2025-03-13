import { randomInt } from 'crypto';
import { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } from 'discord.js';

const emojis = [
    "😊", "😂", "❤️", "🔥", "👍", "🎉", "✨", "🤔", "😎", "🍕", 
    "🎮", "🐱", "🐶", "🌍", "🌈", "🚀", "💡", "📚", "🎨", "🎶", 
    "🍦", "🍩", "🍵", "⚡", "💎", "🦄", "👾", "🛸", "🧋", "🥳", 
    "🤖", "👻", "💀", "👑", "🪄", "🎁", "🕹️", "📱", "💻", "⌨️", 
    "🖱️", "🎧", "📷", "🎥", "📡", "🔮", "🧿", "🕶️", "👟", "🧢"
]

export default {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Say hi to the bot!'),
    async handle(client: Client, interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setDescription(`\`👋\` Why, hello there <@${interaction.user.id}> ${emojis[randomInt(emojis.length - 1)]}!`)
            .setColor('Random')
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    }
}