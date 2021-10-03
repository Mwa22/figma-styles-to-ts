import * as nconf from "nconf";
import * as fs from "fs";
import ColorConfig from "./ColorConfig";
import IconConfig from "./IconConfig";
import FontConfig from "./FontConfig";
import ShadowConfig from "./ShadowConfig";

class Config {
	personalToken: string;
	fileKey: string;
	color: ColorConfig;
	font: FontConfig;
	shadow: ShadowConfig;
	icon: IconConfig;

	constructor() {
		nconf.argv().file("./figma.config.json");

		this._getPersonalToken();
		this._getFileKey();
		this.color = new ColorConfig();
		this.font = new FontConfig();
		this.shadow = new ShadowConfig();
		this.icon = new IconConfig();
	}

	async _getPersonalToken() {
		const token_file = `${process.cwd()}/node_modules/figma-styles-to-ts/token.json`;
		nconf.file("token", token_file);
		this.personalToken = nconf.get("token");

		// Check personal token
		if (!this.personalToken || !this.personalToken.length) {
			console.error(
				"Please use command: figma-styles-to-ts --token=your_token, in argument and re-run\n"
			);
			process.exit(1);
		}

		// Create token file
		if (!fs.existsSync(token_file)) {
			try {
				await fs.promises.writeFile(
					token_file,
					JSON.stringify({ token: this.personalToken })
				);
				console.log(
					"Token config file created ! To reset the token use: figma-styles-reset\n"
				);
			} catch (err) {
				console.error(
					`Couldn't create the token config file: ${err.message}\n`
				);
			}
		}
	}

	_getFileKey() {
		this.fileKey = nconf.get("fileKey");

		// Check file key
		if (!this.fileKey || !this.fileKey.length) {
			console.error(
				"Please pass: fileKey: 'your_file_key' in figma.config.json and re-run\n"
			);
			process.exit(1);
		}
	}
}

export default Config;
