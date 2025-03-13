/*
 * CommandManager.js
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../util/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
class CommandManager {
    static commands = new Map();
    constructor() {
        CommandManager.commands = new Map();
    }
    registerCommand(data, command) {
        (0, logger_1.info)(`[CMD-MNGR] Adding command ${data.name}`);
        CommandManager.commands.set(data, command);
    }
    getCommands() {
        return CommandManager.commands;
    }
    setCommands(commands) {
        CommandManager.commands = commands;
    }
    getDeployableCommands() {
        return Array.from(CommandManager.commands.keys());
    }
    registerToClient(client) {
        for (const [data, command] of CommandManager.commands) {
            (0, logger_1.info)(`[CMD] [CLIENT] Registering command ${data.name}`);
            client.commands.set(data.name, command);
        }
    }
    async loadCommands(dir) {
        if (!dir)
            dir = __dirname + '/../commands';
        const files = fs_1.default.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            try {
                if (file.isDirectory()) {
                    (0, logger_1.info)(`[CMD] [DIR] Surfing ${file.name}`);
                    await this.loadCommands(path_1.default.join(dir, file.name));
                }
                else {
                    if (file.name.endsWith(".sig"))
                        continue;
                    (0, logger_1.info)(`[CMD] [FILE] Slapping ${file.name}`);
                    const commandPath = path_1.default.join(dir, file.name);
                    const command = (await Promise.resolve(`${`${commandPath}`}`).then(s => __importStar(require(s)))).default;
                    this.registerCommand(command.data, command);
                }
            }
            catch (ex) {
                (0, logger_1.error)(`[CMD] Error loading command ${file.name}: ${ex}: ${ex.stack}`);
            }
        }
    }
    async deployCommandsToGuild(id) {
        const commands = this.getDeployableCommands();
        const rest = new discord_js_1.REST().setToken(config_1.default.botToken);
        try {
            (0, logger_1.info)(`[CMD] Deploying ${commands.length} commands to guild ${id}`);
            await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.default.botClientId, id), { body: commands });
            (0, logger_1.info)(`[CMD] Successfully deployed ${commands.length} commands to guild ${id}`);
        }
        catch (ex) {
            (0, logger_1.error)(`[CMD] Error deploying commands to guild ${id}: ${ex}`);
        }
    }
}
exports.default = CommandManager;
