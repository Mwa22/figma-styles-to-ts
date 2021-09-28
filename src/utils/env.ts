const nconf = require("nconf");
const fs = require("fs");
const path = require("path");

export function getEnv(): {
	personal_token: string;
	file_key: string;
	out_path: string;
} {
	const token_file = `${process.cwd()}/node_modules/figma-styles-to-ts/.token`;

	nconf.argv().file({ file: "./figma.config.json" }).file({
		file: token_file,
	});

	const personal_token: string = nconf.get("token");
	const file_key: string = nconf.get("fileKey");
	let out_path: string = nconf.get("outDir");

	if (!personal_token || !personal_token.length) {
		console.error(
			"Please use command: figma-styles-to-ts --token=your_token, in argument and re-run"
		);
		process.exit(1);
	}

	// Create token file
	if (!fs.existsSync(token_file)) {
		fs.writeFileSync(token_file, `token = ${personal_token}`);
	}

	if (!out_path || !out_path.length || !file_key || !file_key.length) {
		console.error(
			"Please pass 'outDir' and 'fileKey' in figma.config.json and re-run"
		);
		process.exit(1);
	}

	// Make path absolute
	if (!path.isAbsolute(out_path)) {
		out_path = `${process.cwd()}/${out_path}`;
	}

	// Create constants folder
	if (!fs.existsSync(out_path)) {
		fs.mkdirSync(out_path, { recursive: true });
	}

	return { personal_token, file_key, out_path };
}
