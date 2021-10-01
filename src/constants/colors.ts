export type Color = string;

export interface ColorPalette {
	T100: Color;
	T200: Color;
	T300: Color;
	T400: Color;
	T500: Color;
	T600: Color;
	T700: Color;
}
        
export interface Colors {
	Red: ColorPalette;
	Iris: ColorPalette;
	Blue: ColorPalette;
	Green: ColorPalette;
	Brown: ColorPalette;
	Purple: ColorPalette;
	Orange: ColorPalette;
	Gray: ColorPalette;
	Black: ColorPalette;
	White: Color;
}

const COLORS: Colors = {
	Red: {
		T100: "#00cdd2",
		T200: "#ef9a9a",
		T300: "#e57373",
		T400: "#ef5350",
		T500: "#f44336",
		T600: "#d32f2f",
		T700: "#b71c1c",
	},
	Iris: {
		T100: "#dddefc",
		T200: "#bcbcf8",
		T300: "#9fa1f5",
		T400: "#8c8df3",
		T500: "#7879f1",
		T600: "#5a5bb5",
		T700: "#3c3d79",
	},
	Blue: {
		T100: "#bbdefb",
		T200: "#90caf9",
		T300: "#64b5f6",
		T400: "#42a5f5",
		T500: "#2196f3",
		T600: "#1976d2",
		T700: "#0d47a1",
	},
	Green: {
		T100: "#c8e6c9",
		T200: "#a5d6a7",
		T300: "#81c784",
		T400: "#66bb6a",
		T500: "#4caf50",
		T600: "#388e3c",
		T700: "#1b5e20",
	},
	Brown: {
		T100: "#d7ccc8",
		T200: "#bcaaa4",
		T300: "#a1887f",
		T400: "#8d6e63",
		T500: "#795548",
		T600: "#5d4037",
		T700: "#3e2723",
	},
	Purple: {
		T100: "#d1c4e9",
		T200: "#b39ddb",
		T300: "#9575cd",
		T400: "#7e57c2",
		T500: "#673ab7",
		T600: "#512da8",
		T700: "#311b92",
	},
	Orange: {
		T100: "#00e0b2",
		T200: "#00cc80",
		T300: "#00b74d",
		T400: "#00a726",
		T500: "#009800",
		T600: "#f57c00",
		T700: "#e65100",
	},
	Gray: {
		T100: "#f5f5f5",
		T200: "#eeeeee",
		T300: "#e0e0e0",
		T400: "#bdbdbd",
		T500: "#9e9e9e",
		T600: "#616161",
		T700: "#424242",
	},
	Black: {
		T100: "#d5d5d5",
		T200: "#ababab",
		T300: "#818080",
		T400: "#575656",
		T500: "#2d2c2c",
		T600: "#242323",
		T700: "#1b1a1a",
	},
	White: "#010100",
};
        
export default COLORS;
        