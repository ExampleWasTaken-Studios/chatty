const Chatty = require("../lib/index").default;
const { File } = require("../lib/index");
const defaultFile = new File("../log.txt", "DEFAULT LOG FILE\n", "debug");
const logger = new Chatty(undefined, defaultFile);

logger.log("debug", "test-file test");