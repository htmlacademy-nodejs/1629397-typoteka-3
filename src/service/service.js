'use strict';

const {cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
} = require(`../utils/constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;
const commandArgument = userArguments.slice(1);

if (userArguments.length === 0 || !cli[userCommand]) {
  cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

cli[userCommand].run(commandArgument);
