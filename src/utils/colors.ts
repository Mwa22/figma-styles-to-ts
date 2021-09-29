// import { GetFileNodesResult, GetFileStylesResult } from "../types/api";
// import { Node } from "../types/ast";
// import { ENV } from "./env";

// export enum ColorTemplateEnum {
// 	default = "default",
// 	palette = "palette",
// }

// export enum ColorPalette {
// 	T100 = 100,
// 	T200 = 200,
// 	T300 = 300,
// 	T400 = 400,
// 	T500 = 500,
// 	T600 = 600,
// 	T700 = 700,
// }

// export interface Color {
// 	hex: string;
// 	// Color: Black/500
// 	// name = Black
// 	// type = 500
// 	name: string;
// 	type: number;
// }

// export async function generateColors(instance: any, env: ENV) {
// 	/** Get all colors node-id */
// 	let colors_id: string[];

// 	try {
// 		// Get styles from api
// 		const {
// 			data: {
// 				meta: { styles },
// 			},
// 		}: { data: GetFileStylesResult } = await instance.get(
// 			`/files/${env.FileKey}/styles`
// 		);

// 		// Get all node ids
// 		colors_id = styles
// 			.filter((style) => style.style_type === "FILL")
// 			.map((style) => style.node_id);

// 		if (!colors_id || !colors_id.length) {
// 			throw new Error("Couldn't get any colors from api.");
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		process.exit(1);
// 	}

// 	// Generate colors file
// 	if (env.ColorTemplate === ColorTemplateEnum.default) {
// 		generateColorsDefault(instance, env, colors_id);
// 	} else {
// 		generateColorsPalette(instance, env, colors_id);
// 	}
// }

// // Get color hex and color name from node
// export function getColorFromNode(node: any): {
// 	hex: string;
// 	name: string;
// } {
// 	const doc: Node<"RECTANGLE"> = node.document as any;

// 	// Test correct color type
// 	if (
// 		doc.type !== "RECTANGLE" ||
// 		!doc.fills?.length ||
// 		doc.fills?.length > 1 ||
// 		doc.fills.find(
// 			(fill) => fill.blendMode !== "NORMAL" || fill.type !== "SOLID"
// 		)
// 	) {
// 		console.error(`The color "${doc.name}" could not be retrieved`);
// 		return;
// 	}

// 	const c = doc.fills[0]?.color;
// 	const hex = rgbToHex(c.r * 256, c.g * 256, c.b * 256);
// 	return { hex, name: doc.name };
// }

// // Get color hex and color name from node
// export function getColorFromNodePalette(node: any): Color {
// 	const doc: Node<"RECTANGLE"> = node.document as any;

// 	// Test correct color type
// 	if (
// 		doc.type !== "RECTANGLE" ||
// 		!doc.fills?.length ||
// 		doc.fills?.length > 1 ||
// 		doc.fills.find(
// 			(fill) => fill.blendMode !== "NORMAL" || fill.type !== "SOLID"
// 		)
// 	) {
// 		console.error(`The color "${doc.name}" could not be retrieved`);
// 		return;
// 	}

// 	const c = doc.fills[0]?.color;
// 	const hex = rgbToHex(c.r * 256, c.g * 256, c.b * 256);

// 	//Test name format
// 	const names = doc.name.split("/");
// 	if (
// 		names.length > 2 ||
// 		Number.isNaN(parseInt(names[1])) ||
// 		Object.values(ColorPalette).includes(parseInt(names[1]))
// 	) {
// 		console.error(
// 			`The color "${doc.name}" has not a correct format. (see palette format)`
// 		);
// 		return;
// 	}

// 	return { hex, name: names[0], type: parseInt(names[1]) };
// }

// // Get colors with default template
// export async function generateColorsDefault(
// 	instance: any,
// 	env: ENV,
// 	colors_id: string[]
// ) {
// 	try {
// 		const colors = {};

// 		// Get nodes from api
// 		const {
// 			data: { nodes },
// 		}: { data: GetFileNodesResult } = await instance.get(
// 			`/files/${env.FileKey}/nodes?ids=${colors_id.join(",")}`
// 		);

// 		// Add colors to container
// 		Object.values(nodes).forEach((node) => {
// 			const { hex, name } = getColorFromNode(node);
// 			const names = name
// 				.split("/")
// 				.map((n) => (isNaN(parseInt(n)) ? n : `T${n}`));
// 			colorDefaultRecursively(colors, names, hex);
// 		});

// 		// Create colors file
// 		await fs.writeFile(
// 			`${env.OutPath}/colors.ts`,
// 			formatColorsToTSFile(colors)
// 		);
// 		console.log("colors.ts created successfully !");
// 	} catch (err) {
// 		console.error(err);
// 		process.exit(1);
// 	}
// }

// // Get colors with palette template
// export async function generateColorsPalette(
// 	instance: any,
// 	env: ENV,
// 	colors_id: string[]
// ) {
// 	try {
// 		const colors = {};

// 		// Get nodes from api
// 		const {
// 			data: { nodes },
// 		}: { data: GetFileNodesResult } = await instance.get(
// 			`/files/${env.FileKey}/nodes?ids=${colors_id.join(",")}`
// 		);

