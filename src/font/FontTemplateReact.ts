import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import * as fs from "fs";
import FontTemplate from "./FontTemplate";

class FontTemplateReact extends FontTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
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

	_formatToCodeReact(): string {
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

export default Text;`;
	}

	async generate() {
		await super._generate();
		await this._generateReactFile(this._fonts, this._formatToCodeReact());
	}
}

export default FontTemplateReact;
