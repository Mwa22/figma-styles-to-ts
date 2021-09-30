import Config from "../config/Config";
import IconTemplate from "./IconTemplate";
import * as fs from "fs";

class IconTemplateReact extends IconTemplate {
	constructor(config: Config) {
		super(config);
	}

	init() {
		return super.init();
	}

	_formatToCode(name: string, svg: string): string {
		// format <svg>
		const svgRow = svg.split("\n");
		svgRow[0] = svgRow[0].replace(
			/(fill|width|height)=("|')([^("|')])+("|') /g,
			""
		);
		svgRow[0] = svgRow[0].replace(">", " {...props}>");
		svg = svgRow.join("\n");

		// format svg body
		svg = svg.replace(/fill=("|')([^("|')])+("|')/g, "fill={props.fill}");
		svg = svg.replace(
			/stroke=("|')([^("|')])+("|')/g,
			"stroke={props.fill}"
		);

		// replace kebab-case props by camelCase
		function replaceCase(match: string) {
			match = match[1].toUpperCase() + match.slice(2, match.length);
			return match;
		}
		svg = svg.replace(/-[a-z]+=/g, replaceCase);

		return `const ${name} = (props: React.SVGProps<SVGSVGElement>) => {
    return (
${svg
	.trim()
	.split("\n")
	.map((row) => `\t\t${row}`)
	.join("\n")}
    );
}
export default ${name};
        `;
	}

	async _generateIndexFile() {
		let result = this._icons
			.map(
				(icon) =>
					`import ${icon.name.trim()} from "./${icon.name.trim()}";`
			)
			.join("\n");

		result += `\n\nexport { ${this._icons
			.map((icon) => `${icon.name.trim()}`)
			.join(", ")} };`;

		await fs.promises.writeFile(
			`${this._config.icon.outDir}/index.tsx`,
			result
		);

		console.log("index.tsx file generated successfully !\n");
	}

	async generate() {
		await this._generateFiles(this._formatToCode);
		await this._generateIndexFile();
	}
}

export default IconTemplateReact;
