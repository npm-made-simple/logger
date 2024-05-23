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

/**
 * Prints to `console.log()` with a timestamp. Also writes to `logs/latest.log`.
 * Functionally similar to `console.log()` but formatted as `[HH:MM:SS] message`.
 * 
 * ```js
 * const count = 5;
 * logger.log("count: %d", count);
 * // Prints: [HH:MM:SS] count: 5
 * logger.log("count:", count);
 * // Prints: [HH:MM:SS] count: 5
 * ``` 
 */
export function log(message?: any, ...optionalParams: any[]): void
export function log(...data: any[]): void {
    write("log", data);
    console.log(timestamp(), ...data);
}

/**
 * Prints to `console.info()` with a timestamp. Also writes to `logs/latest.log`.
 * Functionally similar to `console.info()` but is printed **blue** and formatted as `[HH:MM:SS] message`.
 * 
 * ```js
 * const count = 5;
 * logger.info("count: %d", count);
 * // Prints: [HH:MM:SS] count: 5, in blue
 * logger.info("count:", count);
 * // Prints: [HH:MM:SS] count: 5, in blue
 * ```
 */
export function info(message?: any, ...optionalParams: any[]): void
export function info(...data: any[]): void {
    write("info", data);
    console.info(timestamp(), chalk.blue(...data));
}

/**
 * Prints to `console.error()` with a timestamp. Also writes to `logs/latest.log`.
 * Functionally similar to `console.error()` but is printed **red** and formatted as `[HH:MM:SS] message`.
 * 
 * ```js
 * const code = 5;
 * logger.error("error #%d", code);
 * // Prints: [HH:MM:SS] error #5, in red
 * logger.error("error", code);
 * // Prints: [HH:MM:SS] error 5, in red
 * ```
 */
export function error(message?: any, ...optionalParams: any[]): void
export function error(...data: any[]): void {
    write("error", data);
    console.error(timestamp(), chalk.red(...data));
}

/**
 * Prints to `console.warn()` with a timestamp. Also writes to `logs/latest.log`.
 * Functionally similar to `console.warn()` and `console.error()` but is printed **yellow** and formatted as `[HH:MM:SS] message`.
 * Unlike `console` methods, `warn()` is not purely an alias for `error()`.
 * 
 * ```js
 * const code = 5;
 * logger.warn("warning #%d", code);
 * // Prints: [HH:MM:SS] warning #5, in yellow
 * logger.warn("warning", code);
 * // Prints: [HH:MM:SS] warning 5, in yellow
 * ```
 */
export function warn(message?: any, ...optionalParams: any[]): void
export function warn(...data: any[]): void {
    write("warn", data);
    console.warn(timestamp(), chalk.yellow(...data));
}

/**
 * Prints to `console.log()` with a timestamp. Also writes to `logs/latest.log`.
 * Functionally similar to `console.log()` but is printed **green** and formatted as `[HH:MM:SS] message`.
 * `success()` is not a native `console` method and exists purely for convenience.
 * 
 * ```js
 * const count = 5;
 * logger.success("count: %d", count);
 * // Prints: [HH:MM:SS] count: 5, in green
 * logger.success("count:", count);
 * // Prints: [HH:MM:SS] count: 5, in green
 * ```
 */
export function success(message?: any, ...optionalParams: any[]): void
export function success(...data: any[]): void {
    write("success", data);
    console.log(timestamp(), chalk.green(...data));
}

/**
 * Prints to `console.log()` with a timestamp. Also writes to `logs/latest.log`.
 * Functionally similar to `console.log()` but is printed **gray** and formatted as `[HH:MM:SS] message`.
 * `debug()` is not a native `console` method and exists purely for convenience.
 * `debug()` will only print if the environment variable **NODE_ENV** is set to `development` or **SHOW_DEBUG_LOGS** is set to `true`.
 * However, it will still be written to `logs/latest.log`.
 * 
 * ```js
 * const count = 5;
 * logger.debug("count: %d", count);
 * // Prints: [HH:MM:SS] count: 5, in gray
 * logger.debug("count:", count);
 * // Prints: [HH:MM:SS] count: 5, in gray
 * ```
 */
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
