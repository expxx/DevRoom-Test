/*
 * hello.js
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
const crypto_1 = require("crypto");
const discord_js_1 = require("discord.js");
const emojis = [
    "😊", "😂", "❤️", "🔥", "👍", "🎉", "✨", "🤔", "😎", "🍕",
    "🎮", "🐱", "🐶", "🌍", "🌈", "🚀", "💡", "📚", "🎨", "🎶",
    "🍦", "🍩", "🍵", "⚡", "💎", "🦄", "👾", "🛸", "🧋", "🥳",
    "🤖", "👻", "💀", "👑", "🪄", "🎁", "🕹️", "📱", "💻", "⌨️",
    "🖱️", "🎧", "📷", "🎥", "📡", "🔮", "🧿", "🕶️", "👟", "🧢"
];
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('hello')
        .setDescription('Say hi to the bot!'),
    async handle(client, interaction) {
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`\`👋\` Why, hello there <@${interaction.user.id}> ${emojis[(0, crypto_1.randomInt)(emojis.length - 1)]}!`)
            .setColor('Random')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
