"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Typography } from "antd";
import { _firestore, doc, getDoc, setDoc } from "@/libs/firebase";

// Child component containing useSearchParams
function SignupContent() {
  const { Title } = Typography;
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
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

  // Handle email/password signup
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
        await signUp.create({ emailAddress, password });
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setPendingVerification(true);
        setError("");
      } catch (err) {
        setError(err.errors?.[0]?.message || "An error occurred");
      } finally {
        setButtonLoading(false);
      }
    },
    [emailAddress, password, isLoaded, signUp]
  );

  // Handle email verification
  const handleVerify = useCallback(
    async (event) => {
      event.preventDefault();
      if (!isLoaded) return;
      setVerificationLoading(true);

      try {
        const attempt = await signUp.attemptEmailAddressVerification({ code });
        if (attempt.status === "complete") {
          const userDocRef = doc(_firestore, "users", attempt.createdUserId);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: emailAddress,
              avatar: `/avatars/avatar${Math.floor(Math.random() * 29) + 1}.png`,
              firstName: "",
              lastName: "",
              createdAt: new Date(),
            });
          }
          await setActive({ session: attempt.createdSessionId });
          router.push("/set-up");
        } else {
          setError("Verification failed");
        }
      } catch (err) {
        setError("Incorrect verification code" || "An error occurred");
      } finally {
        setVerificationLoading(false);
      }
    },
    [code, isLoaded, signUp, setActive, router, emailAddress]
  );

  // Handle Google signup
  const handleGoogleSignup = useCallback(async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/set-up",
      });
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
    }
  }, [isLoaded, signUp]);

  // Handle Facebook signup
  const handleFacebookSignup = useCallback(async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/set-up",
      });
    } catch (err) {
      setError("Facebook sign-up failed. Please try again.");
    }
  }, [isLoaded, signUp]);


  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!isLoaded) return;

      const status = searchParams.get("status");
      if (status === "complete") {
        const userId = signUp.createdUserId;
        if (userId) {
          const userDocRef = doc(_firestore, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: signUp.emailAddress || "",
              avatar: `/avatar${Math.floor(Math.random() * 29) + 1}.png`,
              firstName: signUp.firstName || "",
              lastName: signUp.lastName || "",
              createdAt: new Date(),
            });
          }
          await setActive({ session: signUp.createdSessionId });
          router.push("/set-up");
        }
      } else if (status === "failed") {
        setError("Social sign-up failed. Please try again.");
      }
    };

    if (searchParams.get("status")) {
      handleOAuthCallback();
    }
  }, [isLoaded, signUp, setActive, router, searchParams]);

  const handleCodeChange = (text) => {
    setCode(text.toUpperCase());
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingOutlined className="text-blue-400 text-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
      {!pendingVerification ? (
        <div className="w-full max-w-md p-6">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <Image
                src="/logos/xai-logo.png"
                alt="Siddha Logo"
                width={60}
                height={60}
                priority
              />
              Siddha AI
            </h1>
          </div>
          <div className="text-blue-500 text-center mb-6 font-bold text-2xl">Sign Up To Get Started</div>
          <div className="space-y-3 flex flex-col justify-center items-center">
            <button
              onClick={handleGoogleSignup}
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
            <button
              onClick={handleFacebookSignup}
              className="w-full lg:w-3/4 py-2 px-4 border border-gray-800 rounded-md flex gap-3 items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src="/logos/facebook.png"
                alt="Facebook"
                width={25}
                height={25}
              />
              Continue with FaceBook
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
          <div id="clerk-captcha" className="mt-2"></div>
          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-2 px-4 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            {buttonLoading ? <LoadingOutlined /> : "Sign Up"}
          </button>
          <div className="mt-4 text-center">
            <p className="text-normal text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500 hover:underline">
                Log in
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
      ) : (
        <div className="w-full max-w-md p-6">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-3xl font-bold flex items-center">
              <Image
                src="/logos/xai-logo.png"
                alt="Siddha Logo"
                width={55}
                height={55}
                priority
              />
              Siddha
            </h1>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Title className="text-center" level={5}>
              Enter Verification Code
            </Title>
            <Input.OTP
              length={6}
              formatter={(str) => str.replace(/[^0-9]/g, "")}
              onChange={handleCodeChange}
              size="large"
              value={code}
            />
            <button
              onClick={handleVerify}
              className="w-full py-2 px-4 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              {verificationLoading ? <LoadingOutlined /> : "Verify"}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      )}
      <div className="fixed bottom-2 right-1/3 lg:right-6 text-sm lg:text-base">
        <p className=" text-black bg-clip-text font-mono tracking-tight">
          Powered by Techosa
        </p>
      </div>
    </div>
  );
}


export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center">
          <LoadingOutlined className="text-blue-400 text-xl" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}