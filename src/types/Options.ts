import { PermissionsBitField } from "discord.js";

export default interface Options {
    requiredPermissions?: PermissionsBitField[];
    serverOwnerOnly?: boolean;
    requiresPremium?: boolean;
    cooldownInSeconds?: number;
}