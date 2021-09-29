#! /usr/bin/env node
import TemplateDefault from "./colors/TemplateDefault";
import TemplatePalette from "./colors/TemplatePalette";
import { ENV, getEnv } from "./utils/env";

async function main() {
	// Get environment variables
	const env: ENV = await getEnv();

	if (env.Color) {
		const template =
			env.ColorTemplate === "default"
				? new TemplateDefault(env)
				: new TemplatePalette(env);

		try {
			await template.init();
			template.generate();
		} catch (err) {
			console.error(err.message);
			process.exit(1);
		}
	}
}

main();
