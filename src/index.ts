import fs from "node:fs";
import _chalk, { ChalkInstance } from "chalk";
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

function stripChalk(data: string) {
    return data.replace(/\[[0-9;]*m/g, "");
}

function timestamp(stripChalk = false) {
    const time = new Date().toLocaleTimeString();
    if (stripChalk) return `[${time}]`;
    return `[${chalk.gray(time)}]`;
}

function write(tag: string, type: string, data: any[]) {
    const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
    if (date !== currentDate) {
        date = currentDate;
        saveLog();
    }

    stream.write(stripChalk(`[${type.toUpperCase()}] ${timestamp(true)} ${tag}${data.join(" ")}\n`));
}

class Logger {
    protected tag: string = "";

    constructor(tag?: string, color: ChalkInstance = chalk.gray) {
        if (tag) this.tag = `[${color(tag)}] `;
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
    log(message?: any, ...optionalParams: any[]): void
    log(...data: any[]): void {
        write(this.tag, "log", data);
        console.log(`${timestamp()} ${this.tag}${data.join(" ")}`);
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
    info(message?: any, ...optionalParams: any[]): void
    info(...data: any[]): void {
        write(this.tag, "info", data);
        console.info(timestamp(), this.tag, chalk.blue(...data));
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
    error(message?: any, ...optionalParams: any[]): void
    error(...data: any[]): void {
        write(this.tag, "error", data);
        console.error(timestamp(), this.tag, chalk.red(...data));
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
    warn(message?: any, ...optionalParams: any[]): void
    warn(...data: any[]): void {
        write(this.tag, "warn", data);
        console.warn(timestamp(), this.tag, chalk.yellow(...data));
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
    success(message?: any, ...optionalParams: any[]): void
    success(...data: any[]): void {
        write(this.tag, "success", data);
        console.log(timestamp(), this.tag, chalk.green(...data));
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
    debug(message?: any, ...optionalParams: any[]): void
    debug(...data: any[]): void {
        write(this.tag, "debug", data);
        if (process.env.NODE_ENV !== "development" && process.env.SHOW_DEBUG_LOGS !== "true") return;
        console.log(timestamp(), this.tag, chalk.gray(...data));
    }

    /**
     * Creates a new instance of the `Logger` with a specified tag.
     * This is an alias for `new TaggedLogger(tag)`.
     * 
     * ```js
     * const newLogger = logger.createTag("MyApp");
     * newLogger.log("Hello, world!");
     * // Prints: [HH:MM:SS] [MyApp] Hello, world!
     * ```
     */
    createTag(tag: string, color: ChalkInstance = chalk.gray): Logger {
        return new TaggedLogger(color(tag));
    }

    chalk = _chalk;
}

export default new Logger();
export const TaggedLogger = Logger;
