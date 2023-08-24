// import winston from "winston";
// import "winston-daily-rotate-file";

import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    format.json(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // format.colorize(),
    myFormat
  ),
  transports: [
    new transports.File({
      filename: "logs/combined/combined.log",
      // level: "info",
    }),
    new transports.File({
      filename: "logs/error/error.log",
      level: "error",
    }),
  ],
});

logger.exceptions.handle(
  new transports.File({ filename: "logs/exceptions/exceptions.log" })
);

export const authLogger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    format.json(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // format.colorize(),
    myFormat
  ),
  transports: [
    new transports.File({
      filename: "logs/auth/combined/combined.log",
      // level: "info",
    }),
    new transports.File({
      filename: "logs/auth/error/error.log",
      level: "error",
    }),
  ],
});


// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }

// Name	Default	Description
// level	    'info'	                      Log only if info.level is less than or equal to this level
// levels	    winston.config.npm.levels	  Levels (and colors) representing log priorities
// format	    winston.format.json           Formatting for info messages (see: Formats)
// transports	[] (No transports)	          Set of logging targets for info messages
// exitOnError	true	                      If false, handled exceptions will not cause process.exit
// silent	    false	                      If true, all logs are suppressed