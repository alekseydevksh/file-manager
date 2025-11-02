import { stdin, stdout, chdir } from 'node:process';
import { createInterface } from 'node:readline';
import { homedir } from 'node:os';
import { handleCommand } from './commands/commandHandler.js';
import { parseArgs } from './utils/parsers.js';
import {
  printWelcome,
  printGoodbye,
  printCurrentDirectory,
  printInvalidInput,
  printOperationFailed,
  printUsernameRequired,
  MESSAGES,
} from './utils/messages.js';

const args = parseArgs();
const username = args.username;

if (!username) {
  printUsernameRequired();
  process.exit(1);
}

printWelcome(username);
chdir(homedir());
printCurrentDirectory();

const rl = createInterface({
  input: stdin,
  output: stdout,
});

const processCommand = async (input) => {
  const trimmedInput = input.trim();

  if (trimmedInput === '.exit') {
    printGoodbye(username);
    rl.close();
    process.exit(0);
  }

  if (trimmedInput === '') {
    printCurrentDirectory();
    return;
  }

  try {
    await handleCommand(trimmedInput);
    printCurrentDirectory();
  } catch (error) {
    if (error.message === MESSAGES.INVALID_INPUT) {
      printInvalidInput();
    } else {
      printOperationFailed();
    }
    printCurrentDirectory();
  }
};

rl.on('line', processCommand);

rl.on('SIGINT', () => {
  printGoodbye(username);
  rl.close();
  process.exit(0);
});