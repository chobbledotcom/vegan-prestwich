import { normaliseSlug } from "#utils/slug-utils.js";

export default {
	eleventyComputed: {
		// Reviews never render as pages (permalink: false), so skip the
		// template's block validation, which would demand a reviewer name.
		blocks: () => [],
		products: (data) => (data.products || []).map(normaliseSlug),
		properties: (data) => (data.property ? [normaliseSlug(data.property)] : []),
	},
};
