import { cwd } from 'node:process';

export const MESSAGES = {
  INVALID_INPUT: 'Invalid input',
  OPERATION_FAILED: 'Operation failed',
  USERNAME_REQUIRED: 'Error: --username argument is required',
};

export function printWelcome(username) {
  console.log(`Welcome to the File Manager, ${username}!`);
}

export function printGoodbye(username) {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
}

export function printCurrentDirectory() {
  console.log(`You are currently in ${cwd()}`);
}

export function printInvalidInput() {
  console.log(MESSAGES.INVALID_INPUT);
}

export function printOperationFailed() {
  console.log(MESSAGES.OPERATION_FAILED);
}

export function printUsernameRequired() {
  console.error(MESSAGES.USERNAME_REQUIRED);
}