export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "off" | "on";

export const LogLevelPresets = {
  all: [
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace"
  ],
  production: [
    "fatal",
    "error",
    "warn",
    "info"
  ],
  development: [
    "debug",
    "trace"
  ]
};
