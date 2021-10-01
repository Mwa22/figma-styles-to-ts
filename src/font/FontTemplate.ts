import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import { Node } from "../types/ast";
import * as fs from "fs";

interface Font {
	name: string;
	fontFamily: string;
	fontWeight: number;
	fontSize: number;
	letterSpacing: number;
	lineHeight: string;
}

export enum FontTemplateEnum {
	default = "default",
	react = "react",
	chakra = "chakra",
}

class FontTemplate {
	_config: Config;
	_api: FigmaAPI;
	_fonts: any;

	constructor(config: Config, api: FigmaAPI) {
		this._api = api;
		this._config = config;
	}

	init() {
		return this._getFonts();
	}

	async _getFontIds(): Promise<string[]> {
		// Get styles from api
		const styles = await this._api.getStylesByFileKey();

		// Get all node ids
		const font_ids: string[] = styles
			.filter((style) => style.style_type === "TEXT")
			.map((style) => style.node_id);

		if (!font_ids || !font_ids.length) {
			throw new Error("Couldn't get any texts from api.\n");
		}
		return font_ids;
	}

	async _getFontNodes() {
		const ids = await this._getFontIds();
		return await this._api.getNodes(ids);
	}

	async _getFonts() {
		// Container
		const fonts = {};

		// Add fonts to container
		Object.values(await this._getFontNodes()).forEach((node) => {
			try {
				const font = this._getFontFromNode(node);
				if (!font) return;

				const fontValue = {
					fontFamily: font.fontFamily,
					fontWeight: font.fontWeight,
					fontSize: font.fontSize,
					letterSpacing: font.letterSpacing,
					lineHeight: font.lineHeight,
				};

				const names = font.name
					.split("/")
					.map((n) => (isNaN(parseInt(n)) ? n : `T${n}`));
				this._setFontRecursively(fonts, names, fontValue);
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		this._fonts = fonts;
	}

	_getFontFromNode(node: any): Font | undefined {
		const doc: Node<"TEXT"> = node.document as any;

		// Test correct font type
		if (doc.type !== "TEXT") {
			throw new Error(`The font "${doc.name}" could not be retrieved\n`);
		}

		const font: Font = {
			name: doc.name,
			fontFamily: doc?.style?.fontFamily,
			fontSize: doc?.style?.fontSize,
			fontWeight: doc?.style?.fontWeight,
			letterSpacing: doc?.style?.letterSpacing,
			lineHeight: doc?.style?.lineHeightPx
				? `${doc?.style?.lineHeightPx}px`
				: undefined,
		};

		//Test name format
		const regex = new RegExp(`^${this._config.font.base}/*`);
		if (this._config.font.base !== "") {
			if (!regex.test(doc.name)) {
				return;
			} else {
				// Remove base from name
				font.name = doc.name.slice(
					this._config.font.base.length + 1,
					doc.name.length
				);
			}
		}

		return font;
	}

	async _generateFile(container: any, formated: string) {
		// No fonts
		if (!Object.keys(container).length) {
			console.error(
				`No fonts selected ! The fonts.ts file has not been created.\n`
			);
			return;
		}

		// Create fonts file
		await fs.promises.writeFile(
			`${this._config.font.outDir}/fonts.ts`,
			formated
		);

		console.log("fonts.ts created successfully !\n");
	}

	_setFontRecursively(container: any, values: string[], font: any) {
		if (values?.length === 1) {
			if (container[values[0]]) {
				container[values[0]].value = font;
			} else {
				container[values[0]] = { value: font };
			}
		} else {
			let name = values.shift();

			if (!container[name]) container[name] = {};
			this._setFontRecursively(container[name], values, font);
		}
	}

	_formatToCode(container: any): string {
		const fonts = JSON.stringify(container, null, 4).replace(
			/"([^"])+":/g,
			(match) => match.slice(1, match.length - 2) + ":"
		);
		const fonts_interface = fonts.replace(
			/value: {([^}])+}/g,
			"value: Font"
		);

		return `export interface Font {
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    letterSpacing: number;
    lineHeight: string;
}

export interface Fonts ${fonts_interface}

const FONTS: Fonts = ${fonts}

export default FONTS;`;
	}

	async _generate() {
		if (!this._fonts) {
			throw new Error("No fonts fetched from api.\n");
		}

		await this._generateFile(this._fonts, this._formatToCode(this._fonts));
	}
}

export default FontTemplate;
