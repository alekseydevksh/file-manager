import { EOL, cpus, homedir, userInfo, arch } from 'node:os';
import { MESSAGES } from '../utils/messages.js';
import { validateArgs } from '../utils/validation.js';

export const OS_OPTIONS = {
  OS: 'os',
  EOL: '--EOL',
  CPUS: '--cpus',
  HOMEDIR: '--homedir',
  USERNAME: '--username',
  ARCHITECTURE: '--architecture',
};

export const osHandlers = {
  [OS_OPTIONS.OS]: async (args) => {
    validateArgs(args, 1);
    await handleOsCommand(args[0]);
  },
};

const commandHandlers = {
  [OS_OPTIONS.EOL]: () => {
    console.log(JSON.stringify(EOL));
  },
  [OS_OPTIONS.CPUS]: () => {
    const cpuInfo = cpus();
    console.log(`Overall amount of CPUS: ${cpuInfo.length}`);
    for (const [index, cpu] of cpuInfo.entries()) {
      const clockRate = (cpu.speed / 1000).toFixed(2);
      console.log(`${index + 1}. Model: ${cpu.model}, Clock rate: ${clockRate} GHz`);
    }
  },
  [OS_OPTIONS.HOMEDIR]: () => {
    console.log(homedir());
  },
  [OS_OPTIONS.USERNAME]: () => {
    console.log(userInfo().username);
  },
  [OS_OPTIONS.ARCHITECTURE]: () => {
    console.log(arch());
  },
};

/**
 * Handles OS-related commands
 * @param {string} option - OS command option
 */
export async function handleOsCommand(option) {
  const handler = commandHandlers[option];

  if (!handler) {
    throw new Error(MESSAGES.INVALID_INPUT);
  }

  try {
    handler();
  } catch (error) {
    if (error.message === MESSAGES.INVALID_INPUT) {
      throw error;
    }
    throw new Error(MESSAGES.OPERATION_FAILED);
  }
}