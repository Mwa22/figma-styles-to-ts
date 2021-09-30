import * as nconf from "nconf";
import path = require("path");
import * as fs from "fs";
import { IconTemplateEnum } from "../icons/IconTemplate";

class IconConfig {
	disable: boolean;
	outDir: string;
	page: string;
	template: IconTemplateEnum;
	storybook: boolean;
	container: string;

	constructor() {
		this._getDisable();
		if (!this.disable) {
			this._getOutDir();
			this._getPage();
			this._getContainer();
			this._getTemplate();
			this._getStorybook();
		}
	}

	_getDisable() {
		this.disable = nconf.get("icon:disable") ?? false;

		// Check disable
		if (typeof this.disable !== "boolean") {
			console.error(
				`Wrong figma config entry: 'icon': { 'disable': ${this.disable} }. You must choose one of these values: [true, false].\n`
			);
			process.exit(1);
		}
	}

	async _getOutDir() {
		this.outDir = nconf.get("icon:outDir");

		// Check out directory
		if (!this.outDir || !this.outDir.length) {
			console.error(
				"Please pass: 'icon': { 'outDir': 'the_out_dir' } in figma.config.json and re-run\n"
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
				console.log(`Icon output folder created !\n`);
			} catch (err) {
				console.error(
					`Couldn't create the icon output folder: ${err.message}`
				);
				process.exit(1);
			}
		}
	}

	_getTemplate() {
		this.template = nconf.get("icon:template") ?? IconTemplateEnum.default;

		if (!Object.values(IconTemplateEnum).includes(this.template)) {
			console.error(
				`Wrong figma config entry: 'icon': { 'template': ${
					this.template
				} }. You must choose one of these values: [${Object.values(
					IconTemplateEnum
				)
					.map((v) => `"${v}"`)
					.join(", ")}].\n`
			);
			process.exit(1);
		}
	}

	_getPage() {
		this.page = nconf.get("icon:page") ?? "";

		if (typeof this.page !== "string") {
			console.error(
				`Wrong figma config entry: 'icon': { page: ${this.page} }. You must enter a string.`
			);
			process.exit(1);
		}
	}

	_getContainer() {
		this.container = nconf.get("icon:container") ?? "";

		if (typeof this.container !== "string") {
			console.error(
				`Wrong figma config entry: 'icon': { container: ${this.container} }. You must enter a string.`
			);
			process.exit(1);
		}
	}

	_getStorybook() {
		this.storybook = nconf.get("icon:storybook") ?? false;

		if (typeof this.storybook !== "boolean") {
			console.error(
				`Wrong figma config entry: 'icon': { 'storybook': ${this.storybook} }. You must choose one of these values: [true, false].\n`
			);
			process.exit(1);
		}
	}
}

export default IconConfig;
