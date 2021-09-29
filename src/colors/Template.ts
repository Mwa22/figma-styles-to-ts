import FigmaAPI from "../api/FigmaAPI";
import { ENV } from "../utils/env";

export enum ColorTemplateEnum {
	default = "default",
	palette = "palette",
}

class Template {
	_env: ENV;
	_api: FigmaAPI;
	_nodes: any;

	constructor(env: ENV) {
		this._api = new FigmaAPI(env);
		this._env = env;
	}

	async init() {
		await this._getNodeColor();
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
		/** Get all colors node-id */
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
		this._nodes = this._api.getNodesColor(colors_id);
	}
}

export default Template;
