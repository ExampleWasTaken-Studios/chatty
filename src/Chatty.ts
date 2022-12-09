import { Endpoint } from "./Endpoint";
import { LogLevel } from "./LogLevel";
import { LogData } from "./LogData";

export default class Chatty {

  private static instantiated = false;
  private readonly endpoints: Endpoint[];
  private enabled: boolean;

  constructor(...endpoints: Endpoint[]) {
    if (Chatty.instantiated) {
      throw new Error("Only one instance allowed. Use existing instance instead.");
    }

    Chatty.instantiated = true;

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
