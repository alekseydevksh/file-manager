import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { toAbsolutePath, isDirectory, getFilename } from '../utils/path.js';
import { resolve } from 'node:path';
import { MESSAGES } from '../utils/messages.js';
import { validateArgs, validateFile } from '../utils/validation.js';

const COMPRESSION_EXTENSION = '.br';

export const COMPRESSION_COMMANDS = {
  COMPRESS: 'compress',
  DECOMPRESS: 'decompress',
};

export const compressionHandlers = {
  [COMPRESSION_COMMANDS.COMPRESS]: async (args) => {
    validateArgs(args, 2);
    await compress(args[0], args[1]);
  },
  [COMPRESSION_COMMANDS.DECOMPRESS]: async (args) => {
    validateArgs(args, 2);
    await decompress(args[0], args[1]);
  },
};

/**
 * Calculates output path for compression/decompression
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination path
 * @param {boolean} isCompress - Whether compressing or decompressing
 */
async function calculateOutputPath(sourcePath, destPath, isCompress) {
  const resolvedDest = toAbsolutePath(destPath);

  if (await isDirectory(resolvedDest)) {
    let fileName = getFilename(sourcePath);
    if (isCompress) {
      fileName = fileName + COMPRESSION_EXTENSION;
    } else if (fileName.endsWith(COMPRESSION_EXTENSION)) {
      fileName = fileName.slice(0, -COMPRESSION_EXTENSION.length);
    }
    return resolve(resolvedDest, fileName);
  }
  return resolvedDest;
}

/**
 * Compresses file using Brotli algorithm via Streams API
 * @param {string} sourcePath - Path to source file
 * @param {string} destPath - Path to destination (file or directory)
 */
export async function compress(sourcePath, destPath) {
  const resolvedSource = await validateFile(sourcePath);
  const outputPath = await calculateOutputPath(resolvedSource, destPath, true);

  try {
    const readStream = createReadStream(resolvedSource);
    const compressStream = createBrotliCompress();
    const writeStream = createWriteStream(outputPath);

    await pipeline(readStream, compressStream, writeStream);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}

/**
 * Decompresses file using Brotli algorithm via Streams API
 * @param {string} sourcePath - Path to compressed file
 * @param {string} destPath - Path to destination (file or directory)
 */
export async function decompress(sourcePath, destPath) {
  const resolvedSource = await validateFile(sourcePath);
  const outputPath = await calculateOutputPath(resolvedSource, destPath, false);

  try {
    const readStream = createReadStream(resolvedSource);
    const decompressStream = createBrotliDecompress();
    const writeStream = createWriteStream(outputPath);

    await pipeline(readStream, decompressStream, writeStream);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}