import fs from "node:fs";
import _chalk from "chalk";
export const chalk = _chalk;

let date = new Date().toLocaleDateString().replace(/\//g, "-");

function saveLog() {
    const data = fs.readFileSync("logs/latest.log", "utf-8");
    const fileDate = data.split("\n")[0];
    if (fileDate === date) fs.writeFileSync("logs/latest.log", `${data}\n`);
    else {
        fs.writeFileSync(`logs/${fileDate}.log`, data);
        fs.writeFileSync("logs/latest.log", `${date}\n\n`);
    }
}

if (!fs.existsSync("logs")) fs.mkdirSync("logs");
if (fs.existsSync("logs/latest.log")) saveLog();
else fs.writeFileSync("logs/latest.log", `${date}\n\n`);

const stream = fs.createWriteStream("logs/latest.log", { flags: "a" });

function timestamp(stripChalk = false) {
    const time = new Date().toLocaleTimeString();
    if (stripChalk) return `[${time}]`;
    return `[${chalk.gray(time)}]`;
}

function write(type: string, data: any[]) {
    const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
    if (date !== currentDate) {
        date = currentDate;
        saveLog();
    }

    stream.write(`[${type.toUpperCase()}] ${timestamp(true)} ${data.join(" ")}\n`);
}

export function log(message?: any, ...optionalParams: any[]): void
export function log(...data: any[]): void {
    write("log", data);
    console.log(timestamp(), ...data);
}

export function info(message?: any, ...optionalParams: any[]): void
export function info(...data: any[]): void {
    write("info", data);
    console.info(timestamp(), chalk.blue(...data));
}

export function error(message?: any, ...optionalParams: any[]): void
export function error(...data: any[]): void {
    write("error", data);
    console.error(timestamp(), chalk.red(...data));
}

export function warn(message?: any, ...optionalParams: any[]): void
export function warn(...data: any[]): void {
    write("warn", data);
    console.warn(timestamp(), chalk.yellow(...data));
}

export function success(message?: any, ...optionalParams: any[]): void
export function success(...data: any[]): void {
    write("success", data);
    console.log(timestamp(), chalk.green(...data));
}

export function debug(message?: any, ...optionalParams: any[]): void
export function debug(...data: any[]): void {
    write("debug", data);
    if (process.env.NODE_ENV !== "development" && process.env.SHOW_DEBUG_LOGS !== "true") return;
    console.log(timestamp(), chalk.gray(...data));
}

export default class Logger {
    static log = log;
    static info = info;
    static error = error;
    static warn = warn;
    static success = success;
    static debug = debug;
    static chalk = chalk;
}
