export default {
	eleventyComputed: {
		placeReviews: (data) => {
			// Get all reviews from the global data
			const allReviews = data.reviews || [];
			
			// Get the current place's slug
			const currentSlug = data.page.fileSlug;
			
			// Filter reviews for this place
			// Support multiple formats:
			// - "codis-kitchen"
			// - "/place/codis-kitchen.md"
			// - "./place/codis-kitchen.md"
			// - "place/codis-kitchen"
			// - etc.
			const matchingReviews = allReviews.filter(review => {
				if (!review.place) return false;
				
				// Extract the slug from the review's place field
				const reviewPlace = review.place
					.replace(/^\.\//, '') // Remove leading ./
					.replace(/^\//, '')   // Remove leading /
					.replace(/\.md$/, '') // Remove .md extension
					.split('/')           // Split by /
					.pop();              // Take the last part
				
				return reviewPlace === currentSlug;
			});
			
			// Sort by date, newest first
			return matchingReviews.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateB - dateA;
			});
		}
	}
};