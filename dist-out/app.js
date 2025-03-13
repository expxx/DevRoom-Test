/*
 * app.js
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
const config_1 = __importDefault(require("./config"));
const logger_1 = require("./util/logger");
const discord_js_1 = require("discord.js");
const CommandManager_1 = __importDefault(require("./manager/CommandManager"));
const EventManager_1 = __importDefault(require("./manager/EventManager"));
const sig_1 = require("./util/sig");
const cmdManager = new CommandManager_1.default();
const eventManager = new EventManager_1.default();
(async () => {
    if (__dirname.includes('dist-out')) {
        const isValid = await (0, sig_1.verifyAllFiles)(__dirname);
        if (!isValid) {
            (0, logger_1.fatal)('Failed to verify all files. Exiting...');
            process.exit(1);
        }
    }
    const client = new discord_js_1.Client({
        intents: [discord_js_1.IntentsBitField.Flags.Guilds, discord_js_1.IntentsBitField.Flags.GuildMembers, discord_js_1.IntentsBitField.Flags.GuildPresences],
        partials: [discord_js_1.Partials.GuildMember, discord_js_1.Partials.User]
    });
    client.commands = new discord_js_1.Collection();
    await eventManager.loadEvents(__dirname + '/events');
    await cmdManager.loadCommands(__dirname + '/commands');
    eventManager.registerToClient(client);
    cmdManager.registerToClient(client);
    await cmdManager.deployCommandsToGuild(config_1.default.botGuildId);
    await client.login(config_1.default.botToken);
})();


const a4ea43f4ff4bb4fd7995f4a3bc0a4861e = "%%__NONCE__%%"