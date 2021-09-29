import { ColorTemplateEnum } from "../colors/Template";

import * as nconf from "nconf";
import * as fs from "fs";
import * as path from "path";

export interface ENV {
	PersonalToken: string;
	FileKey: string;
	OutPath: string;
	Color: boolean;
	ColorTemplate: string;
}

export async function getEnv(): Promise<ENV> {
	const token_file = `${process.cwd()}/node_modules/figma-styles-to-ts/token.json`;

	nconf.argv().file("./figma.config.json").file("token", token_file);
	nconf.defaults({
		color: true,
		color_template: ColorTemplateEnum.default,
	});

	const personal_token: string = nconf.get("token");
	const file_key: string = nconf.get("fileKey");
	let out_path: string = nconf.get("outDir");
	const color = nconf.get("color");
	const color_template = nconf.get("colorTemplate");

	// Check personal token
	if (!personal_token || !personal_token.length) {
		console.error(
			"Please use command: figma-styles-to-ts --token=your_token, in argument and re-run"
		);
		process.exit(1);
	}

	// Check colors config
	if (typeof color !== "boolean") {
		console.error(
			`Wrong figma config entry: color. You must choose one of these values: [true, false].`
		);
		process.exit(1);
	}
	console.log(color_template);
	if (!Object.values(ColorTemplateEnum).includes(color_template)) {
		console.error(
			`Wrong figma config entry: colorTemplate. You must choose one of these values: [${Object.values(
				ColorTemplateEnum
			)
				.map((v) => `"${v}"`)
				.join(", ")}].`
		);
		process.exit(1);
	}

	// Create token file
	if (!fs.existsSync(token_file)) {
		try {
			await fs.promises.writeFile(
				token_file,
				JSON.stringify({ token: personal_token })
			);
			console.log(
				"Token config file created ! To reset the token use: figma-styles-reset"
			);
		} catch (err) {
			console.error(
				"Couldn't create the token config file: " + err.message
			);
		}
	}

	// Check global config
	if (!out_path || !out_path.length || !file_key || !file_key.length) {
		console.error(
			"Please pass 'outDir' and 'fileKey' in figma.config.json and re-run"
		);
		process.exit(1);
	}

	// Make outDir absolute
	if (!path.isAbsolute(out_path)) {
		out_path = `${process.cwd()}/${out_path}`;
	}

	// Create outDir folder
	if (!fs.existsSync(out_path)) {
		try {
			await fs.promises.mkdir(out_path, { recursive: true });
			console.log(`Output folder created !`);
		} catch (err) {
			console.error("Couldn't create the output folder: " + err.message);
			process.exit(1);
		}
	}

	return {
		PersonalToken: personal_token,
		FileKey: file_key,
		OutPath: out_path,
		Color: color,
		ColorTemplate: color_template,
	};
}
