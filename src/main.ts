#! /usr/bin/env node
import { ColorTemplateEnum } from "./colors/Template";
import ColorTemplateDefault from "./colors/TemplateDefault";
import ColorTemplatePalette from "./colors/TemplatePalette";
import Config from "./config/Config";

async function main() {
	// Get config
	const config = new Config();

	if (!config.color.disable) {
		const template =
			config.color.template === ColorTemplateEnum.default
				? new ColorTemplateDefault(config)
				: new ColorTemplatePalette(config);

		try {
			await template.init();
			await template.generate();
		} catch (err) {
			console.error(err.message);
			process.exit(1);
		}
	}
}

main();
