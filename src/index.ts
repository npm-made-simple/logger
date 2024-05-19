import _chalk from "chalk";
export const chalk = _chalk;

function timestamp() {
    return `[${chalk.gray(new Date().toLocaleTimeString())}]`;
}

export function log(message?: any, ...optionalParams: any[]): void
export function log(...data: any[]): void {
    console.log(timestamp(), ...data);
}

export function info(message?: any, ...optionalParams: any[]): void
export function info(...data: any[]): void {
    console.info(timestamp(), chalk.blue(...data));
}

export function error(message?: any, ...optionalParams: any[]): void
export function error(...data: any[]): void {
    console.error(timestamp(), chalk.red(...data));
}

export function warn(message?: any, ...optionalParams: any[]): void
export function warn(...data: any[]): void {
    console.warn(timestamp(), chalk.yellow(...data));
}

export function success(message?: any, ...optionalParams: any[]): void
export function success(...data: any[]): void {
    console.log(timestamp(), chalk.green(...data));
}

export function debug(message?: any, ...optionalParams: any[]): void
export function debug(...data: any[]): void {
    console.log(timestamp(), chalk.gray(...data));
}

export function trace(message?: any, ...optionalParams: any[]): void
export function trace(...data: any[]): void {
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
