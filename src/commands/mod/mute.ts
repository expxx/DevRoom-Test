import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import loadDB from "../../db/keyv";
import { fatal } from "../../util/logger";
import timestring from "timestring";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a user from the server")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the mute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kick').setRequired(false)),
    async handle(client: Client, interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;

        const userId = options.getUser('user')!.id;
        const user = await interaction.guild!.members.fetch(userId);
        const reason = options.getString('reason') || 'No reason provided';
        const duration = options.getString('duration') || '1d';
        
        try {
            let date = timestring(duration);
            if (isNaN(date)) {
                throw new Error('Invalid duration');
            }
            user.timeout(date * 1000, reason);
            const embed = new EmbedBuilder()
                .setDescription(`\`✅\` <@${interaction.user.id}>, <@${userId}> has been muted for \`${duration}\``)
                .setColor('Green')
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
        } catch {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\` <@${interaction.user.id}>, I cannot mute <@${userId}>`)
                .setColor('Red')
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
        }

        const db = loadDB();
        const logChannel = await db.get(`config:${interaction.guildId}`) as { logChannel: string } | undefined;
        if (!logChannel) {
            return fatal(`User <@${userId}> has been muted by <@${interaction.user.id}>. No logs channel found.`);
        }

        const channel = logChannel ? interaction.guild?.channels.cache.get(logChannel.logChannel) : null;
        if (!channel || !channel.isTextBased() || !channel.isSendable()) {
            return fatal(`User <@${userId}> has been muted by <@${interaction.user.id}>. Logs channel not found.`);
        }

        const logEmbed = new EmbedBuilder()
            .setTitle('User Muted')
            .setDescription(`User <@${userId}> has been muted by <@${interaction.user.id}> for \`${reason}\``)
            .setColor('Green')
            .setTimestamp()
        await (channel as TextChannel).send({ embeds: [logEmbed] });
    }
}