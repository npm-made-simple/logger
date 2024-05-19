import fs from "node:fs";
import _chalk from "chalk";
export const chalk = _chalk;

const date = new Date().toLocaleDateString().replace(/\//g, "-");

if (!fs.existsSync("logs")) fs.mkdirSync("logs");
if (fs.existsSync("logs/latest.log")) {
    const data = fs.readFileSync("logs/latest.log", "utf-8");
    const fileDate = data.split("\n")[0];
    if (fileDate === date) fs.writeFileSync("logs/latest.log", `${data}\n`);
    else {
        fs.writeFileSync(`logs/${fileDate}.log`, data);
        fs.writeFileSync("logs/latest.log", `${date}\n\n`);
    }
} else fs.writeFileSync("logs/latest.log", `${date}\n\n`);

const stream = fs.createWriteStream("logs/latest.log", { flags: "a" });

function timestamp(stripChalk = false) {
    const time = new Date().toLocaleTimeString();
    if (stripChalk) return `[${time}]`;
    return `[${chalk.gray(time)}]`;
}

export function log(message?: any, ...optionalParams: any[]): void
export function log(...data: any[]): void {
    stream.write(`[LOG] ${timestamp(true)} ${data.join(" ")}\n`);
    console.log(timestamp(), ...data);
}

export function info(message?: any, ...optionalParams: any[]): void
export function info(...data: any[]): void {
    stream.write(`[INFO] ${timestamp(true)} ${data.join(" ")}\n`);
    console.info(timestamp(), chalk.blue(...data));
}

export function error(message?: any, ...optionalParams: any[]): void
export function error(...data: any[]): void {
    stream.write(`[ERROR] ${timestamp(true)} ${data.join(" ")}\n`);
    console.error(timestamp(), chalk.red(...data));
}

export function warn(message?: any, ...optionalParams: any[]): void
export function warn(...data: any[]): void {
    stream.write(`[WARN] ${timestamp(true)} ${data.join(" ")}\n`);
    console.warn(timestamp(), chalk.yellow(...data));
}

export function success(message?: any, ...optionalParams: any[]): void
export function success(...data: any[]): void {
    stream.write(`[SUCCESS] ${timestamp(true)} ${data.join(" ")}\n`);
    console.log(timestamp(), chalk.green(...data));
}

export function debug(message?: any, ...optionalParams: any[]): void
export function debug(...data: any[]): void {
    stream.write(`[DEBUG] ${timestamp(true)} ${data.join(" ")}\n`);
    if (process.env.NODE_ENV !== "development" && process.env.SHOW_DEBUG_LOGS !== "true") return;
    console.log(timestamp(), chalk.gray(...data));
}

export function trace(message?: any, ...optionalParams: any[]): void
export function trace(...data: any[]): void {
    stream.write(`[TRACE] ${timestamp(true)} ${data.join(" ")}\n`);
    console.trace(timestamp(), chalk.magenta(...data));
}

export default class Logger {
    static log = log;
    static info = info;
    static error = error;
    static warn = warn;
    static success = success;
    static debug = debug;
    static trace = trace;
    static chalk = chalk;
}
