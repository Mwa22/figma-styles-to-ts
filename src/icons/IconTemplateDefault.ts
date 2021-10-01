import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import IconTemplate from "./IconTemplate";

class IconTemplateDefault extends IconTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	generate() {
		return this._generateFiles((_, svg) => svg);
	}
}

export default IconTemplateDefault;
