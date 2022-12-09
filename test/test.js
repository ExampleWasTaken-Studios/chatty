const Chatty = require("../lib/index").default;
const { Console, LogLevelPresets } = require("../lib/index");

const consoleEndpoint = new Console(...LogLevelPresets.all);
const logger = new Chatty(consoleEndpoint);

logger.log("on");
logger.log("trace", "Testing payload");

