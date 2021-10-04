import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import { Effect } from "../types/ast";
import * as fs from "fs";

export enum ShadowTemplateEnum {
	default = "default",
	palette = "palette",
}

class ShadowTemplate {
	_config: Config;
	_api: FigmaAPI;
	_nodes: any;

	constructor(config: Config, api: FigmaAPI) {
		this._api = api;
		this._config = config;
	}

	init() {
		return this._getShadowNodes();
	}

	static getShadowValue(shadows: Effect[]): string {
		return shadows
			.map((s) => {
				const xOffset = s.offset?.x ?? 0;
				const yOffset = s.offset?.y ?? 0;
				const radius = s.radius.toFixed(0) ?? 0;
				const r = s.color?.r * 255 ?? 0;
				const g = s.color?.g * 255 ?? 0;
				const b = s.color?.b * 255 ?? 0;
				const a = s.color?.a ?? 1;

				return `${xOffset}px ${yOffset}px ${radius}px rgba(${r.toFixed(
					0
				)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${a.toFixed(2)})`;
			})
			.join(", ");
	}

	async _getShadowIds(): Promise<string[]> {
		// Get styles from api
		const styles = await this._api.getStylesByFileKey();

		// Get all node ids
		const ids: string[] = styles
			.filter((style) => style.style_type === "EFFECT")
			.map((style) => style.node_id);

		if (!ids || !ids.length) {
			throw new Error("Couldn't get any shadows from api.\n");
		}
		return ids;
	}

	async _getShadowNodes() {
		const ids = await this._getShadowIds();
		this._nodes = await this._api.getNodes(ids);
	}

	async _generateFile(container: any, formated: string) {
		// No shadows
		if (!Object.keys(container).length) {
			console.error(
				`No shadows selected ! The shadows.ts file has not been created.\n`
			);
			return;
		}

		// Create shadows file
		await fs.promises.writeFile(
			`${this._config.shadow.outDir}/shadows.ts`,
			formated
		);

		console.log("shadows.ts created successfully !\n");
	}
}

export default ShadowTemplate;
