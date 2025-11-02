import { parseCommand } from '../utils/parsers.js';
import { navigationHandlers } from './navigation.js';
import { fileHandlers } from './file.js';
import { osHandlers } from './os.js';
import { MESSAGES } from '../utils/messages.js';

const commandHandlers = {
  ...navigationHandlers,
  ...fileHandlers,
  ...osHandlers,
};

/**
 * Handles command execution
 * @param {string} input - User input string
 */
export async function handleCommand(input) {
  const { command, args } = parseCommand(input);

  const handler = commandHandlers[command];
  if (!handler) {
    throw new Error(MESSAGES.INVALID_INPUT);
  }

  await handler(args);
}