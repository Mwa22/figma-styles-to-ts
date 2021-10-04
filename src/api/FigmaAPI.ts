import {
	GetFileNodesResult,
	GetFileResult,
	GetFileStylesResult,
	GetImageResult,
	StyleMetadata,
} from "../types/api";
import axios, { AxiosInstance } from "axios";
import Config from "../config/Config";
import { ImageType, Node } from "../types/ast";
import { ImageFlat } from "../images/ImageTemplate";

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

	getImagesByNodeIds(
		node_ids: string[],
		format: ImageType
	): Promise<{ id: string; image: string }[]> {
		return this._instance
			.get(
				`/images/${this._config.fileKey}?ids=${node_ids.join(
					","
				)}&format=${format.toLocaleLowerCase()}`
			)
			.then(({ data }: { data: GetImageResult }) => {
				const promises = Object.entries(data?.images).map(
					async ([id, url]) => {
						try {
							const r = await axios.get(url);
							return { id: id, image: r.data as string };
						} catch (err) {
							console.error(
								`Couldn't fetch Image (${url}): ${err.message}`
							);
						}
					}
				);

				return Promise.all(promises);
			});
	}

	getImagesWithExportSettings(
		images: ImageFlat[],
		format: ImageType,
		scale: number
	): Promise<ImageFlat[]> {
		return this._instance
			.get(
				`/images/${this._config.fileKey}?ids=${images
					.map((i) => i.id)
					.join(
						","
					)}&format=${format.toLocaleLowerCase()}&scale=${scale}`
			)
			.then(({ data }: { data: GetImageResult }) => {
				const promises = Object.entries(data?.images).map(
					async ([id, url]) => {
						try {
							const r = await axios.get(url, {
								responseType: "stream",
							});
							const image = images.find((i) => i.id === id);
							image.data = r.data;
							return image;
						} catch (err) {
							console.error(
								`Couldn't fetch Image (${url}): ${err.message}`
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
