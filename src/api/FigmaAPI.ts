import {
	GetFileNodesResult,
	GetFileStylesResult,
	StyleMetadata,
} from "../types/api";
import axios, { AxiosInstance } from "axios";
import { ENV } from "../utils/env";

class FigmaAPI {
	_instance: AxiosInstance;
	_env: ENV;

	constructor(env: ENV) {
		this._env = env;

		// Get axios instance to fetch data from api
		this._instance = axios.create({
			baseURL: "https://api.figma.com/v1",
			headers: {
				common: {
					"X-Figma-Token": env.PersonalToken,
				},
			},
		});
	}

	async getStylesByFileKey(): Promise<StyleMetadata[]> {
		const {
			data: {
				meta: { styles },
			},
		}: { data: GetFileStylesResult } = await this._instance.get(
			`/files/${this._env.FileKey}/styles`
		);

		return styles;
	}

	async getNodesColor(colors_id: string[]) {
		const {
			data: { nodes },
		}: { data: GetFileNodesResult } = await this._instance.get(
			`/files/${this._env.FileKey}/nodes?ids=${colors_id.join(",")}`
		);
		return nodes;
	}
}

export default FigmaAPI;
