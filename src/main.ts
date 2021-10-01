#! /usr/bin/env node
import FigmaAPI from "./api/FigmaAPI";
import { ColorTemplateEnum } from "./colors/ColorTemplate";
import ColorTemplateDefault from "./colors/ColorTemplateDefault";
import ColorTemplatePalette from "./colors/ColorTemplatePalette";
import Config from "./config/Config";
import Font from "./font/Font";
import { IconTemplateEnum } from "./icons/IconTemplate";
import IconTemplateDefault from "./icons/IconTemplateDefault";
import IconTemplateReact from "./icons/IconTemplateReact";

async function main() {
	// Get config
	const config = new Config();
	const api = new FigmaAPI(config);

	if (!config.color.disable) {
		console.log("--- COLORS ---\n");
		const template =
			config.color.template === ColorTemplateEnum.default
				? new ColorTemplateDefault(config, api)
				: new ColorTemplatePalette(config, api);

		try {
			await template.init();
			await template.generate();
		} catch (err) {
			console.error(err.message);
		}

		console.log("-------------\n");
	}

	if (!config.font.disable) {
		console.log("--- FONTS ---\n");
		const fonts = new Font(config, api);

		try {
			await fonts.init();
			await fonts.generate();
		} catch (err) {
			console.error(err.message);
		}

		console.log("-------------\n");
	}

	if (!config.icon.disable) {
		console.log("--- ICONS ---\n");
		const template =
			config.icon.template === IconTemplateEnum.default
				? new IconTemplateDefault(config, api)
				: new IconTemplateReact(config, api);

		try {
			await template.init();
			await template.generate();
		} catch (err) {
			console.error(err.message);
		}

		console.log("-------------\n");
	}
}

main();
