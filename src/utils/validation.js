import { toAbsolutePath, isFile, isDirectory } from './path.js';
import { MESSAGES } from './messages.js';

/**
 * Validates that required arguments are present
 * @param {string[]} args - Arguments array
 * @param {number} requiredCount - Required number of arguments
 */
export function validateArgs(args, requiredCount) {
  if (args.length < requiredCount || !args[requiredCount - 1]) {
    throw new Error(MESSAGES.INVALID_INPUT);
  }
}

/**
 * Validates that path exists and is a file
 * @param {string} filePath - Path to validate
 */
export async function validateFile(filePath) {
  const resolvedPath = toAbsolutePath(filePath);
  if (!(await isFile(resolvedPath))) {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
  return resolvedPath;
}

/**
 * Validates that path exists and is a directory
 * @param {string} dirPath - Path to validate
 */
export async function validateDirectory(dirPath) {
  const resolvedPath = toAbsolutePath(dirPath);
  if (!(await isDirectory(resolvedPath))) {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
  return resolvedPath;
}