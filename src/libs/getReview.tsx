import { ReviewResponse } from "../../interface";

export default async function getReview(reviewId: string): Promise<ReviewResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
    console.error("Error fetching review:", error);
    throw error;
  }
}
