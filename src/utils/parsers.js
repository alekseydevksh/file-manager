import { argv } from 'node:process';

/**
 * Parses command line arguments
 */
export function parseArgs() {
  const args = {};
  const argvParts = argv.slice(2);

  for (const arg of argvParts) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      args[key] = value;
    }
  }

  return args;
}

/**
 * Parses user input into command and arguments
 * @param {string} input - User input string
 */
export function parseCommand(input) {
  const trimmedInput = input.trim();
  const [command, ...args] = trimmedInput.split(/\s+/);

  return { command: command || '', args };
}