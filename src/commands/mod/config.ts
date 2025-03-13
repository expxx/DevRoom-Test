import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import loadDB from "../../db/keyv";

export default {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configures the bot")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption(option => option.setName('log-channel').setDescription('The channel to send logs to').setRequired(true)),
    async handle(client: Client, interaction: CommandInteraction) {
        const db = loadDB()

        const options = interaction.options as CommandInteractionOptionResolver;
        const logChannel = options.getChannel('log-channel')!;

        await db.set(`config:${interaction.guildId}`, { logChannel: logChannel.id });
        const embed = new EmbedBuilder()
            .setDescription(`\`✅\` <@${interaction.user.id}>, log channel has been set to <#${logChannel.id}>`)
            .setColor('Green')
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    }
}