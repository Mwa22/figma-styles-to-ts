#! /usr/bin/env node
import { ColorTemplateEnum } from "./colors/ColorTemplate";
import ColorTemplateDefault from "./colors/ColorTemplateDefault";
import ColorTemplatePalette from "./colors/ColorTemplatePalette";
import Config from "./config/Config";
import { IconTemplateEnum } from "./icons/IconTemplate";
import IconTemplateDefault from "./icons/IconTemplateDefault";
import IconTemplateReact from "./icons/IconTemplateReact";

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

	if (!config.icon.disable) {
		const template =
			config.icon.template === IconTemplateEnum.default
				? new IconTemplateDefault(config)
				: new IconTemplateReact(config);

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
