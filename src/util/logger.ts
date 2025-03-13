import chalk, { ChalkInstance } from "chalk";

export function log(level: string, color: ChalkInstance, message: string): void {
    const date = new Date();
    const timestamp = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(`${chalk.gray(`[${timestamp}]`)} ${color(level.toUpperCase())} | ${message}`);
}

export function debug(message: string) {
    log("debug", chalk.blue, message);
}

export function info(message: string) {
    log("info", chalk.green, message);
}

export function warn(message: string) {
    log("warn", chalk.yellow, message);
}

export function error(message: string) {
    log("error", chalk.red, message);
}

export function fatal(message: string) {
    log("fatal", chalk.bgRed.white, message);
}