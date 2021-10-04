import * as nconf from "nconf";
import path = require("path");
import * as fs from "fs";
import { FontTemplateEnum } from "../font/FontTemplate";

class FontConfig {
	enable: boolean;
	outDir: string;
	template: FontTemplateEnum;
	base: string;

	constructor() {
		this._getEnable();
		if (this.enable) {
			this._getOutDir();
			this._getTemplate();
			this._getBase();
		}
	}

	_getEnable() {
		this.enable = nconf.get("font:enable") ?? false;

		// Check enable
		if (typeof this.enable !== "boolean") {
			console.error(
				`Wrong figma config entry: 'font': { 'enable': ${this.enable} }. You must choose one of these values: [true, false].\n`
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

	_getTemplate() {
		this.template = nconf.get("font:template") ?? FontTemplateEnum.default;

		if (!Object.values(FontTemplateEnum).includes(this.template)) {
			console.error(
				`Wrong figma config entry: 'font': { 'template': ${
					this.template
				} }. You must choose one of these values: [${Object.values(
					FontTemplateEnum
				)
					.map((v) => `"${v}"`)
					.join(", ")}].\n`
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
