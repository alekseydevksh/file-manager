import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { MESSAGES } from '../utils/messages.js';
import { validateArgs, validateFile } from '../utils/validation.js';

export const HASH_COMMANDS = {
  HASH: 'hash',
};

export const hashHandlers = {
  [HASH_COMMANDS.HASH]: async (args) => {
    validateArgs(args, 1);
    await calculateHash(args[0]);
  },
};

/**
 * Calculates hash for file and prints it
 * @param {string} filePath - Path to file
 */
export async function calculateHash(filePath) {
  const resolvedPath = await validateFile(filePath);

  try {
    const hash = createHash('sha256');
    const stream = createReadStream(resolvedPath);

    for await (const chunk of stream) {
      hash.update(chunk);
    }

    const hashHex = hash.digest('hex');
    console.log(hashHex);
  } catch {
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}