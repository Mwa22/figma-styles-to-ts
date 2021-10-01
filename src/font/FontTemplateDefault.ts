import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import FontTemplate from "./FontTemplate";

class FontTemplateDefault extends FontTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	generate() {
		return super._generate();
	}
}

export default FontTemplateDefault;
