import { Node } from "../types/ast";
import ColorTemplate from "./ColorTemplate";
import Config from "../config/Config";
import FigmaAPI from "../api/FigmaAPI";

interface Color {
	name: string;
	hex: string;
}

class ColorTemplateDefault extends ColorTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	_getColorFromNode(node: any): Color | undefined {
		const doc: Node<"RECTANGLE"> = node.document as any;

		// Test correct color type
		if (
			doc.type !== "RECTANGLE" ||
			!doc.fills?.length ||
			doc.fills?.length > 1 ||
			doc.fills.find(
				(fill) => fill.blendMode !== "NORMAL" || fill.type !== "SOLID"
			)
		) {
			throw new Error(`The color "${doc.name}" could not be retrieved\n`);
		}

		const c = doc.fills[0]?.color;
		const hex = ColorTemplate.rgbToHex(c.r * 256, c.g * 256, c.b * 256);

		//Test name format
		const regex = new RegExp(`^${this._config.color.base}/*`);
		if (this._config.color.base !== "") {
			if (!regex.test(doc.name)) {
				return;
			} else {
				// Remove base from name
				doc.name = doc.name.slice(
					this._config.color.base.length + 1,
					doc.name.length
				);
			}
		}

		return { hex, name: doc.name };
	}

	_setColorRecursively(container: any, values: string[], color: string) {
		if (values?.length === 1) {
			if (container[values[0]]) {
				container[values[0]].value = color;
			} else {
				container[values[0]] = { value: color };
			}
		} else {
			let name = values.shift();

			if (!container[name]) container[name] = {};
			this._setColorRecursively(container[name], values, color);
		}
	}

	_formatToCode(container: any): string {
		const colors = JSON.stringify(container, null, 4).replace(
			/"([^"])+":/g,
			(match) => match.slice(1, match.length - 2) + ":"
		);
		const colors_interface = colors.replace(/: "([^"])+"/g, ": Color");

		return `export type Color = string;

export interface Colors ${colors_interface}

const COLORS: Colors = ${colors}

export default COLORS;`;
	}

	async generate() {
		if (!this._nodes) {
			throw new Error("No colors fetched from api.\n");
		}

		// Container
		const colors = {};

		// Add colors to container
		Object.values(this._nodes).forEach((node) => {
			try {
				const color = this._getColorFromNode(node);
				if (!color) return;

				const { hex, name } = color;
				const names = name
					.split("/")
					.map((n) => (isNaN(parseInt(n)) ? n : `T${n}`));
				this._setColorRecursively(colors, names, hex);
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		await this._generateFile(colors, this._formatToCode(colors));
	}
}

export default ColorTemplateDefault;
