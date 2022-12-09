export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "off" | "on";

interface LogLevelPreset {
  [preset: string]: LogLevel[];
}

export const LogLevelPresets: LogLevelPreset = {
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
