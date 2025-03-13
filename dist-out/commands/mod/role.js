/*
 * role.js
 * 
 * This file is part of the devroom-test project, licensed under The Cavern OSL (Version 1.0).
 * 
 * Copyright (c) 2025 TheCavernStudios. All rights reserved.
 * 
 * License Grant:
 * - Subject to the terms of The Cavern Studios OSL, you are granted a worldwide, royalty-free,
 *   non-exclusive, non-transferable license to use, modify, and privately utilize this file,
 *   including for commercial purposes, under the conditions outlined in the license.
 * 
 * Conditions:
 * - Any modifications made to this file must be disclosed and documented.
 * - This license and all copyright notices must be retained in all copies or substantial portions.
 * - Derivative works must be licensed under the same terms as The Cavern OSL.
 * 
 * Restrictions:
 * - This file may not be shared, distributed, sold, leased, sublicensed, or transferred.
 * - The source code may not be obfuscated or resold in any form.
 * 
 * Limitations:
 * - This file and its source code must remain with the Licensee only and may not be shared with third parties.
 * - The Licensee assumes all risk associated with the use or modification of this file.
 * 
 * For the full license text, refer to the LICENSE file included with this project.
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage roles')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.ManageRoles)
        .addSubcommand(sub => sub.setName('assign')
        .setDescription('Assign a role to a user')
        .addUserOption(option => option.setName('user')
        .setDescription('The user to assign the role to')
        .setRequired(true))
        .addRoleOption(option => option.setName('role')
        .setDescription('The role to assign')
        .setRequired(true)))
        .addSubcommand(sub => sub.setName('remove')
        .setDescription('Remove a role from a user')
        .addUserOption(option => option.setName('user')
        .setDescription('The user to remove the role from')
        .setRequired(true))
        .addRoleOption(option => option.setName('role')
        .setDescription('The role to remove')
        .setRequired(true))),
    async handle(client, interaction) {
        const options = interaction.options;
        const sub = options.getSubcommand();
        const user = options.getUser('user');
        const role = options.getRole('role');
        switch (sub) {
            case 'assign': {
                const rolePosition = role.position;
                const myPosition = interaction.guild?.members.me?.roles.highest.position;
                if (role.managed || rolePosition >= myPosition) {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setDescription(`\`❌\` <@${interaction.user.id}>, I cannot assign the role <@&${role.id}> to <@${user.id}>`)
                        .setColor('Red')
                        .setTimestamp();
                    return await interaction.reply({ embeds: [embed] });
                }
                interaction.guild?.members.fetch(user.id).then(async (member) => {
                    await member.roles.add(role);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setDescription(`\`✅\` <@${interaction.user.id}>, role <@&${role.id}> has been assigned to <@${user.id}>`)
                        .setColor('Green')
                        .setTimestamp();
                    return await interaction.reply({ embeds: [embed] });
                });
                break;
            }
            case 'remove': {
                const rolePosition = role.position;
                const myPosition = interaction.guild?.members.me?.roles.highest.position;
                if (role.managed || rolePosition >= myPosition) {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setDescription(`\`❌\` <@${interaction.user.id}>, I cannot remove the role <@&${role.id}> from <@${user.id}>`)
                        .setColor('Red')
                        .setTimestamp();
                    return await interaction.reply({ embeds: [embed] });
                }
                interaction.guild?.members.fetch(user.id).then(async (member) => {
                    await member.roles.remove(role);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setDescription(`\`✅\` <@${interaction.user.id}>, role <@&${role.id}> has been removed from <@${user.id}>`)
                        .setColor('Green')
                        .setTimestamp();
                    return await interaction.reply({ embeds: [embed] });
                });
                break;
            }
        }
    }
};
