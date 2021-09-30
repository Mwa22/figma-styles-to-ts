import { Node } from "../types/ast";
import ColorTemplate from "./ColorTemplate";
import Config from "../config/Config";

interface Color {
	hex: string;
	// Color: Black/500
	// name = Black
	// type = 500
	name: string;
	type?: number;
}

enum ColorPaletteEnum {
	T100 = 100,
	T200 = 200,
	T300 = 300,
	T400 = 400,
	T500 = 500,
	T600 = 600,
	T700 = 700,
}

class ColorTemplatePalette extends ColorTemplate {
	constructor(config: Config) {
		super(config);
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

		const names = doc.name.split("/");

		if (names.length === 1) {
			return { hex, name: doc.name };
		}

		if (
			names.length > 2 ||
			Number.isNaN(parseInt(names[1])) ||
			!Object.values(ColorPaletteEnum).includes(parseInt(names[1]))
		) {
			throw new Error(
				`The color "${doc.name}" has not a correct format. (see palette format)`
			);
		}

		return {
			hex,
			name: names[0],
			type: parseInt(names[1]),
		};
	}

	_formatToCode(container: any): string {
		return `export type Color = string;

export interface ColorPalette {
${Object.values(ColorPaletteEnum)
	.filter((value) => !Number.isNaN(parseInt(value as string)))
	.map((type) => `\tT${type}: Color;`)
	.join("\n")}
}
        
export interface Colors {
${Object.entries(container)
	.map(([name, color]) => {
		return `\t${name}: ${
			typeof color === "string" ? "Color" : "ColorPalette"
		};`;
	})
	.join("\n")}
}

const COLORS: Colors = {
${Object.entries(container)
	.map(([name, color]) => {
		if (typeof color === "string") return `\t${name}: "${color}",`;
		return `\t${name}: {
${Object.entries(color)
	.sort(
		(left, right) =>
			parseInt(left[0].slice(1, left[0].length)) -
			parseInt(right[0].slice(1, right[0].length))
	)
	.map(([type, value]) => `\t\t${type}: "${value}",`)
	.join("\n")}
	},`;
	})
	.join("\n")}
};
        
export default COLORS;
        `;
	}

	async generate() {
		if (!this._nodes) {
			throw new Error("No color fetched from api.");
		}

		// Container
		const colors: any = {};

		// Add colors to container
		Object.values(this._nodes).forEach((node) => {
			try {
				const color = this._getColorFromNode(node);
				if (!color) return;

				const { hex, name, type } = color;
				if (colors[name] && typeof colors[name] !== "string") {
					colors[name][`T${type}`] = hex;
				} else {
					colors[name] = type ? { [`T${type}`]: hex } : hex;
				}
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		// Test each colors that have all types
		Object.keys(colors).forEach((name) => {
			if (typeof colors[name] === "string") return;
			const types = Object.keys(colors[name]);
			const missingEl = Object.keys(ColorPaletteEnum)
				.filter((key) => Number.isNaN(parseInt(key)))
				.findIndex((type) => !types.includes(type));
			if (missingEl !== -1) {
				console.error(
					`The color '${name}' has missing types. (see template palette)`
				);
				delete colors[name];
			}
		});

		await this._generateFile(colors, this._formatToCode(colors));
	}
}

export default ColorTemplatePalette;
