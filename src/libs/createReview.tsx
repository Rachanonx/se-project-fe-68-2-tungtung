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

    let parsedData: any = null;
    const contentType = response.headers?.get?.("content-type") || "";

    try {
      if (contentType.includes("application/json") || typeof response.json === "function") {
        parsedData = await response.json();
      } else if (typeof response.text === "function") {
        await response.text();
      }
    } catch {
      // Keep parsedData as null and use fallbacks below
    }

    if (!response.ok) {
      const errorMessage =
        parsedData?.message || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    if (!parsedData) {
      return { success: true } as ReviewResponse;
    }

    return parsedData;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}
