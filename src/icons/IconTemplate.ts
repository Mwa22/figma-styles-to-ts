import FigmaAPI from "../api/FigmaAPI";
import Config from "../config/Config";
import { ImageType, Node } from "../types/ast";
import * as fs from "fs";

export enum IconTemplateEnum {
	default = "default",
	react = "react",
}

export interface Icon {
	id: string;
	name: string;
	svg?: string;
}

class IconTemplate {
	_config: Config;
	_api: FigmaAPI;
	_icons: Icon[];

	constructor(config: Config, api: FigmaAPI) {
		this._api = api;
		this._config = config;
	}

	init() {
		return this._getIconImages();
	}

	_normalizeIconName(name: string): string {
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
			if (node.type === "COMPONENT") {
				ids[node.id] = this._normalizeIconName(node.name);
			} else {
				this._searchRecursively(ids, node);
			}
		});
	}

	async _getIconIds(): Promise<Icon[]> {
		// Get page from api
		const pageName = this._config.icon.page;
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
				(doc) => doc.name === this._config.icon.container
			) as Node<"FRAME">) ?? page;

		if (!container) {
			throw new Error(
				`The container (${this._config.icon.container}) couldn't be found !\n`
			);
		}

		// Get all node ids
		let icon_ids: any = {};
		this._searchRecursively(icon_ids, container);
		icon_ids = Object.entries(icon_ids).map(([id, name]) => {
			return { id, name };
		}) as Icon[];

		if (!icon_ids || !icon_ids.length) {
			throw new Error("Couldn't get any icons from api.\n");
		}
		return icon_ids;
	}

	async _getIconImages() {
		const icon_ids = await this._getIconIds();
		const images = await this._api.getImagesByNodeIds(
			icon_ids.map((icon) => icon.id),
			ImageType.SVG
		);
		this._icons = icon_ids.map((icon) => {
			const image = images.find((i) => i.id === icon.id);
			icon.svg = image.image;
			return icon;
		});
	}

	async _generateFiles(format: (name: string, svg: string) => string) {
		if (!this._icons) {
			throw new Error("No icons fetched from api.\n");
		}

		// Generate all icons
		const promises = this._icons.map(async (icon) => {
			try {
				if (!icon.svg) {
					throw new Error(`Icon (${icon.name}) has invalid svg !\n`);
				}

				const fileExt =
					this._config.icon.template === IconTemplateEnum.default
						? "svg"
						: "tsx";

				await fs.promises.writeFile(
					`${this._config.icon.outDir}/${icon.name}.${fileExt}`,
					format(icon.name, icon.svg)
				);

				console.log(`${icon.name}.${fileExt} created successfully !`);
			} catch (err) {
				console.error(err.message);
				return;
			}
		});

		await Promise.all(promises);
	}
}

export default IconTemplate;
