export default {
	eleventyComputed: {
		placeReviews: (data) => {
			// Get reviews from the frontmatter
			const reviews = data.reviews || [];
			
			// Return empty array if no reviews
			if (!Array.isArray(reviews) || reviews.length === 0) {
				return [];
			}
			
			// Sort by date, newest first
			return reviews.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateB - dateA;
			});
		}
	}
};