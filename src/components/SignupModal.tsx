"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import PrivacyPolicy from "./PrivacyPolicy";

export default function SignupModal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    password: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const formatTelephone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : name === "telephone"
          ? formatTelephone(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms & policy.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          telephone: formData.telephone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please sign in.");
        router.push("/api/auth/signin");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
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
        Get Started Now
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

        {/* Name */}
        <Box sx={{ mb: 2 }}>
          <Typography component="label" htmlFor="name" sx={labelSx}>
            Name
          </Typography>
          <TextField
            id="name"
            name="name"
            type="text"
            fullWidth
            required
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            slotProps={inputSlotProps}
          />
        </Box>

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

        {/* Telephone */}
        <Box sx={{ mb: 2 }}>
          <Typography component="label" htmlFor="telephone" sx={labelSx}>
            Telephone
          </Typography>
          <TextField
            id="telephone"
            name="telephone"
            type="tel"
            fullWidth
            required
            placeholder="000-000-0000"
            value={formData.telephone}
            onChange={handleChange}
            variant="outlined"
            slotProps={{
              input: {
                sx: {
                  borderRadius: "12px",
                  fontFamily: "Poppins, sans-serif",
                  height: "46px",
                },
                inputMode: "numeric",
              },
            }}
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

        {/* Terms */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                sx={{
                  color: "#000",
                  "&.Mui-checked": { color: "#000" },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "#000",
                }}
              >
                I agree to the{" "}
                <Box 
                  component="span" 
                  sx={{ 
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#1976d2",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPrivacyPolicy(true);
                  }}
                >
                  terms & policy
                </Box>
              </Typography>
            }
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
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </Box>

      {/* Sign In Link */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            color: "#000",
          }}
        >
          Have an account?{" "}
          <Link
            href="/api/auth/signin"
            underline="none"
            sx={{
              color: "#0f3cde",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>

      {/* Privacy Policy Popup */}
      <PrivacyPolicy 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)}
        onAccept={() => setFormData((prev) => ({ ...prev, agreeToTerms: true }))}
      />

    </Box>
  );
}