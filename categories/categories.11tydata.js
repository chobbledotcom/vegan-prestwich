export default {
	tags: ["categories"],
	permalink: "/tags/{{ page.fileSlug }}/index.html",
	eleventyComputed: {
		blocks: (data) => {
			const {
				name,
				content_markdown,
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

			const heroContent =
				subtitle && subtitle !== name
					? `# ${name}\n\n${subtitle}`
					: `# ${name}`;

			const blocks = [{ type: "hero", content: heroContent }];
			if (content_markdown) {
				blocks.push({ type: "markdown", content: content_markdown });
			}

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
