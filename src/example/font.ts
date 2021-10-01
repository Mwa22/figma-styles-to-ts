export interface Font {
	fontFamily: string;
	fontWeight: number;
	fontSize: number;
	letterSpacing: number;
	lineHeight: number;
}

export interface Fonts {
	P3: {
		Bold: {
			value: Font;
		};
		Medium: {
			value: Font;
		};
	};
}

const FONTS: Fonts = {
	P3: {
		Bold: {
			value: {
				fontFamily: "",
				fontWeight: 0,
				fontSize: 0,
				letterSpacing: 0,
				lineHeight: 0,
			},
		},
		Medium: {
			value: {
				fontFamily: "",
				fontWeight: 0,
				fontSize: 0,
				letterSpacing: 0,
				lineHeight: 0,
			},
		},
	},
};

export default FONTS;
