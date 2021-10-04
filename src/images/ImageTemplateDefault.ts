import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import ImageTemplate from "./ImageTemplate";

class ImageTemplateDefault extends ImageTemplate {
	constructor(config: Config, api: FigmaAPI) {
		super(config, api);
	}

	init() {
		return super.init();
	}

	generate() {
		return this._generateFiles();
	}
}

export default ImageTemplateDefault;
