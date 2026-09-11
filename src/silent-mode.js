const fs = require('fs');
const os = require('os');
const path = require('path');

const executable = path.basename(process.execPath || '').toLowerCase();
const enabled =
	process.env.SILENT_RUN === '1' || executable.includes('silent');

if (!enabled) {
	module.exports = { enabled: false };
} else {
	function ensureDirectory(directory) {
		fs.mkdirSync(directory, { recursive: true });
	}

	function openLogFile() {
		const candidates = [];
		const explicit = process.env.UNBLOCK_LOG_FILE;

		if (explicit) {
			candidates.push(path.resolve(explicit));
		}

		const executableDirectory = path.dirname(
			process.execPath || process.argv[1] || __filename
		);
		candidates.push(path.join(executableDirectory, 'server.log'));

		if (process.env.LOCALAPPDATA) {
			candidates.push(
				path.join(
					process.env.LOCALAPPDATA,
					'UnblockNeteaseMusic',
					'server.log'
				)
			);
		}

		candidates.push(
			path.join(os.tmpdir(), 'unblock-netease-music-server.log')
		);

		for (const logPath of candidates) {
			try {
				ensureDirectory(path.dirname(logPath));
				const descriptor = fs.openSync(logPath, 'a');
				return { logPath, descriptor };
			} catch (error) {
				// Try the next fallback location.
			}
		}

		throw new Error('Unable to open any log file for silent mode');
	}

	const destination = openLogFile();
	const output = fs.createWriteStream(null, {
		fd: destination.descriptor,
		autoClose: false,
	});

	output.on('error', () => {});

	process.env.LOG_FILE = destination.logPath;
	process.stdout.write = output.write.bind(output);
	process.stderr.write = output.write.bind(output);

	if (Object.prototype.hasOwnProperty.call(process.stdout, 'isTTY')) {
		try {
			process.stdout.isTTY = false;
		} catch (error) {
			// isTTY may be read-only on some Node.js builds.
		}
	}

	module.exports = {
		enabled: true,
		logPath: destination.logPath,
	};
}
