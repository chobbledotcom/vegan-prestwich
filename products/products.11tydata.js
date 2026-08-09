export default {
	tags: ["products"],
	reviewsField: "products",
	permalink: "/place/{{ page.fileSlug }}/index.html",
	votes: 0,
	filter_attributes: [],
	eleventyComputed: {
		blocks: (data) => {
			const {
				name,
				content_markdown,
				gallery = [],
				specs = [],
				categories = [],
				is_chain,
				omni,
			} = data;

			const badge = is_chain
				? "Chain"
				: omni
					? "Omnivore-friendly"
					: undefined;

			const categoryLinks = categories.map((slug) => ({
				icon: "hugeicons:tag-01",
				text: slug,
				url: `/tags/${slug}/`,
			}));

			return [
				{ type: "hero", content: `# ${name}`, badge },
				gallery.length && {
					type: "gallery",
					aspect_ratio: "4/3",
					items: gallery.map((src) => ({ image: src })),
				},
				content_markdown && { type: "markdown", content: content_markdown },
				specs.length && {
					type: "features",
					items: specs.map((s) => ({
						name: s.name,
						description: s.value,
					})),
				},
				{ type: "reviews", current_item: true },
				categoryLinks.length && {
					type: "icon-links",
					intro_content: "### Tags",
					items: categoryLinks,
				},
			].filter(Boolean);
		},
	},
};
