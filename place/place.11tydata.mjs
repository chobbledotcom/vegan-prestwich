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
		},
		last_modified_at: (data) => {
			// Get the current last_modified_at value
			const currentLastModified = data.last_modified_at ? new Date(data.last_modified_at) : null;
			
			// Get reviews from the frontmatter
			const reviews = data.reviews || [];
			
			// Find the latest review date
			let latestReviewDate = null;
			if (Array.isArray(reviews) && reviews.length > 0) {
				// Get all review dates and find the maximum
				const reviewDates = reviews
					.filter(review => review.date)
					.map(review => new Date(review.date));
				
				if (reviewDates.length > 0) {
					latestReviewDate = new Date(Math.max(...reviewDates));
				}
			}
			
			// Compare and return the later date
			if (!currentLastModified && !latestReviewDate) {
				return null;
			} else if (!currentLastModified) {
				return latestReviewDate.toISOString().split('T')[0];
			} else if (!latestReviewDate) {
				return currentLastModified.toISOString().split('T')[0];
			} else {
				const laterDate = currentLastModified > latestReviewDate ? currentLastModified : latestReviewDate;
				return laterDate.toISOString().split('T')[0];
			}
		}
	}
};