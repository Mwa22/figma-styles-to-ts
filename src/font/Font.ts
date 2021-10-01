import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import { Node } from "../types/ast";
import * as fs from "fs";

interface IFont {
	name: string;
	fontFamily: string;
	fontWeight: number;
	fontSize: number;
	letterSpacing: number;
	lineHeight: number;
}

class Font {
	_config: Config;
	_api: FigmaAPI;
	_nodes: any;

	constructor(config: Config, api: FigmaAPI) {
		this._api = api;
		this._config = config;
	}

	init() {
		return this._getFontNodes();
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
		this._nodes = await this._api.getNodes(ids);
	}

	_getFontFromNode(node: any): IFont | undefined {
		const doc: Node<"TEXT"> = node.document as any;

		// Test correct font type
		if (doc.type !== "TEXT") {
			throw new Error(`The font "${doc.name}" could not be retrieved\n`);
		}

		const font: IFont = {
			name: doc.name,
			fontFamily: doc?.style?.fontFamily,
			fontSize: doc?.style?.fontSize,
			fontWeight: doc?.style?.fontWeight,
			letterSpacing: doc?.style?.letterSpacing,
			lineHeight: doc?.style?.lineHeightPx,
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

	async _generateReactFile(container: any, formated: string) {
		// No fonts
		if (!Object.keys(container).length) {
			console.error(
				`No fonts selected ! The Text.tsx file has not been created.\n`
			);
			return;
		}

		// Create fonts file
		await fs.promises.writeFile(
			`${this._config.font.outDir}/Text.tsx`,
			formated
		);

		console.log("Text.tsx created successfully !\n");
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
    lineHeight: number;
}

export interface Fonts ${fonts_interface}

const FONTS: Fonts = ${fonts}
        
export default FONTS;
`;
	}

	_formatCodeReact(): string {
		return `import { Font } from "./fonts";

export interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
	font?: Font;
	color?: string;
	children?: React.ReactNode | React.ReactNode[] | string | number;
}
		
const Text = ({ children, font, color, ...rest }: TextProps) => {
	return (
		<p
			style={{
				color: color,
				fontSize: font?.fontSize,
				fontFamily: font?.fontFamily,
				fontWeight: font?.fontWeight,
				lineHeight: font?.lineHeight,
				letterSpacing: font?.letterSpacing,
			}}
			{...rest}
		>
		{children}
		</p>
	);
};
		
export default Text;
`;
	}

	async generate() {
		if (!this._nodes) {
			throw new Error("No fonts fetched from api.\n");
		}

		// Container
		const fonts = {};

		// Add fonts to container
		Object.values(this._nodes).forEach((node) => {
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

		await this._generateFile(fonts, this._formatToCode(fonts));
		if (this._config.font.react) {
			await this._generateReactFile(fonts, this._formatCodeReact());
		}
	}
}

export default Font;
