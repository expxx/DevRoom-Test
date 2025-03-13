import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import loadDB from "../../db/keyv";
import { fatal } from "../../util/logger";

export default {
    data: new SlashCommandBuilder()
        .setName("setpoints")
        .setDescription('Sets the points for a user')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addUserOption(option => option.setName('user').setDescription('The user to set points for').setRequired(true))
        .addIntegerOption(option => option.setName('points').setDescription('The points to set').setRequired(true)),
    async handle(client: Client, interaction: CommandInteraction) {
        const db = loadDB()

        const options = interaction.options as CommandInteractionOptionResolver;
        const user = options.getUser('user')!;
        const points = options.getInteger('points')!;

        await db.set(`points:${interaction.guildId}:${user.id}`, points);
        const embed = new EmbedBuilder()
            .setDescription(`\`✅\` <@${interaction.user.id}>, points for <@${user.id}> has been set to \`${points}\``)
            .setColor('Green')
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });

        const logChannel = await db.get(`config:${interaction.guildId}`) as { logChannel: string } | undefined;
        if (!logChannel) {
            return fatal(`Points for <@${user.id}> has been set to \`${points}\` by <@${interaction.user.id}>. No logs channel found.`);
        }
        const channel = logChannel ? interaction.guild?.channels.cache.get(logChannel.logChannel) : null;
        if (!channel || !channel.isTextBased() || !channel.isSendable()) {
            return fatal(`Points for <@${user.id}> has been set to \`${points}\` by <@${interaction.user.id}>. Logs channel not found.`);
        }
        const logEmbed = new EmbedBuilder()
            .setTitle('Points Set')
            .setDescription(`Points for <@${user.id}> has been set to \`${points}\` by <@${interaction.user.id}>`)
            .setColor('Green')
            .setTimestamp()
        await (channel as TextChannel).send({ embeds: [logEmbed] });
    }
}