import { validateReview, sanitizeReviewData } from '../libs/reviewValidation';
import { ReviewFormData } from '../../interface';

describe('Review Validation Tests', () => {
  // Rating validation tests
  describe('Rating Validation', () => {
    test('should accept valid ratings from 1 to 5', () => {
      for (let rating = 1; rating <= 5; rating++) {
        const data: ReviewFormData = { rating, comment: 'Great service!' };
        const result = validateReview(data);
        expect(result.valid).toBe(true);
        expect(result.errors.rating).toBeUndefined();
      }
    });

    test('should reject rating below 1', () => {
      const data: ReviewFormData = { rating: 0, comment: 'Test' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBe('Rating must be between 1 and 5');
    });

    test('should reject rating above 5', () => {
      const data: ReviewFormData = { rating: 6, comment: 'Test' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBe('Rating must be between 1 and 5');
    });

    test('should reject negative rating', () => {
      const data: ReviewFormData = { rating: -1, comment: 'Test' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBe('Rating must be between 1 and 5');
    });

    test('should reject decimal rating', () => {
      const data: ReviewFormData = { rating: 3.5, comment: 'Test' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBe('Rating must be a whole number');
    });

    test('should reject null rating', () => {
      const data: ReviewFormData = { rating: null as any, comment: 'Test' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBe('Rating is required');
    });

    test('should reject undefined rating', () => {
      const data: ReviewFormData = { rating: undefined as any, comment: 'Test' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBe('Rating is required');
    });
  });

  // Comment validation tests
  describe('Comment Validation', () => {
    test('should accept valid comments', () => {
      const validComments = [
        'Great service!',
        'The provider was excellent and very professional.',
        'Good experience overall.',
        'A'.repeat(1000), // Maximum length
      ];

      validComments.forEach((comment) => {
        const data: ReviewFormData = { rating: 5, comment };
        const result = validateReview(data);
        expect(result.valid).toBe(true);
        expect(result.errors.comment).toBeUndefined();
      });
    });

    test('should reject empty comment', () => {
      const data: ReviewFormData = { rating: 5, comment: '' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.comment).toBe('Comment is required');
    });

    test('should reject comment with only whitespace', () => {
      const data: ReviewFormData = { rating: 5, comment: '   ' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.comment).toBe('Comment cannot be empty or only whitespace');
    });

    test('should reject comment exceeding 1000 characters', () => {
      const data: ReviewFormData = { rating: 5, comment: 'A'.repeat(1001) };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.comment).toBe('Comment cannot exceed 1000 characters');
    });

    test('should reject null comment', () => {
      const data: ReviewFormData = { rating: 5, comment: null as any };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.comment).toBe('Comment is required');
    });
  });

  // Combined validation tests
  describe('Combined Validation', () => {
    test('should reject invalid rating and comment', () => {
      const data: ReviewFormData = { rating: 10, comment: '' };
      const result = validateReview(data);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBeDefined();
      expect(result.errors.comment).toBeDefined();
    });

    test('should accept valid rating and comment', () => {
      const data: ReviewFormData = { rating: 4, comment: 'Very good service!' };
      const result = validateReview(data);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });

  // Sanitize tests
  describe('Data Sanitization', () => {
    test('should trim comment whitespace', () => {
      const result = sanitizeReviewData({
        rating: 5,
        comment: '  Great service!  ',
      });
      expect(result.comment).toBe('Great service!');
    });

    test('should round rating to nearest integer', () => {
      const result = sanitizeReviewData({
        rating: 3.7,
        comment: 'Good',
      });
      expect(result.rating).toBe(4);
    });

    test('should default to rating 5 if invalid', () => {
      const result = sanitizeReviewData({
        rating: null,
        comment: 'Test',
      });
      expect(result.rating).toBe(5);
    });

    test('should handle missing comment', () => {
      const result = sanitizeReviewData({
        rating: 5,
        comment: undefined,
      });
      expect(result.comment).toBe('');
    });
  });
});
