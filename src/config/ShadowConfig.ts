import * as nconf from "nconf";
import path = require("path");
import * as fs from "fs";
import { ShadowTemplateEnum } from "../shadow/ShadowTemplate";

class ShadowConfig {
	disable: boolean;
	outDir: string;
	template: ShadowTemplateEnum;
	base: string;

	constructor() {
		this._getDisable();
		if (!this.disable) {
			this._getOutDir();
			this._getBase();
		}
	}

	_getDisable() {
		this.disable = nconf.get("shadow:disable") ?? false;

		// Check disable
		if (typeof this.disable !== "boolean") {
			console.error(
				`Wrong figma config entry: 'shadow': { 'disable': ${this.disable} }. You must choose one of these values: [true, false].\n`
			);
			process.exit(1);
		}
	}

	async _getOutDir() {
		this.outDir = nconf.get("shadow:outDir");

		// Check out directory
		if (!this.outDir || !this.outDir.length) {
			console.error(
				"Please pass: 'shadow': { 'outDir': 'the_out_dir' } in figma.config.json and re-run\n"
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
				console.log(`Shadow output folder created !\n`);
			} catch (err) {
				console.error(
					`Couldn't create the shadow output folder: ${err.message}`
				);
				process.exit(1);
			}
		}
	}

	_getTemplate() {
		this.template =
			nconf.get("shadow:template") ?? ShadowTemplateEnum.default;

		if (!Object.values(ShadowTemplateEnum).includes(this.template)) {
			console.error(
				`Wrong figma config entry: 'shadow': { 'template': ${
					this.template
				} }. You must choose one of these values: [${Object.values(
					ShadowTemplateEnum
				)
					.map((v) => `"${v}"`)
					.join(", ")}].\n`
			);
			process.exit(1);
		}
	}

	_getBase() {
		this.base = nconf.get("shadow:base") ?? "";

		if (typeof this.base !== "string") {
			console.error(
				`Wrong figma config entry: 'shadow': { base: ${this.base} }. You must enter a string.`
			);
			process.exit(1);
		}
	}
}

export default ShadowConfig;
