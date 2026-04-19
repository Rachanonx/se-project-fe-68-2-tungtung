import createReview from '../libs/createReview';
import deleteBooking from '../libs/deleteBookings';
import deleteProvider from '../libs/deleteProvider';
import deleteReview from '../libs/deleteReview';
import getBookings from '../libs/getBookings';
import getProvider from '../libs/getProvider';
import getProviders from '../libs/getProviders';
import getReview from '../libs/getReview';
import getReviews from '../libs/getReviews';
import getUserProfile from '../libs/getUserProfile';
import makeBooking from '../libs/makeBookings';
import pushProvider from '../libs/pushProvider';
import { sanitizeReviewData, validateReview } from '../libs/reviewValidation';
import updateBooking from '../libs/updateBookings';
import updateReview from '../libs/updateReview';
import userLogin from '../libs/userLogIn';

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

type MockResponseShape = {
  ok: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<any>;
  text?: () => Promise<string>;
  contentType?: string;
  hasJson?: boolean;
  hasText?: boolean;
};

const makeResponse = ({
  ok,
  status = ok ? 200 : 500,
  statusText = ok ? 'OK' : 'Internal Server Error',
  json,
  text,
  contentType = 'application/json',
  hasJson = true,
  hasText = true,
}: MockResponseShape): Response => {
  const defaultJson = async () => ({ success: ok });
  const defaultText = async () => 'plain text';

  const responseLike: any = {
    ok,
    status,
    statusText,
    headers: {
      get: () => contentType,
    },
  };

  if (hasJson) {
    responseLike.json = json ?? defaultJson;
  }
  if (hasText) {
    responseLike.text = text ?? defaultText;
  }

  return responseLike as Response;
};

