const Chatty = require("../lib/index").default;
const { Console } = require("../lib/index");

const consoleEndpoint = new Console("fatal", "error", "warn", "info", "debug", "trace");

const logger = new Chatty(consoleEndpoint);

logger.log("fatal", "This is a fatality");
logger.log("error", "This is an error!");
logger.log("warn", "This is a warning!");
logger.log("info", "This is an info!");
logger.log("debug", "This is for debugging");
logger.log("trace", "This is for tracing");

consoleEndpoint.removeLevel("error");

logger.log("error", "This should not be visible");
logger.log("info", "Logged the hidden error log");

consoleEndpoint.addLevel("error");

logger.log("error", "This should be visible");
logger.log("info", "Logged the visible error log");