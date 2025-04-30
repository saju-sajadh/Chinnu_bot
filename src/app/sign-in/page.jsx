"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";

// Child component containing useSearchParams
function SigninContent() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (pwd) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pwd);
  };

  // Handle email/password sign-in
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!isLoaded) return;
      setButtonLoading(true);

      const isEmailValid = validateEmail(emailAddress);
      const isPasswordValid = validatePassword(password);

      setEmailError(isEmailValid ? "" : "Invalid email address");
      setPasswordError(
        isPasswordValid
          ? ""
          : "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character"
      );

      if (!isEmailValid || !isPasswordValid) {
        setButtonLoading(false);
        return;
      }

      try {
        const result = await signIn.create({
          identifier: emailAddress,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          setError("Sign-in failed. Please try again.");
        }
      } catch (err) {
        setError(err.errors?.[0]?.message || "Invalid email or password");
      } finally {
        setButtonLoading(false);
      }
    },
    [emailAddress, password, isLoaded, signIn, setActive, router]
  );

  // Handle Google sign-in
  const handleGoogleSignin = useCallback(async () => {
    if (!isLoaded) return;
    try {
      const result = await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  }, [isLoaded, signIn]);

  // Handle Facebook sign-in
  const handleFacebookSignin = useCallback(async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      setError("Facebook sign-in failed. Please try again.");
    }
  }, [isLoaded, signIn]);

  // Handle OAuth callback (Google and Facebook)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!isLoaded) return;

      const status = searchParams.get("status");
      if (status === "complete") {
        const sessionId = signIn.createdSessionId;
        if (sessionId) {
          await setActive({ session: sessionId });
          router.push("/");
        }
      } else if (status === "failed") {
        setError("Social sign-in failed. Please try again.");
      }
    };

    if (searchParams.get("status")) {
      handleOAuthCallback();
    }
  }, [isLoaded, signIn, setActive, router, searchParams]);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingOutlined className="text-blue-400 text-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Image
              src="/logos/xai-logo.png"
              alt="siddha Logo"
              width={60}
              height={60}
              priority
            />
            Siddha AI
          </h1>
        </div>
        <div className="text-blue-500 text-center mb-6 font-bold text-2xl">
          Sign In To Your Account
        </div>
        <div className="space-y-3 flex flex-col justify-center items-center">
          <button
            onClick={handleFacebookSignin}
            className="w-full lg:w-3/4 py-2 px-4 border border-gray-800 rounded-md flex gap-3 items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Image
              src="/logos/facebook.png"
              alt="Facebook"
              width={25}
              height={25}
            />
            Continue with Facebook
          </button>
          <button
            onClick={handleGoogleSignin}
            className="w-full lg:w-3/4 py-2 px-4 border border-gray-800 rounded-md flex gap-3 items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Image
              src="/logos/google.png"
              alt="Google"
              width={25}
              height={25}
            />
            Continue with Google
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm text-gray-800">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 ${
                passwordError ? "top-1/3" : "top-1/2"
              } cursor-pointer text-gray-600 hover:text-gray-800`}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-2 px-4 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer"
        >
          {buttonLoading ? <LoadingOutlined /> : "Log in"}
        </button>
        <div className="mt-4 text-center">
          <p className="text-normal text-gray-600">
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to Siddha’s{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      <div className="fixed bottom-2 right-1/3 lg:right-6 text-sm lg:text-base">
        <p className=" text-black bg-clip-text font-mono tracking-tight">
          Powered by Techosa
        </p>
      </div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center">
          <LoadingOutlined className="text-blue-400 text-xl" />
        </div>
      }
    >
      <SigninContent />
    </Suspense>
  );
}
