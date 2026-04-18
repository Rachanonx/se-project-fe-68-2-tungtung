import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, telephone } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !telephone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call backend API to register user
    const response = await fetch(
      "https://fe-project-68-bongbing-backend.vercel.app/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          telephone,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Registration failed" },
        { status: response.status }
      );
    }

    const userData = await response.json();

    return NextResponse.json({
      message: "User registered successfully",
      user: userData
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}