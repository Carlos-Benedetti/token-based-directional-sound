import { LogLevel } from "./LogLevel";

export default class Logger {
    /**
     * Displays information of develepment concerns
     */
    static Low = new LogLevel("low", 1);

    /**
     * Displays information for unusual circumstances
     */
    static Medium = new LogLevel("medium", 2);

    /**
     * Displays information for user visible changes
     */
    static High = new LogLevel("high", 3);

    /**
     * Used to display no logging
     */
    static None = new LogLevel("none", Infinity);

    /**
     * Stores the name of the module
     */
    static moduleName = "Unnamed Module";

    /**
     * The current debug threshold
     */
    static threshold = Logger.None;

    /**
     * Initializes the Logger object with a mod name and a log level
     * @param {String} name - The module name, prefixed to all log messages
     * @param {LogLevel} threshold - The minimum level of log messages to display
     */
    static init(name, threshold) {
        Logger.moduleName = name;
        Logger.threshold = threshold;

        this.log(threshold, `Set log threshold to ${threshold.name}`);
    }

    /**
     * Print a message to the log
     */
    static log(level: LogLevel, message: any)
    static log(level: LogLevel, ...message: any[])
    static log(level: LogLevel, ...message: any[]) {
        if (Logger.threshold.value <= level.value) {
            console.log(...[`[${this.moduleName}]: `, ...message]);
        }
    }
}