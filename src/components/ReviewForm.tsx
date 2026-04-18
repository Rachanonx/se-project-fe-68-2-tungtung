'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setError, setLoading, updateFormData } from '@/redux/features/reviewSlice';
import styles from './reviewForm.module.css';

interface ReviewFormProps {
  providerId: string;
  providername: string;
  reviewId?: string; // If provided, it's an edit form
  initialRating?: number;
  initialComment?: string;
  onSuccess?: () => void;
  isEditing?: boolean;
}

export default function ReviewForm({
  providerId,
  providername,
  reviewId,
  initialRating = 5,
  initialComment = '',
  onSuccess,
  isEditing = false,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>(initialComment);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loading = useAppSelector((state) => state.reviewSlice.loading);
  const error = useAppSelector((state) => state.reviewSlice.error);

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (rating < 1 || rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (!comment.trim()) {
      errors.comment = 'Comment cannot be empty';
    } else if (comment.trim().length > 1000) {
      errors.comment = 'Comment cannot exceed 1000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(setLoading(true));
    setSuccessMessage('');

    try {
      const token = (session?.user as any)?.token;
      if (!token) {
        throw new Error('Authentication token not found. Please sign in.');
      }

      let response;

      if (isEditing && reviewId) {
        // Update existing review
        const updateReview = (await import('@/libs/updateReview')).default;
        response = await updateReview(reviewId, token, { rating, comment });
        setSuccessMessage('Review updated successfully!');
      } else {
        // Create new review
        const createReview = (await import('@/libs/createReview')).default;
        response = await createReview(providerId, token, { rating, comment });
        setSuccessMessage('Review created successfully!');
      }

      // Reset form
      setRating(5);
      setComment('');
      setValidationErrors({});

      // Call success callback
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while submitting your review';
      dispatch(setError(errorMessage));
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.reviewFormContainer}>
      <h2 className={styles.title}>
        {isEditing ? 'Edit Your Review' : 'Leave a Review'}
      </h2>
      <p className={styles.subtitle}>Provider: <strong>{providername}</strong></p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Rating Section */}
        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            Rating <span className={styles.required}>*</span>
          </label>
          <div className={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`${styles.starButton} ${
                  value <= rating ? styles.starActive : styles.starInactive
                }`}
                onClick={() => setRating(value)}
                title={`${value} star${value > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            <span className={styles.ratingValue}>{rating} / 5</span>
          </div>
          {validationErrors.rating && (
            <span className={styles.error}>{validationErrors.rating}</span>
          )}
        </div>

        {/* Comment Section */}
        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.label}>
            Your Review <span className={styles.required}>*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              // Clear error when user starts typing
              if (validationErrors.comment) {
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.comment;
                  return newErrors;
                });
              }
            }}
            placeholder="Share your experience with this provider..."
            className={`${styles.textarea} ${validationErrors.comment ? styles.inputError : ''}`}
            maxLength={1000}
            rows={6}
          />
          <div className={styles.charCount}>
            {comment.length} / 1000 characters
          </div>
          {validationErrors.comment && (
            <span className={styles.error}>{validationErrors.comment}</span>
          )}
        </div>

        {/* Messages */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className={styles.submitButton}
        >
          {isSubmitting || loading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
