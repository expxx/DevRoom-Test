import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import loadDB from "../../db/keyv";
import { fatal } from "../../util/logger";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),
    async handle(client: Client, interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;

        const userId = options.getUser('user')!.id;
        const user = await interaction.guild!.members.fetch(userId);
        const reason = options.getString('reason') || 'No reason provided';

        if(user.bannable) {
            await user.ban({ reason });
            const embed = new EmbedBuilder()
                .setDescription(`\`✅\` <@${interaction.user.id}>, <@${userId}> has been banned from the server`)
                .setColor('Green')
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\` <@${interaction.user.id}>, I cannot ban <@${userId}>`)
                .setColor('Red')
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
        }

        const db = loadDB();
        const logChannel = await db.get(`config:${interaction.guildId}`) as { logChannel: string } | undefined;
        if (!logChannel) {
            return fatal(`User <@${userId}> has been banned by <@${interaction.user.id}>. No logs channel found.`);
        }

        const channel = logChannel ? interaction.guild?.channels.cache.get(logChannel.logChannel) : null;
        if (!channel || !channel.isTextBased() || !channel.isSendable()) {
            return fatal(`User <@${userId}> has been banned by <@${interaction.user.id}>. Logs channel not found.`);
        }

        const logEmbed = new EmbedBuilder()
            .setTitle('User Banned')
            .setDescription(`User <@${userId}> has been banned by <@${interaction.user.id}> for \`${reason}\``)
            .setColor('Green')
            .setTimestamp()
        await (channel as TextChannel).send({ embeds: [logEmbed] });
    }
}