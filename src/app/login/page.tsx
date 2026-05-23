"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Authentication failed");
        return;
      }

      // On success save user_id and name to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.user_id.toString());
      localStorage.setItem("userName", data.name);

      window.location.href = "/";
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFEFE2]">
      {/* Left side: Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 xl:px-32">
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {isLogin ? "Welcome back!" : "Join us!"}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Simplify your practice and boost your wellness with Perfect Pose. Get started for free.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required={!isLogin}
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-5 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm placeholder:text-gray-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end pt-1">
                <Link
                  href="#"
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-colors mt-4"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-600">
            {isLogin ? "Not a member? " : "Already a member? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              {isLogin ? "Register now" : "Login now"}
            </button>
          </p>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden sm:flex sm:w-1/2 relative items-center justify-center p-8">
        <Image
          src="/login.jpeg"
          alt="Yoga session"
          fill
          style={{ objectFit: "contain", padding: "2rem" }}
          priority
          className="rounded-l-3xl"
        />
      </div>
    </div>
  );
}
