import Profile from "@/components/profile/profile";
import React from "react";

export default function SetUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Profile isProfile={false} fName={""} lName={""}/>
    </div>
  );
}
