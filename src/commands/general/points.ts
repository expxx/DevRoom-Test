import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import loadDB from "../../db/keyv";

export default {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription('Shows the points of a user')
        .addUserOption(option => option.setName('user').setDescription('The user to show points for')),
    async handle(client: Client, interaction: CommandInteraction) {
        const db = loadDB()
        const options = interaction.options as CommandInteractionOptionResolver;
        const user = options.getUser('user') || interaction.user;

        const points = await db.get(`points:${interaction.guildId}:${user.id}`) || 0;
        const embed = new EmbedBuilder()
            .setDescription(`\`🏆\` <@${interaction.user.id}>, <@${user.id}> has \`${points}\` points.`)
            .setColor('Green')
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    }
}