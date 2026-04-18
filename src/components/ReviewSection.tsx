'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import getReviews from '@/libs/getReviews';
import deleteReview from '@/libs/deleteReview';
import { ReviewItem } from '../../interface';
import styles from './reviewSection.module.css';

interface ReviewSectionProps {
  providerId: string;
  providerName: string;
}

export default function ReviewSection({ providerId, providerName }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch reviews on mount and when providerId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getReviews();
        // Filter reviews for this provider
        const providerReviews = response.data.filter(
          (review: ReviewItem) =>
            (typeof review.provider === 'string'
              ? review.provider
              : review.provider._id) === providerId
        );
        setReviews(providerReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [providerId]);

  const handleEditClick = (review: ReviewItem) => {
    setSelectedReview(review);
    setIsEditingReview(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('review-form');
      formElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeleteConfirm(reviewId);
  };

  const confirmDelete = async (reviewId: string) => {
    try {
      const token = (session?.user as any)?.token;
      if (!token) {
        alert('Please sign in to delete your review');
        return;
      }

      await deleteReview(reviewId, token);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete review');
    }
  };

  const handleFormSuccess = () => {
    // Refresh reviews after successful submission
    const fetchReviews = async () => {
      try {
        const response = await getReviews();
        const providerReviews = response.data.filter(
          (review: ReviewItem) =>
            (typeof review.provider === 'string'
              ? review.provider
              : review.provider._id) === providerId
        );
        setReviews(providerReviews);
        setIsEditingReview(false);
        setSelectedReview(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  };

  return (
    <section className={styles.reviewSection}>
      {/* Review Form - Only show if user is logged in */}
      {session?.user ? (
        <div id="review-form" className={styles.formContainer}>
          <ReviewForm
            providerId={providerId}
            providername={providerName}
            reviewId={selectedReview?._id}
            initialRating={selectedReview?.rating || 5}
            initialComment={selectedReview?.comment || ''}
            onSuccess={handleFormSuccess}
            isEditing={isEditingReview}
          />
          {isEditingReview && (
            <button
              className={styles.cancelEditButton}
              onClick={() => {
                setIsEditingReview(false);
                setSelectedReview(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <p>Please sign in to leave a review for this provider.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContent}>
            <p>Are you sure you want to delete this review?</p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmDelete}
                onClick={() => confirmDelete(deleteConfirm)}
              >
                Delete
              </button>
              <button
                className={styles.confirmCancel}
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <ReviewList
        providerId={providerId}
        reviews={reviews}
        loading={loading}
        currentUserId={session?.user?._id}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    </section>
  );
}
