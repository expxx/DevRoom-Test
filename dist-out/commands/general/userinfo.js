/*
 * userinfo.js
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
        .setName("userinfo")
        .setDescription("Get information about a user.")
        .addUserOption(option => option.setName("user").setDescription("The user to get information about.")),
    async handle(client, interaction) {
        const options = interaction.options;
        const user = options.getUser("user") ?? interaction.user;
        const embed = new discord_js_1.EmbedBuilder()
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
};
