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

> Generate typescript files from figma styles.

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
		"disable": false,
		"outDir": "color_out_dir",
		"template": "default",
		"base": ""
	},
	"icon": {
		"disable": false,
		"outDir": "icon_out_dir",
		"template": "default",
		"storybook": false,
		"page": "📚 Components",
		"container": "Icons"
	}
}
```

### Required

| Config    | Summary                                                                                            |
| :-------- | :------------------------------------------------------------------------------------------------- |
| `fileKey` | The file key of your figma file. ex: https://www.figma.com/file/<file_key_here>/Name?node-id=11:09 |

### Color

⚠️ To generate Colors, you need to publish your styles in figma. ⚠️

| Config     | Summary                                                                                                                                       |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `disable`  | Disable Color generator (`true` or `false`).                                                                                                  |
| `outDir`   | The directory to store the code generated (a colors.ts file will be generated in this folder).                                                |
| `template` | Use default `template` or `palette` template (see [Templates](#color_templates)) (`'default'` or `'palette'`).                                |
| `base`     | Generate all colors from base path. ex: All my colors are as CompanyName/Black/100. Use base: "CompanyName" to get all colors of CompanyName. |

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

### Icon

| Config      | Summary                                                                                                           |
| :---------- | :---------------------------------------------------------------------------------------------------------------- |
| `disable`   | Disable Icon generator (`true` or `false`).                                                                       |
| `outDir`    | The directory to store the code generated.                                                                        |
| `template`  | Use `default` template or `react` template (see [Templates](#icon_templates)) (`'default'` or `'react'`).         |
| `storybook` | Generate a index.stories.tsx file (⚠️ only with react template).                                                  |
| `page`      | The page name of your icons.                                                                                      |
| `container` | The container name in the page of your icons (⚠️ all your icons must have a unique name and must be a component). |

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
