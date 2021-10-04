<h1 align="center">Welcome to figma-styles-to-ts 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/figma-styles-to-ts" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/figma-styles-to-ts.svg">
  </a>
  <a href="https://github.com/Mwa22/figma-styles-to-ts#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/Mwa22/figma-styles-to-ts/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/Mwa22/figma-styles-to-ts/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Mwa22/figma-styles-to-ts" />
  </a>
</p>

> Generate styles in typescript files and icon components from figma.

### 🏠 [Homepage](https://github.com/Mwa22/figma-styles-to-ts#readme)

## Install

```sh
npm install -D figma-styles-to-ts
```

## Usage

First of all, you need to give your `personal figma token` (you can do this once, the token will be registered). It will save your personal token in /node_modules and generate the styles.

```sh
figma-styles-to-ts --token="your_token"
```

Next time you just have to use this:

```sh
figma-styles-to-ts
```

To reset your token:

```sh
figma-styles-reset && figma-styles-to-ts --token="your_new_token"
```

## Configuration

Create a figma.config.json file at the root of your project.

```json
{
	"fileKey": "your_file_key",
	"color": {
		"enable": false,
		"outDir": "color_out_dir",
		"template": "default",
		"base": ""
	},
	"font": {
		"enable": false,
		"outDir": "font_out_dir",
		"template": "default",
		"base": ""
	},
	"shadow": {
		"enable": false,
		"outDir": "shadow_out_dir",
		"template": "default",
		"base": ""
	},
	"icon": {
		"enable": false,
		"outDir": "icon_out_dir",
		"template": "default",
		"storybook": false,
		"page": "the_page",
		"container": "the_icons_container"
	},
	"image": {
		"enable": false,
		"outDir": "image_out_dir",
		"page": "the_page",
		"container": "the_images_container"
	}
}
```

### Required

| Config    | Summary                                                                                            |
| :-------- | :------------------------------------------------------------------------------------------------- |
| `fileKey` | The file key of your figma file. ex: https://www.figma.com/file/<file_key_here>/Name?node-id=11:09 |

### Color

⚠️ To generate Colors, you need to publish your styles in figma. ⚠️
⚠️ Only colors that have `one value` with a `normal blend mode` will be generated.

