import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import * as fs from "fs";

export enum ColorTemplateEnum {
	default = "default",
	palette = "palette",
}

class ColorTemplate {
	_config: Config;
	_api: FigmaAPI;
	_nodes: any;

	constructor(config: Config) {
		this._api = new FigmaAPI(config);
		this._config = config;
	}

	init() {
		return this._getNodeColor();
	}

	static rgbToHex(r: number, g: number, b: number): string {
		const color =
			"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

		if (color.length > 7) {
			return color.slice(0, 7);
		}
		return color;
	}

	async _getColorsId(): Promise<string[]> {
		let colors_id: string[];

		// Get styles from api
		const styles = await this._api.getStylesByFileKey();

		// Get all node ids
		colors_id = styles
			.filter((style) => style.style_type === "FILL")
			.map((style) => style.node_id);

		if (!colors_id || !colors_id.length) {
			throw new Error("Couldn't get any colors from api.");
		}
		return colors_id;
	}

	async _getNodeColor() {
		const colors_id = await this._getColorsId();
		this._nodes = await this._api.getNodesColor(colors_id);
	}

	async _generateFile(container: any, formated: string) {
		// No colors
		if (!Object.keys(container).length) {
			console.error(
				`No colors selected ! The colors.ts file has not been created.\n`
			);
			return;
		}

		// Create colors file
		await fs.promises.writeFile(
			`${this._config.color.outDir}/colors.ts`,
			formated
		);

		console.log("colors.ts created successfully !\n");
	}
}

export default ColorTemplate;
