# File Manager

A CLI-based file manager application built with Node.js that provides comprehensive file and directory operations, system information, hash calculations, and file compression capabilities.

## Description

This File Manager is a command-line application that allows users to perform various file system operations, navigate directories, get system information, calculate file hashes, and compress/decompress files. It utilizes Node.js Streams API for efficient file operations and requires no external dependencies.

## Technical Requirements

- **Node.js version**: 24.14.0 or higher
- **No external dependencies**: Uses only Node.js built-in modules
- **Module system**: ES modules (ESM)

## Getting Started

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd file-manager
```

### Running the Application

Start the application using npm script:

```bash
npm run start -- --username=your_username
```

Replace `your_username` with your preferred username.

## Program Flow

### Startup

When the program starts, it displays:
```
Welcome to the File Manager, your_username!
You are currently in path_to_working_directory
```

The initial working directory is set to the current user's home directory (e.g., `/Users/Username` on macOS, `C:\Users\Username` on Windows).

### Runtime

The program prompts for commands in the console and waits for input. After each command execution (or empty input), it displays the current working directory:

```
You are currently in path_to_working_directory
```

### Shutdown

The program can be exited in two ways:

- Type `.exit` command
- Press `Ctrl + C`

Upon exit, it displays:
```
Thank you for using File Manager, your_username, goodbye!
```

## Error Handling

- **Invalid input**: If an unknown command or invalid input is provided, the program displays `Invalid input` and allows entering another command.
- **Operation failed**: If an error occurs during command execution (e.g., file not found, permission denied), the program displays `Operation failed` and allows entering another command.
- **Root directory protection**: Attempting to go up from the root directory does not change the working directory.

## Available Commands

### Navigation

- `up` - Go upper from current directory (does nothing if already at root directory)
- `cd path_to_directory` - Change directory (path can be relative or absolute)
- `ls` - List all files and folders in current directory (folders first, sorted alphabetically, with type column)

### File Operations

- `cat path_to_file` - Read and display file content (uses Readable stream)
- `add new_file_name` - Create empty file in current working directory
- `mkdir new_directory_name` - Create new directory in current working directory
- `rn path_to_file new_filename` - Rename file (content remains unchanged)
- `cp path_to_file path_to_new_directory` - Copy file to destination (uses Readable and Writable streams)
- `mv path_to_file path_to_new_directory` - Move file to destination (uses Readable and Writable streams)
- `rm path_to_file` - Delete file

### Operating System Info

- `os --EOL` - Display default system End-Of-Line character sequence
- `os --cpus` - Display host machine CPUs info (overall amount plus model and clock rate for each)
- `os --homedir` - Display home directory path
- `os --username` - Display current system username (not the username set at application start)
- `os --architecture` - Display CPU architecture for which Node.js binary was compiled

### Hash Calculation

- `hash path_to_file` - Calculate and display SHA-256 hash of a file

### Compression & Decompression

- `compress path_to_file path_to_destination` - Compress file using Brotli algorithm (uses Streams API, adds `.br` extension if destination is directory)
- `decompress path_to_file path_to_destination` - Decompress Brotli-compressed file (uses Streams API, removes `.br` extension if destination is directory)

**Note**: After decompressing a previously compressed file, the result should not differ from the originally compressed file.

## Implementation Details

- **Streams API**: File reading (`cat`), copying (`cp`, `mv`), and compression/decompression operations use Node.js Streams API for efficient memory usage.
- **No external dependencies**: All functionality is implemented using Node.js built-in modules only.
- **Error handling**: Comprehensive error handling with clear error messages for invalid input and failed operations.
- **Path resolution**: Supports both relative and absolute paths for file and directory operations.
- **Directory protection**: Prevents navigation above the root directory.
