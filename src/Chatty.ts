import { Endpoint } from "./Endpoint";
import { LogLevel, LogLevelPresets } from "./LogLevel";
import { LogData } from "./LogData";
import { Console } from "./Console";

export default class Chatty {

  private readonly endpoints: Endpoint[];
  private enabled: boolean;
  public errorHandler: (error: Error | NodeJS.ErrnoException | null) => void;

  constructor(...endpoints: Endpoint[]) {
    this.errorHandler = (err) => {
      this.log("warn", "No error handler specified. See https://github.com/ExampleWasTaken-Studios/chatty#error-handling");
      err && this.log("error", err.toString());

      throw err;
    };

    this.endpoints = endpoints;
    this.enabled = true;
  }

  public log(level: LogLevel, ...payload: string[]): void {
    switch (level) {
      case "off":
        this.enabled = false;
        return;
      case "on":
        this.enabled = true;
        return;
      case "trace":
      case "debug":
      case "info":
      case "warn":
      case "error":
      case "fatal":
        if (!this.enabled) return;
        for (const current of this.endpoints) {
          if (current.getLevels().includes(level)) {
            current.defaultAction(new LogData(level, payload));
          }
        }
    }
  }
}

export const internalLogger = new Chatty(new Console(...LogLevelPresets.all));
