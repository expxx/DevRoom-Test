/*
 * setpoints.js
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const keyv_1 = __importDefault(require("../../db/keyv"));
const logger_1 = require("../../util/logger");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("setpoints")
        .setDescription('Sets the points for a user')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .addUserOption(option => option.setName('user').setDescription('The user to set points for').setRequired(true))
        .addIntegerOption(option => option.setName('points').setDescription('The points to set').setRequired(true)),
    async handle(client, interaction) {
        const db = (0, keyv_1.default)();
        const options = interaction.options;
        const user = options.getUser('user');
        const points = options.getInteger('points');
        await db.set(`points:${interaction.guildId}:${user.id}`, points);
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`\`✅\` <@${interaction.user.id}>, points for <@${user.id}> has been set to \`${points}\``)
            .setColor('Green')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        const logChannel = await db.get(`config:${interaction.guildId}`);
        if (!logChannel) {
            return (0, logger_1.fatal)(`Points for <@${user.id}> has been set to \`${points}\` by <@${interaction.user.id}>. No logs channel found.`);
        }
        const channel = logChannel ? interaction.guild?.channels.cache.get(logChannel.logChannel) : null;
        if (!channel || !channel.isTextBased() || !channel.isSendable()) {
            return (0, logger_1.fatal)(`Points for <@${user.id}> has been set to \`${points}\` by <@${interaction.user.id}>. Logs channel not found.`);
        }
        const logEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Points Set')
            .setDescription(`Points for <@${user.id}> has been set to \`${points}\` by <@${interaction.user.id}>`)
            .setColor('Green')
            .setTimestamp();
        await channel.send({ embeds: [logEmbed] });
    }
};
