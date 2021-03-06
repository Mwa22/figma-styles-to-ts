#! /usr/bin/env node
import FigmaAPI from "./api/FigmaAPI";
import { ColorTemplateEnum } from "./colors/ColorTemplate";
import ColorTemplateDefault from "./colors/ColorTemplateDefault";
import ColorTemplatePalette from "./colors/ColorTemplatePalette";
import Config from "./config/Config";
import { FontTemplateEnum } from "./font/FontTemplate";
import FontTemplateChakra from "./font/FontTemplateChakra";
import FontTemplateDefault from "./font/FontTemplateDefault";
import FontTemplateReact from "./font/FontTemplateReact";
import { IconTemplateEnum } from "./icons/IconTemplate";
import IconTemplateDefault from "./icons/IconTemplateDefault";
import IconTemplateReact from "./icons/IconTemplateReact";
import ImageTemplateDefault from "./images/ImageTemplateDefault";
import { ShadowTemplateEnum } from "./shadows/ShadowTemplate";
import ShadowTemplateDefault from "./shadows/ShadowTemplateDefault";
import ShadowTemplatePalette from "./shadows/ShadowTemplatePalette";

async function main() {
	// Get config
	const config = new Config();
	const api = new FigmaAPI(config);

	if (config.color.enable) {
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

	if (config.font.enable) {
		console.log("--- FONTS ---\n");
		let template;
		switch (config.font.template) {
			case FontTemplateEnum.default: {
				template = new FontTemplateDefault(config, api);
				break;
			}
			case FontTemplateEnum.react: {
				template = new FontTemplateReact(config, api);
				break;
			}
			case FontTemplateEnum.chakra: {
				template = new FontTemplateChakra(config, api);
				break;
			}
		}

		try {
			await template.init();
			await template.generate();
		} catch (err) {
			console.error(err.message);
		}

		console.log("-------------\n");
	}

	if (config.shadow.enable) {
		console.log("--- SHADOWS ---\n");
		const template =
			config.shadow.template === ShadowTemplateEnum.default
				? new ShadowTemplateDefault(config, api)
				: new ShadowTemplatePalette(config, api);

		try {
			await template.init();
			await template.generate();
		} catch (err) {
			console.error(err.message);
		}

		console.log("-------------\n");
	}

	if (config.icon.enable) {
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

	if (config.image.enable) {
		console.log("--- IMAGES ---\n");
		const template = new ImageTemplateDefault(config, api);

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
