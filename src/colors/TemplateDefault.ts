import { ENV } from "../utils/env";
import { Node } from "../types/ast";
import Template from "./Template";

interface Color {
	name: string;
	hex: string;
}

class TemplateDefault extends Template {
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

	_formatContainerToCode(container: any): string {
		return `export interface Colors ${JSON.stringify(container, null, 4)}

        const COLORS: Colors = ${JSON.stringify(container, null, 4)}
        
        export default COLORS;
        `;
	}

	async generate() {
		if (!this._nodes) {
			throw new Error("No color fetched from api.");
		}

		// Container
		const colors = {};

		// Add colors to container
		Object.values(this._nodes).forEach((node) => {
			try {
				const { hex, name } = this._getColorFromNode(node);

				const names = name
					.split("/")
					.map((n) => (isNaN(parseInt(n)) ? n : `T${n}`));
				this._setColorRecursively(colors, names, hex);
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		// Create colors file
		await fs.promises.writeFile(
			`${this._env.OutPath}/colors.ts`,
			this._formatContainerToCode(colors)
		);

		console.log("colors.ts created successfully !");
	}
}

export default TemplateDefault;
