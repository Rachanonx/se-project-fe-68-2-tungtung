import createReview from '../libs/createReview';
import updateReview from '../libs/updateReview';
import deleteReview from '../libs/deleteReview';
import getReviews from '../libs/getReviews';
import getReview from '../libs/getReview';

// Mock fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Review API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:5000';
  });

  // Create Review Tests
  describe('createReview', () => {
    test('should successfully create a review', async () => {
      const mockResponse = {
        success: true,
        data: {
          _id: '123',
          rating: 5,
          comment: 'Great service!',
          user: 'user_id',
          provider: 'provider_id',
          createdAt: '2026-04-18T10:00:00Z',
          updatedAt: '2026-04-18T10:00:00Z',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await createReview('provider_id', 'token', {
        rating: 5,
        comment: 'Great service!',
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/providers/provider_id/reviews',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer token',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    test('should throw error on invalid rating', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Rating must be between 1 and 5' }),
      } as any);

      await expect(
        createReview('provider_id', 'token', {
          rating: 10,
          comment: 'Test',
        })
      ).rejects.toThrow('Rating must be between 1 and 5');
    });

    test('should throw error on empty comment', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Comment cannot be empty' }),
      } as any);

      await expect(
        createReview('provider_id', 'token', {
          rating: 5,
          comment: '',
        })
      ).rejects.toThrow('Comment cannot be empty');
    });

    test('should throw error on duplicate review', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'You have already reviewed this provider' }),
      } as any);

      await expect(
        createReview('provider_id', 'token', {
          rating: 5,
          comment: 'Great!',
        })
      ).rejects.toThrow('You have already reviewed this provider');
    });
  });

  // Update Review Tests
  describe('updateReview', () => {
    test('should successfully update a review', async () => {
      const mockResponse = {
        success: true,
        data: {
          _id: '123',
          rating: 4,
          comment: 'Updated comment',
          user: 'user_id',
          provider: 'provider_id',
          createdAt: '2026-04-18T10:00:00Z',
          updatedAt: '2026-04-18T11:00:00Z',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await updateReview('review_id', 'token', {
        rating: 4,
        comment: 'Updated comment',
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/reviews/review_id',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            authorization: 'Bearer token',
          }),
        })
      );
    });

    test('should support partial updates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { rating: 3, comment: 'Original comment' },
        }),
      } as any);

      await updateReview('review_id', 'token', { rating: 3 });

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as any).body
      );
      expect(callBody).toEqual({ rating: 3 });
    });

    test('should throw error if not the review owner', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Not authorized to update this review' }),
      } as any);

      await expect(
        updateReview('review_id', 'other_token', {
          rating: 4,
          comment: 'Hacked!',
        })
      ).rejects.toThrow('Not authorized to update this review');
    });

    test('should throw error on invalid update data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Rating must be between 1 and 5' }),
      } as any);

      await expect(
        updateReview('review_id', 'token', {
          rating: 10,
          comment: 'Test',
        })
      ).rejects.toThrow('Rating must be between 1 and 5');
    });
  });

  // Delete Review Tests
  describe('deleteReview', () => {
    test('should successfully delete a review', async () => {
      const mockResponse = { success: true, data: {} };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await deleteReview('review_id', 'token');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/reviews/review_id',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            authorization: 'Bearer token',
          }),
        })
      );
    });

    test('should throw error if not the review owner', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Not authorized to delete this review' }),
      } as any);

      await expect(deleteReview('review_id', 'other_token')).rejects.toThrow(
        'Not authorized to delete this review'
      );
    });

    test('should throw error if review not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'No review with the id of 999' }),
      } as any);

      await expect(deleteReview('999', 'token')).rejects.toThrow(
        'No review with the id of 999'
      );
    });
  });

  // Get Reviews Tests
  describe('getReviews', () => {
    test('should successfully fetch all reviews', async () => {
      const mockResponse = {
        success: true,
        count: 2,
        data: [
          {
            _id: '1',
            rating: 5,
            comment: 'Excellent!',
            user: { _id: 'user1', name: 'John' },
            provider: { _id: 'prov1', name: 'Provider 1' },
            createdAt: '2026-04-18T10:00:00Z',
            updatedAt: '2026-04-18T10:00:00Z',
          },
          {
            _id: '2',
            rating: 4,
            comment: 'Good',
            user: { _id: 'user2', name: 'Jane' },
            provider: { _id: 'prov1', name: 'Provider 1' },
            createdAt: '2026-04-18T11:00:00Z',
            updatedAt: '2026-04-18T11:00:00Z',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await getReviews();

      expect(result).toEqual(mockResponse);
      expect(result.count).toBe(2);
      expect(result.data.length).toBe(2);
    });

    test('should handle empty reviews list', async () => {
      const mockResponse = {
        success: true,
        count: 0,
        data: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await getReviews();

      expect(result.count).toBe(0);
      expect(result.data.length).toBe(0);
    });
  });

  // Get Single Review Tests
  describe('getReview', () => {
    test('should successfully fetch a single review', async () => {
      const mockResponse = {
        success: true,
        data: {
          _id: '123',
          rating: 5,
          comment: 'Great!',
          user: { _id: 'user1', name: 'John', email: 'john@example.com' },
          provider: { _id: 'prov1', name: 'Provider 1' },
          createdAt: '2026-04-18T10:00:00Z',
          updatedAt: '2026-04-18T10:00:00Z',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await getReview('123');

      expect(result).toEqual(mockResponse);
      expect(result.data.rating).toBe(5);
    });

    test('should throw error if review not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'No review with the id of 999' }),
      } as any);

      await expect(getReview('999')).rejects.toThrow(
        'No review with the id of 999'
      );
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        createReview('provider_id', 'token', {
          rating: 5,
          comment: 'Test',
        })
      ).rejects.toThrow('Network error');
    });

    test('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as any);

      await expect(
        createReview('provider_id', 'token', {
          rating: 5,
          comment: 'Test',
        })
      ).rejects.toThrow();
    });
  });
});
