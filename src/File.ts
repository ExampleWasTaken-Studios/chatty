import { Endpoint } from "./Endpoint";
import { LogLevel } from "./LogLevel";
import { LogData } from "./LogData";
import { internalLogger as logger } from "./Chatty";
import fs from "fs";

export class File extends Endpoint {
  private path: fs.PathLike;
  private levels: LogLevel[];

  constructor(path: fs.PathLike, fileHeader: string, ...levels: LogLevel[]) {
    super();
    this.path = path;
    this.levels = levels;

    if (!fs.existsSync(this.path)) {
      fs.writeFile(this.path, `${fileHeader}\n\n`, (err) => {
        logger.errorHandler(err);
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
    fs.appendFile(this.path, data, err => {
      logger.errorHandler(err);
    });
  }

  public async delete(): Promise<void | NodeJS.ErrnoException> {
    fs.rm(this.path, err => {
      logger.errorHandler(err);
    });
  }
}
