export default async function deleteReview(
  reviewId: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
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
    console.error("Error deleting review:", error);
    throw error;
  }
}
