import * as nconf from "nconf";
import path = require("path");
import * as fs from "fs";

class FontConfig {
	disable: boolean;
	outDir: string;
	react: boolean;
	base: string;

	constructor() {
		this._getDisable();
		if (!this.disable) {
			this._getOutDir();
			this._getReact();
			this._getBase();
		}
	}

	_getDisable() {
		this.disable = nconf.get("font:disable") ?? false;

		// Check disable
		if (typeof this.disable !== "boolean") {
			console.error(
				`Wrong figma config entry: 'font': { 'disable': ${this.disable} }. You must choose one of these values: [true, false].\n`
			);
			process.exit(1);
		}
	}

	async _getOutDir() {
		this.outDir = nconf.get("font:outDir");

		// Check out directory
		if (!this.outDir || !this.outDir.length) {
			console.error(
				"Please pass: 'font': { 'outDir': 'the_out_dir' } in figma.config.json and re-run\n"
			);
			process.exit(1);
		}

		// Make outDir absolute
		if (!path.isAbsolute(this.outDir)) {
			this.outDir = `${process.cwd()}/${this.outDir}`;
		}

		// Create outDir folder
		if (!fs.existsSync(this.outDir)) {
			try {
				await fs.promises.mkdir(this.outDir, { recursive: true });
				console.log(`Font output folder created !\n`);
			} catch (err) {
				console.error(
					`Couldn't create the font output folder: ${err.message}`
				);
				process.exit(1);
			}
		}
	}

	_getReact() {
		this.react = nconf.get("font:react") ?? false;

		if (typeof this.react !== "boolean") {
			console.error(
				`Wrong figma config entry: 'font': { 'react': ${this.react} }. You must choose one of these values: [true, false].\n`
			);
			process.exit(1);
		}
	}

	_getBase() {
		this.base = nconf.get("font:base") ?? "";

		if (typeof this.base !== "string") {
			console.error(
				`Wrong figma config entry: 'font': { base: ${this.base} }. You must enter a string.`
			);
			process.exit(1);
		}
	}
}

export default FontConfig;