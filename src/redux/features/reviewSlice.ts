import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReviewItem, ReviewFormData } from "../../../interface";

type ReviewState = {
  reviews: ReviewItem[];
  currentReview: ReviewItem | null;
  loading: boolean;
  error: string | null;
  formData: ReviewFormData;
};

const initialState: ReviewState = {
  reviews: [],
  currentReview: null,
  loading: false,
  error: null,
  formData: {
    rating: 5,
    comment: "",
  },
};

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // Set all reviews
    setReviews: (state, action: PayloadAction<ReviewItem[]>) => {
      state.reviews = action.payload;
    },
    
    // Set single review
    setCurrentReview: (state, action: PayloadAction<ReviewItem | null>) => {
      state.currentReview = action.payload;
    },
    
    // Add new review to the list
    addReview: (state, action: PayloadAction<ReviewItem>) => {
      state.reviews.push(action.payload);
    },
    
    // Update review in the list
    updateReviewInList: (state, action: PayloadAction<ReviewItem>) => {
      const index = state.reviews.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    },
    
    // Delete review from list
    deleteReviewFromList: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Update form data
    updateFormData: (state, action: PayloadAction<Partial<ReviewFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    
    // Reset form data
    resetFormData: (state) => {
      state.formData = {
        rating: 5,
        comment: "",
      };
    },
    
    // Clear all review state
    clearReviewState: (state) => {
      state.reviews = [];
      state.currentReview = null;
      state.loading = false;
      state.error = null;
      state.formData = {
        rating: 5,
        comment: "",
      };
    },
  },
});

export const {
  setReviews,
  setCurrentReview,
  addReview,
  updateReviewInList,
  deleteReviewFromList,
  setLoading,
  setError,
  updateFormData,
  resetFormData,
  clearReviewState,
} = reviewSlice.actions;
