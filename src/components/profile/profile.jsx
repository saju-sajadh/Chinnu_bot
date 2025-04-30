"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Typography, Button, Spin } from "antd";
import { doc, setDoc, _firestore } from "@/libs/firebase";
import { avatarOptions } from "@/libs/utils";

const { Title } = Typography;

export default function Profile({ isProfile, fName, lName, onClose }) {
  const [firstName, setFirstName] = useState(fName);
  const [lastName, setLastName] = useState(lName);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleSave = useCallback(async () => {
    if (!firstName) {
      setError("Enter your Firstname!");
      return;
    }
    if (!lastName) {
      setError("Enter your Lastname!");
      return;
    }
    setError("");
    if (!isLoaded || !user) return;
    setLoading(true);
    try {
      const userDocRef = doc(_firestore, "users", user.id);
      await setDoc(
        userDocRef,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          avatar: selectedAvatar,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      router.push("/");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, selectedAvatar, isLoaded, user, router]);

  const handleSkip = useCallback(() => {
    router.push("/");
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 ">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 transform transition-all max-h-[90vh] overflow-y-auto scroll-smooth custom-scrollbar">
      <div className="flex justify-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold flex items-center text-gray-800">
          <Image
            src="/logos/xai-logo.png"
            alt="Siddha Logo"
            width={40}
            height={40}
            priority
            className="mr-2 sm:w-12 sm:h-12 md:w-14 md:h-14"
          />
          Siddha
        </h1>
      </div>
      <Title
        level={4}
        className="text-center mb-6 sm:mb-8 text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold"
      >
        Create Your Profile
      </Title>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <label
              htmlFor="firstName"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full p-2 sm:p-3 border border-gray-200  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  transition-all bg-gray-50  text-gray-800 "
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="lastName"
              className="block text-xs sm:text-sm font-medium text-gray-700  mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full p-2 sm:p-3 border border-gray-200  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  transition-all bg-gray-50  text-gray-800 "
            />
          </div>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer rounded-full overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar
                    ? "border-blue-500 scale-105"
                    : "border-gray-200  hover:border-blue-300 "
                }`}
              >
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-4 sm:mt-6 text-center font-medium">
          {error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <Button
          onClick={handleSave}
          loading={loading}
          disabled={loading}
          className="w-full sm:flex-1 h-10 sm:h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700  transition-all font-medium text-sm sm:text-base"
        >
          Save Profile
        </Button>
        {!isProfile && (
          <Button
            onClick={onClose}
            className="w-full sm:flex-1 h-10 sm:h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700  transition-all font-medium text-sm sm:text-base"
          >
           close
          </Button>
        )}
      </div>
    </div>
  );
}
