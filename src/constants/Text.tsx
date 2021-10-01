import { Font } from "./fonts";

export interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
	font?: Font;
	color?: string;
	children?: React.ReactNode | React.ReactNode[] | string | number;
}
		
const Text = ({ children, font, color, ...rest }: TextProps) => {
	return (
		<p
			style={{
				color: color,
				fontSize: font?.fontSize,
				fontFamily: font?.fontFamily,
				fontWeight: font?.fontWeight,
				lineHeight: font?.lineHeight,
				letterSpacing: font?.letterSpacing,
			}}
			{...rest}
		>
		{children}
		</p>
	);
};
		
export default Text;
