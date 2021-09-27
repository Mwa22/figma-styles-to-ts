export function rgbToHex(r: number, g: number, b: number): string {
	const color =
		"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

	if (color.length > 7) {
		return color.slice(0, 7);
	}
	return color;
}

export function colorNameRecursively(
	container: any,
	values: string[],
	color: string
) {
	if (values?.length === 1) {
		container[values[0]] = color;
	} else {
		let name = values.shift();

		if (!container[name] || typeof container[name] === "string")
			container[name] = {};
		colorNameRecursively(container[name], values, color);
	}
}

export function formatColorsToTSFile(colors: any): string {
	return `export interface Colors ${JSON.stringify(colors, null, 4)}

const COLORS: Colors = ${JSON.stringify(colors, null, 4)}

export default COLORS;
	`;
}
