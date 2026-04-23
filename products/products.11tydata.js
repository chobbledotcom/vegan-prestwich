export default {
	layout: "design-system-base.html",
	tags: ["products"],
	reviewsField: "products",
	permalink: "/place/{{ page.fileSlug }}/index.html",
	votes: 0,
	filter_attributes: [],
	eleventyComputed: {
		blocks: (data) => {
			const {
				title,
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
				{ type: "hero", title, badge },
				gallery.length && {
					type: "gallery",
					aspect_ratio: "4/3",
					items: gallery.map((src) => ({ image: src })),
				},
				{ type: "content" },
				specs.length && {
					type: "features",
					items: specs.map((s) => ({
						title: s.name,
						description: s.value,
					})),
				},
				{ type: "reviews", current_item: true },
				categoryLinks.length && {
					type: "icon-links",
					intro: "### Tags",
					items: categoryLinks,
				},
			].filter(Boolean);
		},
	},
};
