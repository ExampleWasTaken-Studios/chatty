import fs from "fs";

export default class Chatty {

  private readonly endpoints: Endpoint[];

  private enabled: boolean;

  constructor( ...endpoints: Endpoint[]) {
    this.endpoints = endpoints;
    this.enabled = true;
  }

  public log(level: LogLevel, ...payload: string[]): void {
    // TODO: handle on and off!!!

    switch (level) {
      case "off":
        this.enabled = false;
        break;
      case "on":
        this.enabled = true;
        break;
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

export class LogData {

  private date: Date;
  private level: LogLevel;
  private payload: string[];

  constructor(level: LogLevel, payload: string[]) {
    this.date = new Date();
    this.level = level;
    this.payload = payload;
  }

  public toString() {
    return `[${this.date.toISOString()}] [${this.level.toUpperCase()}]: ${this.payload.join(" ")}`;
  }

  public toJSON(beautify = false) {
    const dataObject = {
      date: this.date,
      level: this.level,
      payload: this.payload.join(" ")
    };

    return (beautify ? JSON.stringify(dataObject, null, 2) : JSON.stringify(dataObject));
  }

  public getDate() {
    return this.date;
  }

  public getLevel() {
    return this.level;
  }

  public getPayload() {
    return this.payload;
  }
}

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

export class File extends Endpoint {
  private path: fs.PathLike;
  private levels: LogLevel[];

  constructor(path: fs.PathLike, fileHeader: string, ...levels: LogLevel[]) {
    super();
    this.path = path;
    this.levels = levels;

    if (!fs.existsSync(this.path)) {
      fs.writeFile(this.path, `${fileHeader}\n\n`, _err => {
        // TODO: handle error
      });
    }
  }

  public defaultAction(data: LogData): void {
    this.append(data.toString());
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

  private append(data: string) {
    fs.appendFile(this.path, data, _err => {
      // TODO: handle error
    });
  }

  public async delete(): Promise<void | NodeJS.ErrnoException> {
    fs.rm(this.path, _err => {
      // TODO: handle error
    });
  }
}


// typings

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "off" | "on";
