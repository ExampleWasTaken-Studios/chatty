import { LogData } from "./LogData";
import { LogLevel } from "./LogLevel";

export abstract class Endpoint {

  constructor() {
    if (this.defaultAction === undefined
      || this.addLevel === undefined
      || this.removeLevel === undefined
      || this.getLevels === undefined
    ) {
      throw new Error("Child class must implement all abstract methods.");
    }
    if (new.target === Endpoint) {
      throw new Error("Abstract class cannot be instantiated.");
    }
  }

  public abstract defaultAction(data: LogData): void;
  public abstract addLevel(level: LogLevel): void;
  public abstract removeLevel(level: LogLevel): void;
  public abstract setLevels(levels: LogLevel[]): void;
  public abstract getLevels(): LogLevel[];
}
