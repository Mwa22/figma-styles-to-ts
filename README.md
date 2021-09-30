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

## Configuration

Create a figma.config.json file at the root of your project.

```sh
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

| Config              | Summary                                                                                                                                      |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `fileKey`           | The file key of your figma file. ex: https://www.figma.com/file/<file_key_here>/Name?node-id=11:09                                           |
| `color -> disable`  | Disable Color generator (true or false)                                                                                                      |
| `color -> outDir`   | The directory to store the code generated (a colors.ts file will be generated in this folder)                                                |
| `color -> template` | Use default template or palette template (see [Templates](#templates)) ('default' or 'palette')                                              |
| `color -> base`     | Generate all colors from base path. ex: All my colors are as CompanyName/Black/100. Use base: "CompanyName" to get all colors of CompanyName |
| `icon -> disable`   | Disable Icon generator (true or false)                                                                                                       |
| `icon -> outDir`    | The directory to store the code generated.                                                                                                   |
| `icon -> template`  | Use default template or react template (see [Templates](#templates)) ('default' or 'react')                                                  |
| `icon -> storybook` | Generate a index.stories.tsx file (only with react template)                                                                                 |
| `icon -> page`      | The page name of your icons                                                                                                                  |
| `icon -> container` | The container name in the page of your icons (/!\ all your icons must have a unique name and must be a component)                            |

## <a name="templates"></a>Templates

## Usage

First of all, you need to give your personal figma token (you can do this once, the token will be registered). It will save your personal token in / node_modules and generate the styles.

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