| Config                          | Summary                                                                                                                                       |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable` (default: `false`)     | Enable Color generator (`true` or `false`).                                                                                                   |
| `outDir`                        | The directory to store the code generated (a colors.ts file will be generated in this folder).                                                |
| `template` (default: `default`) | Use `default` template or `palette` template (see [Templates](#color_templates)) (`'default'` or `'palette'`).                                |
| `base` (default: `all colors`)  | Generate all colors from base path. ex: All my colors are as CompanyName/Black/100. Use base: "CompanyName" to get all colors of CompanyName. |

#### <a name="color_templates"></a>Templates

The `default` template will generate a COLORS constant with all colors recursively.
Example:

```ts
const COLORS = {
  CompanyName: {
    Black: {
      dark: { value: "#000000" }
      light: { value: "#131231" }
    },
    White: {
      value: "#FFFFFF"
    }
  },
  CustomColor: {
    value: "#452398"
  }
}
```

The `palette` template will generate a COLORS constant with colors that matches the palette format.
You must name your colors as Color/100, Color/200, ..., Color/700 (only colors from 100 to 700 will be generated).
Example:

```ts
const COLORS = {
	Black: {
		T100: "#000001",
		T200: "#000002",
		T300: "#000003",
		T400: "#000004",
		T500: "#000005",
		T600: "#000006",
		T700: "#000007",
	},
};
```

### Font

⚠️ To generate Fonts, you need to publish your styles in figma. ⚠️

| Config                          | Summary                                                                                                                                  |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `enable` (default: `false`)     | Enable Font generator (`true` or `false`).                                                                                               |
| `outDir`                        | The directory to store the code generated (a fonts.ts file will be generated in this folder).                                            |
| `template` (default: `default`) | Use `default`, `react` or `chakra` template (see [Templates](#font_templates)) (`'default'`, `'reat'` or `'chakra'`).                    |
| `base` (default: `all fonts`)   | Generate all fonts from base path. ex: All my fonts are as CompanyName/P1/Bold. Use base: "CompanyName" to get all fonts of CompanyName. |

#### <a name="font_templates"></a>Templates

The `default` template will generate a FONTS constant with all fonts recursively.
Example:

```ts
const FONTS: Fonts = {
	Bold: {
		value: {
			fontFamily: "Ubuntu",
			fontWeight: 700,
			fontSize: 12,
			letterSpacing: 0,
			lineHeight: "14.0625px",
		},
	},
	Medium: {
		value: {
			fontFamily: "Ubuntu",
			fontWeight: 500,
			fontSize: 12,
			letterSpacing: 0,
			lineHeight: "14.0625px",
		},
	},
};
```

The `react` template will generate the fonts.ts file from default template and will generate a Text component.
Example:

```ts
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
```

The `chakra` template will generate the fonts.ts file from default template and will generate a Paragraph component.
Example:

```tsx
const Paragraph = ({ children, font, color, ...rest }: ParagraphProps) => {
	return (
		<Text
			color={color}
			fontFamily={font?.fontFamily}
			fontSize={font?.fontSize}
			fontWeight={font?.fontWeight}
			lineHeight={font?.lineHeight}
			letterSpacing={font?.letterSpacing}
			{...rest}
		>
			{children}
		</Text>
	);
};
```

### Shadow

⚠️ To generate Shadows, you need to publish your styles in figma. ⚠️
⚠️ Only `drop shadows` with a `normal blend mode` will be generated.

| Config                          | Summary                                                                                                                                           |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enable` (default: `false`)     | Enable Shadow generator (`true` or `false`).                                                                                                      |
| `outDir`                        | The directory to store the code generated (a shadows.ts file will be generated in this folder).                                                   |
| `template` (default: `default`) | Use `default` template or `palette` template (see [Templates](#shadow_templates)) (`'default'` or `'palette'`).                                   |
| `base` (default: `all shadows`) | Generate all shadows from base path. ex: All my shadows are as CompanyName/Bottom/100. Use base: "CompanyName" to get all shadows of CompanyName. |

#### <a name="shadow_templates"></a>Templates

The `default` template will generate a SHADOWS constant with all shadows recursively.
Example:

```ts
const SHADOWS = {
  CompanyName: {
    Bottom: {
      dark: { value: "0px 0.5px 2px rgba(96, 97, 112, 0.16)" }
      light: { value: "0px 2px 4px rgba(40, 41, 61, 0.04)" }
    },
    Top: {
      value: "0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04)"
    }
  },
  CustomShadow: {
    value: "0px 26px 34px rgba(96, 97, 112, 0.06)"
  }
}
```

The `palette` template will generate a SHADOWS constant with shadows that matches the palette format.
You must name your shadows as Shadow/100, Shadow/200, ..., Color/500 (only shadows from 100 to 500 will be generated).
Example:

```ts
const SHADOWS = {
	Bottom: {
		T100: "0px 0.5px 2px rgba(96, 97, 112, 0.16)",
		T200: "0px 2px 4px rgba(96, 97, 112, 0.16)",
		T300: "0px 2px 4px rgba(96, 97, 112, 0.16)",
		T400: "0px 8px 16px rgba(96, 97, 112, 0.16)",
		T500: "0px 26px 34px rgba(96, 97, 112, 0.06)",
	},
};
```

### Icon

| Config                                              | Summary                                                                                                           |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `enable` (default: `false`)                         | Enable Icon generator (`true` or `false`).                                                                        |
| `outDir`                                            | The directory to store the code generated.                                                                        |
| `template` (default: `default`)                     | Use `default` template or `react` template (see [Templates](#icon_templates)) (`'default'` or `'react'`).         |
| `storybook` (default: `false`)                      | Generate a index.stories.tsx file (⚠️ only with react template) (`true`or `false`)                                |
| `page` (default: `the first page`)                  | The page name of your icons.                                                                                      |
| `container` (default: `all components in the page`) | The container name in the page of your icons (⚠️ all your icons must have a unique name and must be a component). |

#### <a name="icon_templates"></a>Templates

The `default` template will generate svg files.
Example:

```svg
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 1L1 11M1 1L11 11" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

The `react` template will generate tsx files with React Component.
Example:

```tsx
const Cross = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			width={props.width}
			height={props.height}
		>
			<path
				d="M11.2174 0.782609L0.782609 11.2174M0.782609 0.782609L11.2174 11.2174"
				stroke={props.fill}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
export default Cross;

Use: <Cross height={20} width={20} fill="#000000" />;
```

### Image

⚠️ Only images with a `fill scale mode`, with a `normal blend mode` and with `export settings` will be generated.
⚠️ `PDF format` not supported.

| Config                                          | Summary                                                                                     |
| :---------------------------------------------- | :------------------------------------------------------------------------------------------ |
| `enable` (default: `false`)                     | Enable Image generator (`true` or `false`).                                                 |
| `outDir`                                        | The directory to store the images generated.                                                |
| `page` (default: `the first page`)              | The page name of your images.                                                               |
| `container` (default: `all images in the page`) | The container name in the page of your images (⚠️ all your images must have a unique name). |

## Author

👤 **Thomas Michel**

-   Github: [@Mwa22](https://github.com/Mwa22)
-   LinkedIn: [@ThomasMichel](https://linkedin.com/in/thomasmichel22)
-   Email: thomas.michel@live.be

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Mwa22/figma-styles-to-ts/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Thomas Michel](https://github.com/Mwa22).<br />
This project is [MIT](https://github.com/Mwa22/figma-styles-to-ts/blob/master/LICENSE) licensed.
