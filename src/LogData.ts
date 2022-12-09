import { LogLevel } from "./LogLevel";

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
