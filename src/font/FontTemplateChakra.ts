import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import * as fs from "fs";
import FontTemplate from "./FontTemplate";

class FontTemplateChakra extends FontTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	async _generateChakraFile(container: any, formated: string) {
		// No fonts
		if (!Object.keys(container).length) {
			console.error(
				`No fonts selected ! The Paragraph.tsx file has not been created.\n`
			);
			return;
		}

		// Create fonts file
		await fs.promises.writeFile(
			`${this._config.font.outDir}/Paragraph.tsx`,
			formated
		);

		console.log("Paragraph.tsx created successfully !\n");
	}

	_formatToCodeChakra(): string {
		return `import { Text } from "@chakra-ui/layout";
import { Font } from "./fonts";

export interface ParagraphProps extends React.HTMLProps<HTMLParagraphElement> {
	font?: Font;
	color?: string;
	children?: React.ReactNode | React.ReactNode[] | string | number;
}

const Paragraph = ({ children, font, color, ...rest }: ParagraphProps) => {
	return (
		<Text color={color} fontFamily={font?.fontFamily} fontSize={font?.fontSize} fontWeight={font?.fontWeight} lineHeight={font?.lineHeight} letterSpacing={font?.letterSpacing}
			{...rest}
		>
		{children}
		</Text>
	);
};

export default Paragraph;`;
	}

	async generate() {
		await super._generate();
		await this._generateChakraFile(this._fonts, this._formatToCodeChakra());
	}
}

export default FontTemplateChakra;
