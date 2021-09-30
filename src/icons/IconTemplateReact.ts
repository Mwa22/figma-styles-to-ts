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

		console.log("\nindex.tsx file generated successfully !");
	}

	async _generateStorybookFile() {
		let result = `import { Meta } from "@storybook/react";
import * as Icons from "./index";
        
//👇 This default export determines where your story goes in the story list
export default {
    title: "All/Icons",
    component: Icons.${this._icons[0].name.trim()},
} as Meta;

//👇 We create a “template” of how args map to rendering
${this._icons
	.map(
		(icon) =>
			`export const ${icon.name.trim()} = () => <Icons.${icon.name.trim()} height={50} width={50} />;`
	)
	.join("\n")}
`;

		await fs.promises.writeFile(
			`${this._config.icon.outDir}/index.stories.tsx`,
			result
		);

		console.log("index.stories.tsx file generated successfully !\n");
	}

	async generate() {
		await this._generateFiles(this._formatToCode);
		await this._generateIndexFile();
		if (this._config.icon.storybook) {
			await this._generateStorybookFile();
		}
	}
}

export default IconTemplateReact;
