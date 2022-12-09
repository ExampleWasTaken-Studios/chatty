import { Endpoint } from "./Endpoint";
import { LogData } from "./LogData";
import { LogLevel } from "./LogLevel";

export class Console extends Endpoint {

  private levels: LogLevel[];

  constructor(...levels: LogLevel[]) {
    super();
    this.levels = levels;
  }

  public defaultAction(data: LogData): void {

    const reset = "\x1b[0m";
    const green = "\x1b[92m";
    const yellow = "\x1b[33m";
    const red = "\x1b[31m";

    if (this.levels.includes(data.getLevel())) {
      switch (data.getLevel()) {
        case "trace":
          process.stdout.write(`${data.toString().replace("TRACE", `${green}TRACE${reset}`)}\n`);
          break;
        case "debug":
          process.stdout.write(`${data.toString()}\n`);
          break;
        case "info":
          process.stdout.write(`${data.toString()}\n`);
          break;
        case "warn": {
          process.stderr.write(`${data.toString().replace("WARN", `${yellow}WARN${reset}`)}\n`);
          break;
        }
        case "error":
          process.stderr.write(`${data.toString().replace("ERROR", `${red}ERROR${reset}`)}\n`);
          break;
        case "fatal":
          process.stderr.write(`${data.toString().replace("FATAL", `${red}FATAL${reset}`)}\n`);
          break;
      }
    }
  }

  public addLevel(level: LogLevel) {
    if (this.levels.includes(level)) return;
    this.levels.push(level);
  }

  public removeLevel(level: LogLevel) {
    if (this.levels.includes(level)) this.levels.splice(this.levels.indexOf(level), 1);
  }

  public setLevels(levels: LogLevel[]) {
    this.levels = levels;
  }

  public getLevels(): LogLevel[] {
    return this.levels;
  }
}
