import * as nconf from "nconf";
import path = require("path");
import * as fs from "fs";

class ImageConfig {
	enable: boolean;
	outDir: string;
	page: string;
	container: string;

	constructor() {
		this._getEnable();
		if (this.enable) {
			this._getOutDir();
			this._getPage();
			this._getContainer();
		}
	}

	_getEnable() {
		this.enable = nconf.get("image:enable") ?? true;

		// Check enable
		if (typeof this.enable !== "boolean") {
			console.error(
				`Wrong figma config entry: 'image': { 'enable': ${this.enable} }. You must choose one of these values: [true, false].\n`
			);
			process.exit(1);
		}
	}

	async _getOutDir() {
		this.outDir = nconf.get("image:outDir");

		// Check out directory
		if (!this.outDir || !this.outDir.length) {
			console.error(
				"Please pass: 'image': { 'outDir': 'the_out_dir' } in figma.config.json and re-run\n"
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
				console.log(`Image output folder created !\n`);
			} catch (err) {
				console.error(
					`Couldn't create the image output folder: ${err.message}`
				);
				process.exit(1);
			}
		}
	}

	_getPage() {
		this.page = nconf.get("image:page") ?? "";

		if (typeof this.page !== "string") {
			console.error(
				`Wrong figma config entry: 'image': { page: ${this.page} }. You must enter a string.`
			);
			process.exit(1);
		}
	}

	_getContainer() {
		this.container = nconf.get("image:container") ?? "";

		if (typeof this.container !== "string") {
			console.error(
				`Wrong figma config entry: 'image': { container: ${this.container} }. You must enter a string.`
			);
			process.exit(1);
		}
	}
}

export default ImageConfig;