describe('Logic Modules Full Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:5000';
  });

  describe('reviewValidation', () => {
    it('covers type guards and sanitize fallback behavior', () => {
      expect(validateReview({ rating: '5' as any, comment: 'ok' }).errors.rating).toBe(
        'Rating must be a number'
      );
      expect(validateReview({ rating: 5, comment: 10 as any }).errors.comment).toBe(
        'Comment must be a string'
      );
      expect(validateReview({ rating: 5, comment: 'ok' }).valid).toBe(true);

      expect(sanitizeReviewData({ rating: 0, comment: '  hi  ' })).toEqual({
        rating: 5,
        comment: 'hi',
      });
      expect(sanitizeReviewData({ rating: 4.4, comment: null })).toEqual({
        rating: 4,
        comment: '',
      });
    });
  });

  describe('createReview', () => {
    it('returns parsed json on success', async () => {
      const payload = { success: true, data: { _id: 'r1' } };
      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, json: async () => payload })
      );

      await expect(
        createReview('provider-1', 'token-1', { rating: 5, comment: 'Great' })
      ).resolves.toEqual(payload);
    });

    it('handles non-json success response by returning default success object', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: true,
          contentType: 'text/plain',
          hasJson: false,
          text: async () => 'created',
        })
      );

      await expect(
        createReview('provider-2', 'token-2', { rating: 4, comment: 'Good' })
      ).resolves.toEqual({ success: true });
    });

    it('throws API error with message when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, json: async () => ({ message: 'Bad request' }) })
      );

      await expect(
        createReview('provider-3', 'token-3', { rating: 2, comment: 'meh' })
      ).rejects.toThrow('Bad request');
    });

    it('throws API status fallback error when parsing fails and response is not ok', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: false,
          status: 418,
          statusText: "I'm a teapot",
          json: async () => {
            throw new Error('parse failed');
          },
        })
      );

      await expect(
        createReview('provider-4', 'token-4', { rating: 1, comment: 'x' })
      ).rejects.toThrow("API Error: 418 I'm a teapot");
    });

    it('rethrows fetch-level errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('network down'));

      await expect(
        createReview('provider-5', 'token-5', { rating: 3, comment: 'ok' })
      ).rejects.toThrow('network down');
    });
  });

  describe('updateReview/deleteReview/getReview/getReviews', () => {
    it('covers updateReview success + non-json fallback + not-ok fallback', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, json: async () => ({ success: true, data: { _id: 'u1' } }) })
      );
      await expect(updateReview('u1', 't', { rating: 3 })).resolves.toEqual({
        success: true,
        data: { _id: 'u1' },
      });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, contentType: 'text/plain', hasJson: false })
      );
      await expect(updateReview('u2', 't', { comment: 'txt' })).resolves.toEqual({
        success: true,
      });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, status: 400, statusText: 'Bad', json: async () => ({}) })
      );
      await expect(updateReview('u3', 't', { rating: 5 })).rejects.toThrow('API Error: 400 Bad');

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: true,
          json: async () => {
            throw new Error('update parse fail');
          },
        })
      );
      await expect(updateReview('u3b', 't', { rating: 4 })).resolves.toEqual({ success: true });

      mockFetch.mockRejectedValueOnce(new Error('update fetch fail'));
      await expect(updateReview('u4', 't', { rating: 5 })).rejects.toThrow('update fetch fail');
    });

    it('covers deleteReview success + parse-error fallback + fetch throw', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, json: async () => ({ success: true, data: {} }) })
      );
      await expect(deleteReview('d1', 't')).resolves.toEqual({ success: true, data: {} });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, contentType: 'text/plain', hasJson: false, text: async () => 'deleted' })
      );
      await expect(deleteReview('d1b', 't')).resolves.toEqual({ success: true });

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: async () => {
            throw new Error('json fail');
          },
        })
      );
      await expect(deleteReview('d2', 't')).rejects.toThrow('API Error: 401 Unauthorized');

      mockFetch.mockRejectedValueOnce(new Error('fetch fail'));
      await expect(deleteReview('d3', 't')).rejects.toThrow('fetch fail');
    });

    it('covers getReview and getReviews success + defaults + not-ok branches', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, json: async () => ({ success: true, data: { _id: 'g1' } }) })
      );
      await expect(getReview('g1')).resolves.toEqual({ success: true, data: { _id: 'g1' } });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, contentType: 'text/plain', hasJson: false })
      );
      await expect(getReview('g2')).resolves.toEqual({ success: true });

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: true,
          json: async () => {
            throw new Error('getReview parse fail');
          },
        })
      );
      await expect(getReview('g2b')).resolves.toEqual({ success: true });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) })
      );
      await expect(getReview('g3')).rejects.toThrow('API Error: 404 Not Found');

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: true,
          json: async () => ({ success: true, count: 2, data: [{ _id: '1' }, { _id: '2' }] }),
        })
      );
      await expect(getReviews()).resolves.toEqual({
        success: true,
        count: 2,
        data: [{ _id: '1' }, { _id: '2' }],
      });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, contentType: 'text/plain', hasJson: false })
      );
      await expect(getReviews()).resolves.toEqual({ success: true, count: 0, data: [] });

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: true,
          json: async () => {
            throw new Error('getReviews parse fail');
          },
        })
      );
      await expect(getReviews()).resolves.toEqual({ success: true, count: 0, data: [] });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, status: 500, statusText: 'Server Error', json: async () => ({}) })
      );
      await expect(getReviews()).rejects.toThrow('API Error: 500 Server Error');

      mockFetch.mockRejectedValueOnce(new Error('getReview fetch fail'));
      await expect(getReview('g4')).rejects.toThrow('getReview fetch fail');

      mockFetch.mockRejectedValueOnce(new Error('getReviews fetch fail'));
      await expect(getReviews()).rejects.toThrow('getReviews fetch fail');
    });
  });

  describe('provider/bookings/auth modules', () => {
    it('covers deleteProvider success and failure', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true }) }));
      await expect(deleteProvider('token', 'p1')).resolves.toEqual({ success: true });

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(deleteProvider('token', 'p2')).rejects.toThrow('Failed to delete provider');
    });

    it('covers getProvider and getProviders success and failure', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ data: { _id: 'p1' } }) }));
      await expect(getProvider('p1')).resolves.toEqual({ data: { _id: 'p1' } });

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(getProvider('p2')).rejects.toThrow('Failed to fetch provider');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ count: 1, data: [] }) }));
      await expect(getProviders()).resolves.toEqual({ count: 1, data: [] });

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(getProviders()).rejects.toThrow('Failed to fetch Provider');
    });

    it('covers pushProvider success and both error extraction branches', async () => {
      const randomSpy = jest
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.01)
        .mockReturnValueOnce(0.02)
        .mockReturnValueOnce(0.03)
        .mockReturnValueOnce(0.04);

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: true, status: 201, json: async () => ({ success: true, data: { _id: 'np' } }) })
      );
      await expect(pushProvider('token')).resolves.toEqual({ success: true, data: { _id: 'np' } });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, status: 400, statusText: 'Bad Request', json: async () => ({ message: 'Invalid provider' }) })
      );
      await expect(pushProvider('token')).rejects.toThrow('HTTP 400: Invalid provider');

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, status: 422, statusText: 'Unprocessable Entity', json: async () => ({}) })
      );
      await expect(pushProvider('token')).rejects.toThrow('HTTP 422: Unprocessable Entity');

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          json: async () => {
            throw new Error('json parse fail');
          },
        })
      );
      await expect(pushProvider('token')).rejects.toThrow('HTTP 503: Unknown Error');

      randomSpy.mockRestore();
    });

    it('covers bookings modules and user auth/profile modules', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true, data: [] }) }));
      await expect(getBookings('token')).resolves.toEqual({ success: true, data: [] });
      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(getBookings('token')).rejects.toThrow('Failed to fetch bookings');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true }) }));
      await expect(deleteBooking('b1', 'token')).resolves.toEqual({ success: true });
      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(deleteBooking('b2', 'token')).rejects.toThrow('Failed to delete booking');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true, data: { _id: 'm1' } }) }));
      await expect(makeBooking('p1', 'token', '2026-04-20', 'u1')).resolves.toEqual({
        success: true,
        data: { _id: 'm1' },
      });

      mockFetch.mockResolvedValueOnce(
        makeResponse({ ok: false, json: async () => ({ message: 'slot unavailable' }) })
      );
      await expect(makeBooking('p1', 'token', '2026-04-21', 'u1')).rejects.toThrow('slot unavailable');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false, json: async () => ({}) }));
      await expect(makeBooking('p1', 'token', '2026-04-22', 'u1')).rejects.toThrow('Failed to create booking');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true, data: { _id: 'u1' } }) }));
      await expect(updateBooking('b1', 'token', '2026-04-23')).resolves.toEqual({
        success: true,
        data: { _id: 'u1' },
      });

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false, json: async () => ({ message: 'cannot edit' }) }));
      await expect(updateBooking('b1', 'token', '2026-04-24')).rejects.toThrow('cannot edit');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false, json: async () => ({}) }));
      await expect(updateBooking('b1', 'token', '2026-04-24')).rejects.toThrow('Failed to update booking');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true, data: { id: 'me' } }) }));
      await expect(getUserProfile('token')).resolves.toEqual({ success: true, data: { id: 'me' } });

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(getUserProfile('token')).rejects.toThrow('Failed to get use profile');

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: true, json: async () => ({ success: true, token: 'jwt' }) }));
      await expect(userLogin('a@b.com', 'pass')).resolves.toEqual({ success: true, token: 'jwt' });

      mockFetch.mockResolvedValueOnce(makeResponse({ ok: false }));
      await expect(userLogin('a@b.com', 'pass')).rejects.toThrow('Failed to login');
    });
  });

  describe('config', () => {
    it('uses env value when present', () => {
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://env-backend';
      jest.resetModules();
      jest.isolateModules(() => {
        const mod = require('../libs/config');
        expect(mod.BACKEND_URL).toBe('http://env-backend');
      });
    });

    it('uses fallback when env is missing', () => {
      delete process.env.NEXT_PUBLIC_BACKEND_URL;
      jest.resetModules();
      jest.isolateModules(() => {
        const mod = require('../libs/config');
        expect(mod.BACKEND_URL).toBe('https://se-project-be-68-2-tungtung.vercel.app');
      });
    });
  });
});