const fs = require('fs');
const path = require('path');

const input = path.resolve(__dirname, '..', 'dist', 'server.exe');
const output = path.resolve(__dirname, '..', 'dist', 'server-silent.exe');

if (!fs.existsSync(input)) {
	console.error(`Missing input binary: ${input}`);
	process.exit(1);
}

fs.copyFileSync(input, output);
const binary = fs.readFileSync(output);

if (binary.readUInt16LE(0) !== 0x5a4d) {
	console.error('server.exe is not a valid DOS MZ executable');
	process.exit(1);
}

const peOffset = binary.readUInt32LE(0x3c);
if (binary.toString('ascii', peOffset, peOffset + 4) !== 'PE\0\0') {
	console.error('PE signature not found at the expected offset');
	process.exit(1);
}

const optionalHeaderOffset = peOffset + 4 + 20;
const magic = binary.readUInt16LE(optionalHeaderOffset);
if (magic !== 0x10b && magic !== 0x20b) {
	console.error(
		`Unsupported PE optional header magic: 0x${magic.toString(16)}`
	);
	process.exit(1);
}

const subsystemOffset = optionalHeaderOffset + 68;
if (subsystemOffset + 2 > binary.length) {
	console.error('PE binary is too short to contain the subsystem field');
	process.exit(1);
}

const originalSubsystem = binary.readUInt16LE(subsystemOffset);
binary.writeUInt16LE(2, subsystemOffset);
fs.writeFileSync(output, binary);

console.log(
	`Created ${output} (subsystem ${originalSubsystem} -> 2, WINDOWS_GUI)`
);
