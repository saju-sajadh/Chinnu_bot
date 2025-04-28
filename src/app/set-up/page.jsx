"use client";

import Profile from "@/components/profile/profile";
import React from "react";
import { useEffect } from "react";
import { _firestore, doc, getDoc, setDoc } from "@/libs/firebase";
import { useUser } from "@clerk/nextjs";

export default function SetUpPage() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const createUserDocument = async () => {
      if (!isLoaded || !user) return;
      try {
        const userDocRef = doc(_firestore, "users", user.id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) return;
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.emailAddresses[0].emailAddress || "",
            avatar: `/avatars/avatar${Math.floor(Math.random() * 29) + 1}.png`,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            createdAt: new Date(),
          });
        }
      } catch (err) {
        console.error("Error creating user document:", err);
      }
    };

    createUserDocument();
  }, [user, isLoaded]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Profile isProfile={false} fName={""} lName={""} />
    </div>
  );
}
