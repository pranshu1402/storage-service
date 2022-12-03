/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { createLogger, format, transports } from "winston";

const formatLogMessage = {
  transform(info: any) {
    const { timestamp, message, level } = info;
    const args = info[Symbol.for("splat")];
    const messageStr = stringifyValueForLog(message);
    if (args) {
      const strArgs = args.map((e: any) => stringifyValueForLog(e)).join(" ");
      info[
        Symbol.for("message")
      ] = `[${timestamp} ${level}]: ${messageStr} ${strArgs}`;
    } else {
      info[Symbol.for("message")] = `[${timestamp} ${level}]: ${messageStr}`;
    }
    return info;
  }
};

function stringifyValueForLog(val: any): string {
  if (!val) {
    return "";
  }
  return typeof val !== "object"
    ? val.toString()
    : JSON.stringify(val, null, 2);
}

export const logger = createLogger({
  format: format.combine(
    format.colorize({
      all: true,
      colors: {
        error: "red",
        warn: "yellow",
        info: "cyan",
        debug: "green"
      }
    }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS"
    }),
    formatLogMessage
  ),
  transports: [new transports.Console({ level: "info" })]
});

export const setLogLevel = () => {
  logger.info(`Setting level to info as per config.`);
  logger.configure({
    transports: [new transports.Console({ level: "info" })]
  });
};
