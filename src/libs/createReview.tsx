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

    let errorData: any = null;
    const contentType = response.headers.get("content-type");
    
    try {
      if (contentType?.includes("application/json")) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response from server:", text);
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
    }

    if (!response.ok) {
      throw new Error(
        errorData?.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    if (!errorData) {
      errorData = { success: true };
    }

    return errorData;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}
