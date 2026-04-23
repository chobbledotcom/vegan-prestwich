export default {
	layout: "design-system-base.html",
	tags: ["categories"],
	permalink: "/tags/{{ page.fileSlug }}/index.html",
	eleventyComputed: {
		blocks: (data) => {
			const {
				title,
				subtitle,
				chain_intro,
				non_chain_intro,
				page,
				collections = {},
			} = data;

			const slug = page?.fileSlug;
			const allProducts = collections.products ?? [];
			const matches = allProducts.filter((p) =>
				(p.data.categories ?? []).includes(slug),
			);

			const chains = matches.filter((p) => p.data.is_chain);
			const independents = matches.filter((p) => !p.data.is_chain);

			const toPaths = (items) => items.map((i) => i.inputPath);

			const blocks = [
				{ type: "hero", title, lead: subtitle },
				{ type: "content" },
			];

			if (independents.length) {
				if (non_chain_intro && chains.length) {
					blocks.push({
						type: "section-header",
						intro: `## ${non_chain_intro}`,
					});
				}
				blocks.push({ type: "items-array", items: toPaths(independents) });
			}

			if (chains.length) {
				if (chain_intro) {
					blocks.push({
						type: "section-header",
						intro: `## ${chain_intro}`,
					});
				}
				blocks.push({ type: "items-array", items: toPaths(chains) });
			}

			return blocks;
		},
	},
};
