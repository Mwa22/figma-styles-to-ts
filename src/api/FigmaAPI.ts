import {
	GetFileNodesResult,
	GetFileStylesResult,
	StyleMetadata,
} from "../types/api";
import axios, { AxiosInstance } from "axios";
import Config from "../config/Config";

class FigmaAPI {
	_instance: AxiosInstance;
	_config: Config;

	constructor(config: Config) {
		this._config = config;

		// Get axios instance to fetch data from api
		this._instance = axios.create({
			baseURL: "https://api.figma.com/v1",
			headers: {
				common: {
					"X-Figma-Token": config.personalToken,
				},
			},
		});
	}

	getStylesByFileKey(): Promise<StyleMetadata[]> {
		return this._instance
			.get(`/files/${this._config.fileKey}/styles`)
			.then(
				({ data }: { data: GetFileStylesResult }) => data.meta.styles
			);
	}

	getNodesColor(colors_id: string[]) {
		return this._instance
			.get(
				`/files/${this._config.fileKey}/nodes?ids=${colors_id.join(
					","
				)}`
			)
			.then(({ data }: { data: GetFileNodesResult }) => data.nodes);
	}
}

export default FigmaAPI;
