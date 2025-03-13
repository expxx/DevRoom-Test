import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, PermissionsBitField, Role, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage roles')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
        .addSubcommand(sub =>
            sub.setName('assign')
                .setDescription('Assign a role to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to assign the role to')
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to assign')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove a role from a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to remove the role from')
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to remove')
                        .setRequired(true)
                )
        ),
    async handle(client: Client, interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const sub = options.getSubcommand();

        const user = options.getUser('user')!;
        const role = options.getRole('role')!;

        switch(sub) {
            case 'assign': {
                const rolePosition = role.position;
                const myPosition = interaction.guild?.members.me?.roles.highest.position;

                if(role.managed || rolePosition >= myPosition!) {
                    const embed = new EmbedBuilder()
                        .setDescription(`\`❌\` <@${interaction.user.id}>, I cannot assign the role <@&${role.id}> to <@${user.id}>`)
                        .setColor('Red')
                        .setTimestamp()
                    return await interaction.reply({ embeds: [embed] });
                }
                interaction.guild?.members.fetch(user.id).then(async member => {
                    await member.roles.add(role as Role);
                    const embed = new EmbedBuilder()
                        .setDescription(`\`✅\` <@${interaction.user.id}>, role <@&${role.id}> has been assigned to <@${user.id}>`)
                        .setColor('Green')
                        .setTimestamp()
                    return await interaction.reply({ embeds: [embed] });
                })
                break;
            }
            case 'remove': {
                const rolePosition = role.position;
                const myPosition = interaction.guild?.members.me?.roles.highest.position;

                if(role.managed || rolePosition >= myPosition!) {
                    const embed = new EmbedBuilder()
                        .setDescription(`\`❌\` <@${interaction.user.id}>, I cannot remove the role <@&${role.id}> from <@${user.id}>`)
                        .setColor('Red')
                        .setTimestamp()
                    return await interaction.reply({ embeds: [embed] });
                }
                interaction.guild?.members.fetch(user.id).then(async member => {
                    await member.roles.remove(role as Role);
                    const embed = new EmbedBuilder()
                        .setDescription(`\`✅\` <@${interaction.user.id}>, role <@&${role.id}> has been removed from <@${user.id}>`)
                        .setColor('Green')
                        .setTimestamp()
                    return await interaction.reply({ embeds: [embed] });
                })
                break;
            }
        }
    }   
}