import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get information about a user.")
        .addUserOption(option => option.setName("user").setDescription("The user to get information about.")),
    async handle(client: Client, interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const user = options.getUser("user") ?? interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('User Information')
            .setDescription([
                `**General Information**`,
                `> **Username**: ${user.tag} (\`${user.id}\`)`,
                `> **Account Creation Date**: <t:${Math.floor(user.createdTimestamp / 1000)}:F> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`,
                `> **Bot**: ${user.bot ? 'Yes' : 'No'}`,
                ``,
                `**Server Information**`,
                `> **Joined Server**: ${interaction.guild?.members.cache.has(user.id) ? 'Yes' : 'No'}`,
                `> **Top Role**: ${`<@&${interaction.guild?.members.cache.get(user.id)?.roles.highest.id}>` || 'None'}`,
                ``,
                `**Roles**`,
                interaction.guild?.members.cache.get(user.id)?.roles.cache.map(role => `> ~~-~~ <@&${role.id}>`).join('\n') || 'None'
            ].join('\n'))
            .setColor('Blue')
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    }
}