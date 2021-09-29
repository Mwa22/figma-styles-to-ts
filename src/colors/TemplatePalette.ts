import { ENV } from "../utils/env";
import { Node } from "../types/ast";
import Template from "./Template";

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

class TemplatePalette extends Template {
	constructor(env: ENV) {
		super(env);
	}

	async init() {
		super.init();
	}

	_getColorFromNode(node: any): Color {
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
			throw new Error(`The color "${doc.name}" could not be retrieved`);
		}

		const c = doc.fills[0]?.color;
		const hex = Template.rgbToHex(c.r * 256, c.g * 256, c.b * 256);

		//Test name format
		const names = doc.name.split("/");
		if (
			names.length > 2 ||
			Number.isNaN(parseInt(names[1])) ||
			Object.values(ColorPaletteEnum).includes(parseInt(names[1]))
		) {
			throw new Error(
				`The color "${doc.name}" has not a correct format. (see palette format)`
			);
		}

		return {
			hex,
			name: doc.name,
			type: names.length === 1 ? undefined : parseInt(names[1]),
		};
	}

	_formatContainerToCode(container: any): string {
		return `export type Color = string;

        export interface ColorPalette {
			${Object.keys(ColorPaletteEnum)
				.map((type) => `${type}: Color;`)
				.join("\n")}
        }
        
        export interface Colors {
            ${Object.entries(container)
				.map((name, color) => {
					return `${name}: ${
						typeof color === "string" ? "Color" : "ColorPalette"
					};`;
				})
				.join("\n")}
        }

        const COLORS: Colors = ${JSON.stringify(container, null, 4)}
        
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
				const { hex, name, type } = this._getColorFromNode(node);
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
			const types = Object.values(colors[name]);
			const missingEl = Object.keys(ColorPaletteEnum).findIndex(
				(type) => !types.includes(type)
			);
			if (missingEl !== -1) {
				console.error(
					`The color '${name}' has missing types. (see template palette)`
				);
				delete colors[name];
			}
		});

		// Create colors file
		await fs.writeFile(
			`${this._env.OutPath}/colors.ts`,
			this._formatContainerToCode(colors)
		);

		console.log("colors.ts created successfully !");
	}
}

export default TemplatePalette;
