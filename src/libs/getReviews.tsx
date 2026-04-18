import { ReviewsResponse } from "../../interface";

export default async function getReviews(): Promise<ReviewsResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let errorData: any = null;
    const contentType = response.headers?.get?.("content-type") || "";
    
    try {
      if (contentType.includes("application/json") || typeof response.json === "function") {
        errorData = await response.json();
      } else if (typeof response.text === "function") {
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
      errorData = { success: true, count: 0, data: [] };
    }

    return errorData;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}
