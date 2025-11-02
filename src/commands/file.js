import { createReadStream, createWriteStream } from 'node:fs';
import { unlink, mkdir, rename, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { getFilename } from '../utils/path.js';
import { cwd } from 'node:process';
import { resolve, dirname } from 'node:path';
import { MESSAGES } from '../utils/messages.js';
import { validateArgs, validateFile, validateDirectory } from '../utils/validation.js';

export const FILE_COMMANDS = {
  CAT: 'cat',
  ADD: 'add',
  MKDIR: 'mkdir',
  RENAME: 'rn',
  COPY: 'cp',
  MOVE: 'mv',
  DELETE: 'rm',
};

export const fileHandlers = {
  [FILE_COMMANDS.CAT]: async (args) => {
    validateArgs(args, 1);
    await readFile(args[0]);
  },
  [FILE_COMMANDS.ADD]: async (args) => {
    validateArgs(args, 1);
    await createFile(args[0]);
  },
  [FILE_COMMANDS.MKDIR]: async (args) => {
    validateArgs(args, 1);
    await createDirectory(args[0]);
  },
  [FILE_COMMANDS.RENAME]: async (args) => {
    validateArgs(args, 2);
    await renameFile(args[0], args[1]);
  },
  [FILE_COMMANDS.COPY]: async (args) => {
    validateArgs(args, 2);
    await copyFile(args[0], args[1]);
  },
  [FILE_COMMANDS.MOVE]: async (args) => {
    validateArgs(args, 2);
    await moveFile(args[0], args[1]);
  },
  [FILE_COMMANDS.DELETE]: async (args) => {
    validateArgs(args, 1);
    await deleteFile(args[0]);
  },
};

/**
 * Reads and displays file content using Readable stream
 * @param {string} filePath - Path to file
 */
export async function readFile(filePath) {
  const resolvedPath = await validateFile(filePath);

  try {
    const stream = createReadStream(resolvedPath, { encoding: 'utf8' });

    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }
    console.log();
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Creates empty file in current directory
 * @param {string} fileName - Name of file to create
 */
export async function createFile(fileName) {
  try {
    const filePath = resolve(cwd(), fileName);
    await writeFile(filePath, '');
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Creates new directory in current directory
 * @param {string} dirName - Name of directory to create
 */
export async function createDirectory(dirName) {
  try {
    const dirPath = resolve(cwd(), dirName);
    await mkdir(dirPath);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Renames file
 * @param {string} filePath - Path to file to rename
 * @param {string} newFileName - New filename
 */
export async function renameFile(filePath, newFileName) {
  const resolvedPath = await validateFile(filePath);

  try {
    const parentDir = dirname(resolvedPath);
    const newPath = resolve(parentDir, newFileName);
    await rename(resolvedPath, newPath);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Copies file using Readable and Writable streams
 * @param {string} sourcePath - Path to source file
 * @param {string} destPath - Path to destination directory
 */
export async function copyFile(sourcePath, destPath) {
  const resolvedSource = await validateFile(sourcePath);
  const resolvedDest = await validateDirectory(destPath);

  try {
    const fileName = getFilename(resolvedSource);
    const destFilePath = resolve(resolvedDest, fileName);

    const readStream = createReadStream(resolvedSource);
    const writeStream = createWriteStream(destFilePath);

    await pipeline(readStream, writeStream);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Moves file (copies then deletes) using streams
 * @param {string} sourcePath - Path to source file
 * @param {string} destPath - Path to destination directory
 */
export async function moveFile(sourcePath, destPath) {
  const resolvedSource = await validateFile(sourcePath);

  try {
    await copyFile(sourcePath, destPath);
    await unlink(resolvedSource);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Deletes file
 * @param {string} filePath - Path to file to delete
 */
export async function deleteFile(filePath) {
  const resolvedPath = await validateFile(filePath);

  try {
    await unlink(resolvedPath);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}