# chatty
The friendly and easy to use logger.

## Installation
```
npm install @ewt-studios/chatty
```

## Usage
```ts
import Chatty from "@ewt-studios/chatty";
import { Console, File } from "@ewt-studios/chatty";

const consoleEndpoint = new Console("fatal", "error");
const fileEndpoint = new File("./log.txt", "LOG FILE", "fatal");

const logger = new Chatty(consoleEndpoint, fileEndpoint);

logger.log("fatal", "Hello World!");
```

## Logging
`chatty` support the following logging levels:
```ts
type LogLevels = "fatal" 
               | "error" 
               | "warn"
               | "info"
               | "debug"
               | "trace"
               | "off"
               | "on";
```
### Special logging levels
`off` and `on` are special logging levels. If they are passed no additional arguments are required. Logging `off` disables all logging while logging `on` does the opposite.

Both `off` and `on` are never send to `Endpoints`.

## Endpoints
Endpoints are essentially an output device. 

Each endpoint logs specified `LogLevel`s. These are set during instantiation and can be modified with the `addLevel()`, `removeLevel()`, `setLevels(levels: LogLevel[])` instance methods.

Chatty ships with a couple of native `Endpoints`:
- [Console](#console-endpoint)
- [File](#file-endpoint)

These are extended they become necessary. You can create your own [custom endpoints](#custom-endpoints) if you need custom behavior.

### Console Endpoint
Logs are directly sent to `stdout` and `stderr` and *do not* use `console.log`. They are also formatted and colorized.

Levels that log to `stdout`:
- `trace`
- `debug`
- `info`

Levels that log to `stderr`:
- `warn`
- `error`
- `fatal`

Example:
```ts
new Console("fatal", "error");
```
Constructor arguments:
- `logLevels: LogLevel[]`: An array of [log levels](#logging) the endpoint should respond to.

### File Endpoint
Example:
```ts
new File("./log/log.txt", "Beginning of the log file.", "fatal", "error");
```

Constructor arguments:
- `path: fs.PathLike`: The location the log file should be created at.
- `fileHeader: string`: The file header is written to the beginning of the file. This is only written to the file when it is newly created.
- `logLevels: LogLevel[]`: An arry of [log levels](#logging) the endpoint should respond to.

### Custom endpoints
If the native [`Endpoints`](#endpoints) don't fit your need, you can create your own `Endpoint` by extending the `Endpoint` class.

#### Example:
```ts
class CustomEndpoint extends Endpoint {
  private levels: LogLevel[];

  constructor(...levels: LogLevel[]) {
    super();
    this.levels = levels;
  }

  public defaultAction(data: LogData): void {
    // your code here
  }

  public getLevels(): LogLevel[] {
    return this.levels;
  }
}
```
> Note that you need to override **all** abstract methods of `Endpoint`! Otherwise an error is thrown in the super constructor.

## Error handling
Chatty does its best to inform you whenever something's going wrong.  
To do so, each `Chatty` instance has a public `errorHandler` field.

#### Example
```ts
new Chatty(endpoints).errorHandler = (error: Error | NodeJS.ErrnoException | null) => {
  // handle your errors here
}
```
If no error handler is specified Chatty will provide a link to this readme and throw the occured error afterwards.
