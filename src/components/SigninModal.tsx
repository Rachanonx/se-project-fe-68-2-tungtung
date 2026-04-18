"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

export default function SigninModal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputSlotProps = {
    input: {
      sx: {
        borderRadius: "12px",
        fontFamily: "Poppins, sans-serif",
        height: "46px",
      },
    },
  };

  const labelSx = {
    display: "block",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 500,
    fontSize: { xs: "14px", md: "16px" },
    color: "#000",
    mb: 0.5,
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", px: { xs: 2, md: 4 } }}>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: { xs: "28px", md: "40px" },
          color: "#000",
          lineHeight: 1.2,
          mb: 1,
        }}
      >
        Welcome Back
      </Typography>

      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: { xs: "14px", md: "18px" },
          color: "#000",
          lineHeight: 1.4,
          mb: 3,
        }}
      >
        Enter your Credentials to access your account
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>

        {/* Email */}
        <Box sx={{ mb: 2 }}>
          <Typography component="label" htmlFor="email" sx={labelSx}>
            Email address
          </Typography>
          <TextField
            id="email"
            name="email"
            type="email"
            fullWidth
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            slotProps={inputSlotProps}
          />
        </Box>

        {/* Password */}
        <Box sx={{ mb: 2 }}>
          <Typography component="label" htmlFor="password" sx={labelSx}>
            Password
          </Typography>
          <TextField
            id="password"
            name="password"
            type="password"
            fullWidth
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            slotProps={inputSlotProps}
          />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            height: "46px",
            borderRadius: "12px",
            backgroundColor: "#000",
            border: "1.56px solid #000",
            boxShadow: "none",
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            "&:hover": { backgroundColor: "#111", boxShadow: "none" },
            "&.Mui-disabled": { opacity: 0.5 },
          }}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>

      {/* Sign Up Link */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            color: "#000",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            underline="none"
            sx={{
              color: "#0f3cde",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>

    </Box>
  );
}