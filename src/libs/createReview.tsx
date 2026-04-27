import { ReviewFormData, ReviewResponse } from "../../interface";

export default async function createReview(
  providerId: string,
  token: string,
  reviewData: ReviewFormData
): Promise<ReviewResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers/${providerId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      }
    );
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Use default error message if response is not JSON
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}
