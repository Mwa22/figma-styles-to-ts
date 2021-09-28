#! /usr/bin/env node
import { GetFileNodesResult, GetFileStylesResult } from "./types/api";
import { Node } from "./types/ast";
import {
	colorNameRecursively,
	formatColorsToTSFile,
	rgbToHex,
} from "./utils/colors";
import { getEnv } from "./utils/env";

const axios = require("axios");
const fs = require("fs");

// Get environment variables
const { personal_token, file_key, out_path } = getEnv();

async function main() {
	// Get axios instance to fetch data from api
	const instance = axios.create({
		baseURL: "https://api.figma.com/v1",
		headers: {
			common: {
				"X-Figma-Token": personal_token,
			},
		},
	});

	/** Get all colors node-id */
	let colors_id: string[];

	try {
		// Get styles from api
		const {
			data: {
				meta: { styles },
			},
		}: { data: GetFileStylesResult } = await instance.get(
			`/files/${file_key}/styles`
		);

		// Get all node ids
		colors_id = styles
			.filter((style) => style.style_type === "FILL")
			.map((style) => style.node_id);

		if (!colors_id || !colors_id.length) {
			throw new Error("Couldn't get any colors from api.");
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	/** Get all colors */
	let colors: any = {};

	try {
		// Get nodes from api
		const {
			data: { nodes },
		}: { data: GetFileNodesResult } = await instance.get(
			`/files/${file_key}/nodes?ids=${colors_id.join(",")}`
		);

		Object.values(nodes).forEach((node) => {
			const doc: Node<"RECTANGLE"> = node.document as any;

			// Test correct color type
			if (
				doc.type !== "RECTANGLE" ||
				!doc.fills?.length ||
				doc.fills?.length > 1 ||
				doc.fills.find(
					(fill) =>
						fill.blendMode !== "NORMAL" || fill.type !== "SOLID"
				)
			) {
				console.error(`The color "${doc.name}" could not be retrieved`);
				return;
			}

			const c = doc.fills[0]?.color;
			const hex = rgbToHex(c.r * 256, c.g * 256, c.b * 256);
			const names = doc.name
				.split("/")
				.map((name) => (isNaN(parseInt(name)) ? name : `T${name}`));
			colorNameRecursively(colors, names, hex);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	// Create colors file
	fs.writeFileSync(`${out_path}/colors.ts`, formatColorsToTSFile(colors));
}

main();
