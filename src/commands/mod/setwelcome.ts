import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import loadDB from "../../db/keyv";

export default {
    data: new SlashCommandBuilder()
        .setName("setwelcome")
        .setDescription('Sets the welcome channel and message')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the welcome message to').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('The welcome message').setRequired(true)),
    async handle(client: Client, interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const channel = options.getChannel('channel')!;
        const message = options.getString('message')!;

        const db = loadDB();

        await db.set(`welcome:${interaction.guildId}`, { channel: channel.id, message });
        const embed = new EmbedBuilder()
            .setDescription(`\`✅\` <@${interaction.user.id}>, welcome message has been set to \`"${message}"\` and will be sent to <#${channel.id}>`)
            .setColor('Green')
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    }
}