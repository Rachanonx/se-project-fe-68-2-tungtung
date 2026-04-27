'use client';

import React, { useEffect, useState } from 'react';
import { ReviewItem } from '../../interface';
import styles from './reviewList.module.css';

interface ReviewListProps {
  providerId: string;
  reviews: ReviewItem[];
  loading?: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
  onEditClick?: (review: ReviewItem) => void;
  onDeleteClick?: (reviewId: string) => void;
}

export default function ReviewList({
  providerId,
  reviews,
  loading = false,
  currentUserId,
  isAdmin = false,
  onEditClick,
  onDeleteClick,
}: ReviewListProps) {
  const [filteredReviews, setFilteredReviews] = useState<ReviewItem[]>(reviews);

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={`${styles.star} ${value <= rating ? styles.starFilled : styles.starEmpty}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const isReviewOwner = (review: ReviewItem): boolean => {
    const userId = typeof review.user === 'string' ? review.user : review.user._id;
    return currentUserId === userId;
  };

  if (loading) {
    return <div className={styles.loadingMessage}>Loading reviews...</div>;
  }

  if (filteredReviews.length === 0) {
    return (
      <div className={styles.noReviews}>
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewListContainer}>
      <h2 className={styles.title}>Reviews ({filteredReviews.length})</h2>
      <div className={styles.reviewsList}>
        {filteredReviews.map((review) => {
          const userName =
            typeof review.user === 'string' ? 'Anonymous' : review.user.name || 'Anonymous';
          const isOwner = isReviewOwner(review);

          return (
            <div key={review._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{userName}</h3>
                  <p className={styles.reviewDate}>{formatDate(review.createdAt)}</p>
                </div>
                {(isOwner || isAdmin) && (
                  <div className={styles.actions}>
                    {isOwner && (
                      <>
                        {onEditClick && (
                          <button
                            className={styles.editButton}
                            onClick={() => onEditClick(review)}
                            title="Edit review"
                          >
                            Edit
                          </button>
                        )}
                        {onDeleteClick && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => onDeleteClick(review._id)}
                            title="Delete review"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                    {!isOwner && isAdmin && onDeleteClick && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => onDeleteClick(review._id)}
                        title="Delete review as admin"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.ratingContainer}>{renderStars(review.rating)}</div>

              <p className={styles.comment}>{review.comment}</p>

              {review.updatedAt !== review.createdAt && (
                <p className={styles.editedNote}>
                  (Edited on {formatDate(review.updatedAt)})
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
