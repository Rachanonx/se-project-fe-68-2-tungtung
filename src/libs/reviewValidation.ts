import { ReviewFormData } from '../../interface';

export const validateReview = (data: ReviewFormData): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate rating
  if (data.rating === null || data.rating === undefined) {
    errors.rating = 'Rating is required';
  } else if (typeof data.rating !== 'number') {
    errors.rating = 'Rating must be a number';
  } else if (data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  } else if (!Number.isInteger(data.rating)) {
    errors.rating = 'Rating must be a whole number';
  }

  // Validate comment
  if (!data.comment) {
    errors.comment = 'Comment is required';
  } else if (typeof data.comment !== 'string') {
    errors.comment = 'Comment must be a string';
  } else if (data.comment.trim().length === 0) {
    errors.comment = 'Comment cannot be empty or only whitespace';
  } else if (data.comment.length > 1000) {
    errors.comment = 'Comment cannot exceed 1000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeReviewData = (data: any): ReviewFormData => {
  return {
    rating: Math.round(data.rating) || 5,
    comment: (data.comment || '').trim(),
  };
};
