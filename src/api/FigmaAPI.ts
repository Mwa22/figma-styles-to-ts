import {
	GetFileNodesResult,
	GetFileResult,
	GetFileStylesResult,
	GetImageResult,
	StyleMetadata,
} from "../types/api";
import axios, { AxiosInstance } from "axios";
import Config from "../config/Config";
import { Node } from "../types/ast";

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
				({ data }: { data: GetFileStylesResult }) => data?.meta?.styles
			);
	}

	getNodes(node_ids: string[]) {
		return this._instance
			.get(
				`/files/${this._config.fileKey}/nodes?ids=${node_ids.join(",")}`
			)
			.then(({ data }: { data: GetFileNodesResult }) => data?.nodes);
	}

	getImagesByNodeIds(node_ids: string[]) {
		return this._instance
			.get(
				`/images/${this._config.fileKey}?ids=${node_ids.join(
					","
				)}&format=svg`
			)
			.then(({ data }: { data: GetImageResult }) => {
				const promises = Object.entries(data?.images).map(
					async ([id, url]) => {
						try {
							const r = await axios.get(url);
							return { id: id, svg: r.data as string };
						} catch (err) {
							console.error(
								`Couldn't fetch Icon (${url}): ${err.message}`
							);
						}
					}
				);

				return Promise.all(promises);
			});
	}

	getPageByName(name: string): Promise<Node<"CANVAS"> | undefined> {
		return this._instance
			.get(`/files/${this._config.fileKey}`)
			.then(
				({ data }: { data: GetFileResult }) =>
					data?.document?.children.find(
						(page) => page.name === name
					) as Node<"CANVAS">
			);
	}

	getFirstPage(): Promise<Node<"CANVAS"> | undefined> {
		return this._instance
			.get(`/files/${this._config.fileKey}`)
			.then(({ data }: { data: GetFileResult }) =>
				data?.document?.children?.length
					? (data.document.children[0] as Node<"CANVAS">)
					: undefined
			);
	}
}

export default FigmaAPI;
