import { BlendMode, EffectType, Node } from "../types/ast";
import Config from "../config/Config";
import FigmaAPI from "../api/FigmaAPI";
import ShadowTemplate from "./ShadowTemplate";

interface Shadow {
	name: string;
	value: string;
}

class ShadowTemplateDefault extends ShadowTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	_getShadowFromNode(node: any): Shadow | undefined {
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

		return { value, name: doc.name };
	}

	_setShadowRecursively(container: any, values: string[], shadow: string) {
		if (values?.length === 1) {
			if (container[values[0]]) {
				container[values[0]].value = shadow;
			} else {
				container[values[0]] = { value: shadow };
			}
		} else {
			let name = values.shift();

			if (!container[name]) container[name] = {};
			this._setShadowRecursively(container[name], values, shadow);
		}
	}

	_formatToCode(container: any): string {
		const shadows = JSON.stringify(container, null, 4).replace(
			/"([^"])+":/g,
			(match) => match.slice(1, match.length - 2) + ":"
		);
		const shadows_interface = shadows.replace(/: "([^"])+"/g, ": Shadow");

		return `export type Shadow = string;

export interface Shadows ${shadows_interface}

const SHADOWS: Shadows = ${shadows}

export default SHADOWS;`;
	}

	async generate() {
		if (!this._nodes) {
			throw new Error("No shadows fetched from api.\n");
		}

		// Container
		const shadows = {};

		// Add shadows to container
		Object.values(this._nodes).forEach((node) => {
			try {
				const shadow = this._getShadowFromNode(node);
				if (!shadow) return;

				const { value, name } = shadow;
				const names = name
					.split("/")
					.map((n) => (isNaN(parseInt(n)) ? n : `T${n}`));
				this._setShadowRecursively(shadows, names, value);
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		await this._generateFile(shadows, this._formatToCode(shadows));
	}
}

export default ShadowTemplateDefault;
