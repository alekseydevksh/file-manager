import { resolve, dirname, parse, isAbsolute } from 'node:path';
import { stat } from 'node:fs/promises';
import { cwd } from 'node:process';

/**
 * Converts relative path to absolute path
 * @param {string} path - Path to convert
 */
export function toAbsolutePath(path) {
  if (isAbsolute(path)) {
    return resolve(path);
  }
  return resolve(cwd(), path);
}

/**
 * Checks if path is directory
 * @param {string} path - Path to check
 */
export async function isDirectory(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Checks if path is file
 * @param {string} path - Path to check
 */
export async function isFile(path) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Gets parent directory of a file
 * @param {string} filePath - Path to file
 */
export function getParentDirectory(filePath) {
  return dirname(toAbsolutePath(filePath));
}

/**
 * Gets filename from path
 * @param {string} filePath - Path to file
 */
export function getFilename(filePath) {
  return parse(filePath).base;
}

/**
 * Gets the root directory based on platform
 */
export function getRootDirectory() {
  if (process.platform === 'win32') {
    const cwdPath = cwd();
    const parsed = parse(cwdPath);
    return parsed.root;
  }
  return '/';
}