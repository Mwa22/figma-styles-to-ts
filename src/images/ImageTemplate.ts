import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import {
	BlendMode,
	ConstrainType,
	ImageType,
	Node,
	PaintSolidScaleMode,
	PaintType,
} from "../types/ast";
import * as fs from "fs";

export interface Image {
	id: string;
	name: string;
	export: ImageExport[];
}

export interface ImageExport {
	format: ImageType;
	suffix: string;
	scale: number;
}

export interface ImageFlat {
	id: string;
	name: string;
	format: ImageType;
	suffix: string;
	scale: number;
	data?: fs.ReadStream;
}

class ImageTemplate {
	_config: Config;
	_api: FigmaAPI;
	_images: ImageFlat[];

	constructor(config: Config, api: FigmaAPI) {
		this._api = api;
		this._config = config;
	}

	init() {
		return this._getImages();
	}

	_normalizeImageName(name: string): string {
		name = name.trim();
		const regex = /(-|\/|\s)/g;
		if (regex.test(name)) {
			name = name.toLocaleLowerCase();
			name = name
				.split(regex)
				.map((word) =>
					regex.test(word)
						? ""
						: word[0].toUpperCase() + word.slice(1, word.length)
				)
				.join("");
		} else {
			name = name[0].toUpperCase() + name.slice(1, name.length);
		}
		return name;
	}

	_searchRecursively(ids: any, container: any) {
		container?.children?.forEach((node: Node) => {
			if (
				node.type === "RECTANGLE" &&
				(node as Node<"RECTANGLE">).fills?.length &&
				(node as Node<"RECTANGLE">).fills[0].type === PaintType.IMAGE &&
				(node as Node<"RECTANGLE">).fills[0].blendMode ===
					BlendMode.NORMAL &&
				(node as Node<"RECTANGLE">).fills[0].scaleMode ===
					PaintSolidScaleMode.FILL &&
				(node as Node<"RECTANGLE">).exportSettings?.length
			) {
				node = node as Node<"RECTANGLE">;

				ids[node.id] = {
					name: this._normalizeImageName(node.name),
					export: node.exportSettings.map((e) => {
						const scale =
							e.constraint.type === ConstrainType.SCALE
								? e.constraint.value
								: 1;
						return {
							suffix: e.suffix,
							format: e.format,
							scale: scale,
						};
					}),
				};
			} else {
				this._searchRecursively(ids, node);
			}
		});
	}

	async _getImageIds(): Promise<Image[]> {
		// Get page from api
		const pageName = this._config.image.page;
		const page =
			pageName === ""
				? await this._api.getFirstPage()
				: await this._api.getPageByName(pageName);

		if (!page) {
			throw new Error("No page could be found !\n");
		}

		// Get container
		const container: Node<"FRAME"> | Node<"CANVAS"> =
			(page.children.find(
				(doc) => doc.name === this._config.image.container
			) as Node<"FRAME">) ?? page;

		if (!container) {
			throw new Error(
				`The container (${this._config.image.container}) couldn't be found !\n`
			);
		}

		// Get all node ids
		let ids: any = {};
		this._searchRecursively(ids, container);
		ids = Object.entries(ids).map(([id, image]: [string, any]) => {
			return { id, name: image.name, export: image.export };
		}) as Image[];

		if (!ids || !ids.length) {
			throw new Error("Couldn't get any images from api.\n");
		}
		return ids;
	}

	async _getImages() {
		const image_ids = await this._getImageIds();

		const image_chunks: { [format_suffix: string]: ImageFlat[] } = {};
		image_ids?.forEach((image) => {
			image.export.forEach((e) => {
				if (!image_chunks[`${e.format}_${e.scale}`]) {
					image_chunks[`${e.format}_${e.scale}`] = [];
				}

				image_chunks[`${e.format}_${e.scale}`].push({
					id: image.id,
					name: image.name,
					suffix: e.suffix,
					format: e.format,
					scale: e.scale,
				} as ImageFlat);
			});
		});

		const promises: Promise<ImageFlat[]>[] = Object.values(
			image_chunks
		).map((images) =>
			this._api.getImagesWithExportSettings(
				images,
				images[0].format,
				images[0].scale
			)
		);

		this._images = (await Promise.all(promises)).flat(1);
	}

	async _generateFiles() {
		if (!this._images) {
			throw new Error("No images fetched from api.\n");
		}

		// Generate all images
		const promises: Promise<void>[] = this._images.map((image) => {
			return new Promise((resolve, reject) => {
				if (!image.data) {
					reject(
						new Error(
							`Couldn't fetch data from Image (${image.name}) !\n`
						)
					);
					return;
				}

				const file_name = `${image.name}${
					image.suffix
				}.${image.format.toLocaleLowerCase()}`;

				image.data
					.pipe(
						fs.createWriteStream(
							`${this._config.image.outDir}/${file_name}`
						)
					)
					.on("finish", () => {
						console.log(`${file_name} created successfully !`);
						resolve();
					})
					.on("error", (e) => {
						console.error(e);
						resolve();
					});
			});
		});

		await Promise.all(promises);
	}
}

export default ImageTemplate;