// 		// Add colors to container
// 		Object.values(nodes).forEach((node) => {
// 			const { hex, name } = getColorFromNode(node);
// 		});

// 		// Create colors file
// 		await fs.writeFile(
// 			`${env.OutPath}/colors.ts`,
// 			formatColorsToTSFile(colors)
// 		);
// 		console.log("colors.ts created successfully !");
// 	} catch (err) {
// 		console.error(err);
// 		process.exit(1);
// 	}
// }

// export function rgbToHex(r: number, g: number, b: number): string {
// 	const color =
// 		"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

// 	if (color.length > 7) {
// 		return color.slice(0, 7);
// 	}
// 	return color;
// }

// export function colorDefaultRecursively(
// 	container: any,
// 	values: string[],
// 	color: string
// ) {
// 	if (values?.length === 1) {
// 		if (container[values[0]]) {
// 			container[values[0]].value = color;
// 		} else {
// 			container[values[0]] = { value: color };
// 		}
// 	} else {
// 		let name = values.shift();

// 		if (!container[name]) container[name] = {};
// 		colorDefaultRecursively(container[name], values, color);
// 	}
// }

// export function formatColorsToTSFile(colors: any): string {
// 	return `export interface Colors ${JSON.stringify(colors, null, 4)}

// const COLORS: Colors = ${JSON.stringify(colors, null, 4)}

// export default COLORS;
// 	`;
// }

// export type Color = string;

// interface ColorPallet {
// 	T50: Color;
// 	T100: Color;
// 	T200: Color;
// 	T300: Color;
// 	T400: Color;
// 	T500: Color;
// 	T600: Color;
// 	T700: Color;
// }

// interface Colors {
// 	WHITE: Color;
// 	GRAY: ColorPallet;
// 	PURPLE: ColorPallet;
// 	BLACK: ColorPallet;
// 	RED: ColorPallet;
// 	BLUE: ColorPallet;
// 	GREEN: ColorPallet;
// 	ORANGE: ColorPallet;
// 	BROWN: ColorPallet;
// 	IRIS: ColorPallet;
// }

// const COLORS: Colors = {
// 	WHITE: "#FFFFFF",
// 	GRAY: {
// 		T50: "#FAFAFA",
// 		T100: "#F5F5F5",
// 		T200: "#EEEEEE",
// 		T300: "#E0E0E0",
// 		T400: "#BDBDBD",
// 		T500: "#9E9E9E",
// 		T600: "#616161",
// 		T700: "#424242",
// 	},
// 	PURPLE: {
// 		T50: "#EDE7F6",
// 		T100: "#D1C4E9",
// 		T200: "#B39DDB",
// 		T300: "#9575CD",
// 		T400: "#7E57C2",
// 		T500: "#673AB7",
// 		T600: "#512DA8",
// 		T700: "#311B92",
// 	},
// 	BLACK: {
// 		T50: "#E5E5E5",
// 		T100: "#D5D5D5",
// 		T200: "#ABABAB",
// 		T300: "#818080",
// 		T400: "#575656",
// 		T500: "#2D2C2C",
// 		T600: "#242323",
// 		T700: "#1B1A1A",
// 	},
// 	RED: {
// 		T50: "#FFEBEE",
// 		T100: "#FFCDD2",
// 		T200: "#EF9A9A",
// 		T300: "#E57373",
// 		T400: "#EF5350",
// 		T500: "#F44336",
// 		T600: "#D32F2F",
// 		T700: "#B71C1C",
// 	},
// 	BLUE: {
// 		T50: "#E3F2FD",
// 		T100: "#BBDEFB",
// 		T200: "#90CAF9",
// 		T300: "#64B5F6",
// 		T400: "#42A5F5",
// 		T500: "#2196F3",
// 		T600: "#1976D2",
// 		T700: "#0D47A1",
// 	},
// 	GREEN: {
// 		T50: "#E8F5E9",
// 		T100: "#C8E6C9",
// 		T200: "#A5D6A7",
// 		T300: "#81C784",
// 		T400: "#66BB6A",
// 		T500: "#4CAF50",
// 		T600: "#388E3C",
// 		T700: "#1B5E20",
// 	},
// 	ORANGE: {
// 		T50: "#FFF3E0",
// 		T100: "#FFE0B2",
// 		T200: "#FFCC80",
// 		T300: "#FFB74D",
// 		T400: "#FFA726",
// 		T500: "#FF9800",
// 		T600: "#F57C00",
// 		T700: "#E65100",
// 	},
// 	BROWN: {
// 		T50: "#EFEBE9",
// 		T100: "#D7CCC8",
// 		T200: "#BCAAA4",
// 		T300: "#A1887F",
// 		T400: "#8D6E63",
// 		T500: "#795548",
// 		T600: "#5D4037",
// 		T700: "#3E2723",
// 	},
// 	IRIS: {
// 		T50: "#EBEBFD",
// 		T100: "#DDDEFC",
// 		T200: "#BCBCF8",
// 		T300: "#9FA1F5",
// 		T400: "#8C8DF3",
// 		T500: "#7879F1",
// 		T600: "#5A5BB5",
// 		T700: "#3C3D79",
// 	},
// };

// export default COLORS;
