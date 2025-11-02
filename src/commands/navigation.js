import { chdir, cwd } from 'node:process';
import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getRootDirectory } from '../utils/path.js';
import { MESSAGES } from '../utils/messages.js';
import { validateArgs, validateDirectory } from '../utils/validation.js';
import { printDirectoryTable } from '../utils/print.js';

export const NAVIGATION_COMMANDS = {
  UP: 'up',
  CD: 'cd',
  LS: 'ls',
};

export const navigationHandlers = {
  [NAVIGATION_COMMANDS.UP]: async () => await goUp(),
  [NAVIGATION_COMMANDS.CD]: async (args) => {
    validateArgs(args, 1);
    await changeDirectory(args[0]);
  },
  [NAVIGATION_COMMANDS.LS]: async () => await listDirectory(),
};

/**
 * Goes up one directory level
 */
export async function goUp() {
  const rootDir = getRootDirectory();
  const currentDir = cwd();

  if (currentDir === rootDir) {
    return;
  }

  try {
    const parentDir = resolve(currentDir, '..');
    chdir(parentDir);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Changes to specified directory
 * @param {string} path - Path to directory
 */
export async function changeDirectory(path) {
  const resolvedPath = await validateDirectory(path);

  try {
    chdir(resolvedPath);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Lists files and directories in current directory
 */
export async function listDirectory() {
  try {
    const currentDir = cwd();
    const entries = await readdir(currentDir);

    const directories = [];
    const files = [];

    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry);
      try {
        const stats = await stat(fullPath);
        if (stats.isDirectory()) {
          directories.push({ name: entry, type: 'directory' });
        } else {
          files.push({ name: entry, type: 'file' });
        }
      } catch {
        continue;
      }
    }

    directories.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    const allItems = [...directories, ...files];

    printDirectoryTable(allItems);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}