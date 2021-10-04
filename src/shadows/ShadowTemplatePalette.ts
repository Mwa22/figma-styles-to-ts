import { BlendMode, EffectType, Node } from "../types/ast";
import Config from "../config/Config";
import FigmaAPI from "../api/FigmaAPI";
import ShadowTemplate from "./ShadowTemplate";

interface Shadow {
	value: string;
	// Shadow: Bottom/500
	// name = Bottom
	// type = 500
	name: string;
	type?: number;
}

enum ShadowPaletteEnum {
	T100 = 100,
	T200 = 200,
	T300 = 300,
	T400 = 400,
	T500 = 500,
}

class ShadowTemplatePalette extends ShadowTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	_getShadowromNode(node: any): Shadow | undefined {
		const doc: Node<"RECTANGLE"> = node.document as any;

		// Test correct shadow type
		if (doc.type !== "RECTANGLE" || !doc.effects?.length) {
			throw new Error(
				`The shadow "${doc.name}" could not be retrieved\n`
			);
		}

		const shadows = doc.effects.filter(
			(effect) =>
				effect.type === EffectType.DROP_SHADOW &&
				effect.blendMode === BlendMode.NORMAL &&
				effect.visible === true
		);

		if (!shadows?.length) {
			throw new Error(
				`The shadow "${doc.name}" could not be retrieved\n`
			);
		}

		const value = ShadowTemplate.getShadowValue(shadows);

		//Test name format
		const regex = new RegExp(`^${this._config.shadow.base}/*`);
		if (this._config.shadow.base !== "") {
			if (!regex.test(doc.name)) {
				return;
			} else {
				// Remove base from name
				doc.name = doc.name.slice(
					this._config.shadow.base.length + 1,
					doc.name.length
				);
			}
		}

		const names = doc.name.split("/");

		if (names.length === 1) {
			return { value, name: doc.name };
		}

		if (
			names.length > 2 ||
			Number.isNaN(parseInt(names[1])) ||
			!Object.values(ShadowPaletteEnum).includes(parseInt(names[1]))
		) {
			throw new Error(
				`The shadow "${doc.name}" has not a correct format. (see palette format)`
			);
		}

		return {
			value,
			name: names[0],
			type: parseInt(names[1]),
		};
	}

	_formatToCode(container: any): string {
		return `export type Shadow = string;

export interface ShadowPalette {
${Object.values(ShadowPaletteEnum)
	.filter((value) => !Number.isNaN(parseInt(value as string)))
	.map((type) => `\tT${type}: Shadow;`)
	.join("\n")}
}

export interface Shadows {
${Object.entries(container)
	.map(([name, shadow]) => {
		return `\t${name}: ${
			typeof shadow === "string" ? "Shadow" : "ShadowPalette"
		};`;
	})
	.join("\n")}
}

const SHADOWS: Shadows = {
${Object.entries(container)
	.map(([name, shadow]) => {
		if (typeof shadow === "string") return `\t${name}: "${shadow}",`;
		return `\t${name}: {
${Object.entries(shadow)
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

export default SHADOWS;`;
	}

	async generate() {
		if (!this._nodes) {
			throw new Error("No shadows fetched from api.");
		}

		// Container
		const shadows: any = {};

		// Add shadows to container
		Object.values(this._nodes).forEach((node) => {
			try {
				const shadow = this._getShadowromNode(node);
				if (!shadow) return;

				const { value, name, type } = shadow;
				if (shadows[name] && typeof shadows[name] !== "string") {
					shadows[name][`T${type}`] = value;
				} else {
					shadows[name] = type ? { [`T${type}`]: value } : value;
				}
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		// Test each shadows that have all types
		Object.keys(shadows).forEach((name) => {
			if (typeof shadows[name] === "string") return;
			const types = Object.keys(shadows[name]);
			const missingEl = Object.keys(ShadowPaletteEnum)
				.filter((key) => Number.isNaN(parseInt(key)))
				.findIndex((type) => !types.includes(type));
			if (missingEl !== -1) {
				console.error(
					`The shadow '${name}' has missing types. (see template palette)`
				);
				delete shadows[name];
			}
		});

		await this._generateFile(shadows, this._formatToCode(shadows));
	}
}

export default ShadowTemplatePalette;
