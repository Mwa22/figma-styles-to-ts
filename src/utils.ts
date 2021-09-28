const nconf = require("nconf");
const fs = require("fs");
const path = require("path");

export function getEnv(): {
	personal_token: string;
	file_key: string;
	constants_path: string;
} {
	nconf.argv().env().file({ file: "./figma.config.json" });

	const personal_token: string = nconf.get("FIGMA_PERSONAL_TOKEN");
	const file_key: string = nconf.get("FIGMA_FILE_KEY");
	let constants_path: string = nconf.get("constants_folder_path");

	if (
		!personal_token ||
		!file_key ||
		!personal_token.length ||
		!file_key.length
	) {
		console.error(
			"Please pass 'FIGMA_PERSONAL_TOKEN' and 'FIGMA_FILE_KEY' in .env and re-run"
		);
		process.exit(1);
	}

	if (!constants_path || !constants_path.length) {
		console.error(
			"Please pass 'constants_folder_path' in figma.config.json and re-run"
		);
		process.exit(1);
	}

	// Make path absolute
	if (!path.isAbsolute(constants_path)) {
		constants_path = `${process.cwd()}/${constants_path}`;
	}

	// Create constants folder
	if (!fs.existsSync(constants_path)) {
		fs.mkdirSync(constants_path, { recursive: true });
	}

	return { personal_token, file_key, constants_path };
}

export function rgbToHex(r: number, g: number, b: number): string {
	const color =
		"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

	if (color.length > 7) {
		return color.slice(0, 7);
	}
	return color;
}

export function colorNameRecursively(
	container: any,
	values: string[],
	color: string
) {
	if (values?.length === 1) {
		if (container[values[0]]) {
			container[values[0]].value = color;
		} else {
			container[values[0]] = { value: color };
		}
	} else {
		let name = values.shift();

		if (!container[name]) container[name] = {};
		colorNameRecursively(container[name], values, color);
	}
}

export function formatColorsToTSFile(colors: any): string {
	return `export interface Colors ${JSON.stringify(colors, null, 4)}

const COLORS: Colors = ${JSON.stringify(colors, null, 4)}

export default COLORS;
	`;
}
