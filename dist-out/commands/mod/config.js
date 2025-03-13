/*
 * config.js
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
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("config")
        .setDescription("Configures the bot")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .addChannelOption(option => option.setName('log-channel').setDescription('The channel to send logs to').setRequired(true)),
    async handle(client, interaction) {
        const db = (0, keyv_1.default)();
        const options = interaction.options;
        const logChannel = options.getChannel('log-channel');
        await db.set(`config:${interaction.guildId}`, { logChannel: logChannel.id });
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`\`✅\` <@${interaction.user.id}>, log channel has been set to <#${logChannel.id}>`)
            .setColor('Green')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
