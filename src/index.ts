import fs from "node:fs";

import packages from "parsed-packages";
import _chalk, { ChalkInstance } from "chalk";
export const chalk = _chalk;

let date = new Date().toLocaleDateString().replace(/\//g, "-");

const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function archiveLastMonth() {
    const files = fs.readdirSync("logs").filter(file => file.endsWith(".log") && file !== "latest.log");
    if (files.length === 0) return;

    const month = files[0].split("-")[1];
    const year = files[0].split("-")[2].split(".")[0];
    const archiveName = `${months[parseInt(month)]} ${year}`;

    // couldnt find a nice and simple way to create archives without dependencies... help!
    if (fs.existsSync(`logs/${archiveName}`)) return;
    
    fs.mkdirSync(`logs/${archiveName}`);
    for (const file of files) {
        fs.renameSync(`logs/${file}`, `logs/${archiveName}/${file}`);
    }
}

function saveLog() {
    const data = fs.readFileSync("logs/latest.log", "utf-8");
    const fileDate = data.split("\n")[0];
    if (fileDate === date) fs.writeFileSync("logs/latest.log", `${data}\n`);
    else {
        fs.writeFileSync(`logs/${fileDate}.log`, data);
        fs.writeFileSync("logs/latest.log", `${date}\n\n`);
    }

    if (fileDate.split("-")[1] !== date.split("-")[1]) archiveLastMonth();
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

function write(tagColor: ChalkInstance, tagName: string, type: string, data: any[]) {
    const tag = tagName ? `[${tagColor(tagName)}]` : "";
    const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
    if (date !== currentDate) {
        date = currentDate;
        saveLog();
    }

    stream.write(stripChalk(`[${type.toUpperCase()}] ${timestamp(true)} ${tag}${data.join(" ")}\n`));
}

export class LoggerBuilder {
    protected chalkData: ChalkInstance;
    protected tag: string;

    constructor(tag?: string, chalkData?: ChalkInstance) {
        this.tag = tag || "";
        this.chalkData = chalkData || chalk.gray;
    }

    /**
     * Logs all dependencies used in the project to `logger.debug()`.
     * This is useful for debugging and ensuring that the correct versions of dependencies are being used.
     * 
     * ```js
     * logger.logDependencies();
     * // Example output:
     * // Using chalk@5.3.0 (5.x)
     * // Using express@4.19.2 (~4.19.0)
     * // Using localmodule@1.0.0 ( * local * )
     * ```
     */
    logDependencies(): void {
        this.deps();
    }

    /**
     * Alias for `logDependencies()`.
     * 
     * ```js
     * logger.deps();
     * ```
     */
    deps(): void {
        const dependencies = packages.getDependencies();
        for (const [name, dependency] of dependencies) {
           this.debug(`Using ${chalk.whiteBright(`${name}@${dependency.version}`)} (${dependency.type ? ` * ${dependency.type} *` : dependency.range})`);
        }
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
        write(this.chalkData, this.tag, "log", data);
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
        write(this.chalkData, this.tag, "info", data);
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
        write(this.chalkData, this.tag, "error", data);
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
        write(this.chalkData, this.tag, "warn", data);
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
        write(this.chalkData, this.tag, "success", data);
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
        write(this.chalkData, this.tag, "debug", data);
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
    createTag(tag: string, color?: ChalkInstance): LoggerBuilder {
        return new LoggerBuilder(tag, color);
    }

    /**
     * Sets the tag and color of the `Logger` instance.
     * 
     * ```js
     * logger.setTag("MyApp", chalk.red);
     * logger.log("Hello, world!");
     * // Prints: [HH:MM:SS] [MyApp] Hello, world!, in red
     * ```
     */
    setTag(tag?: string, color?: ChalkInstance): void {
        if (tag) this.tag = tag;
        if (color) this.chalkData = color;
    }

    /**
     * Sets the tag name of the `Logger` instance.
     * Alias for `setTag()`.
     * 
     * ```js
     * logger.setTagName("MyApp");
     * logger.log("Hello, world!");
     * // Prints: [HH:MM:SS] [MyApp] Hello, world!
     * // if there was a color set prior, it will still be used
     * ```
     */
    setTagName(tag: string): void {
        this.setTag(tag);
    }

    /**
     * Sets the tag color of the `Logger` instance.
     * This does nothing if there is no tag set.
     * Alias for `setTag(undefined, )`.
     * 
     * ```js
     * logger.setTagColor(chalk.red);
     * logger.log("Hello, world!");
     * // Prints: [HH:MM:SS] [MyApp] Hello, world!, in red
     * // assuming the tag was already set to "MyApp"
     * ```
     */
    setTagColor(color: ChalkInstance): void {
        this.setTag(undefined, color);
    }

    chalk = _chalk;
}

export default new LoggerBuilder();

// technically the same now? backwards compatibility at its finest!
export const TaggedLogger = LoggerBuilder;
