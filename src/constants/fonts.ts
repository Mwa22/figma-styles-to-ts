export interface Font {
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    letterSpacing: number;
    lineHeight: number;
}

export interface Fonts {
    Bold: {
        value: Font
    },
    Medium: {
        value: Font
    },
    Light: {
        value: Font
    },
    Regular: {
        value: Font
    }
}

const FONTS: Fonts = {
    Bold: {
        value: {
            fontFamily: "Ubuntu",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0,
            lineHeight: 14.0625
        }
    },
    Medium: {
        value: {
            fontFamily: "Ubuntu",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: 0,
            lineHeight: 14.0625
        }
    },
    Light: {
        value: {
            fontFamily: "Ubuntu",
            fontWeight: 300,
            fontSize: 12,
            letterSpacing: 0,
            lineHeight: 14.0625
        }
    },
    Regular: {
        value: {
            fontFamily: "Ubuntu",
            fontWeight: 400,
            fontSize: 12,
            letterSpacing: 0,
            lineHeight: 14.0625
        }
    }
}
        
export default FONTS;
