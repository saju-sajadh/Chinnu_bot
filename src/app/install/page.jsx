"use client";

import { usePWAInstall } from "@/libs/pwaInstall";

export default function InstallPage() {
  const { isInstallable, triggerInstall } = usePWAInstall();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-transparent p-4 flex items-center">
        <div className="flex items-center space-x-3">
          <img
            src="/logos/xai-logo.png"
            alt="Siddha.ai Logo"
            className="w-10 h-10 rounded-full border-2 border-blue-200"
          />
          <span className="text-xl font-semibold text-gray-800">Siddha.ai</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105">
          {/* App Icon/Logo */}
          <div className="mb-6">
            <img
              src="/logos/xai-logo.png"
              alt="App Icon"
              className="w-24 h-24 mx-auto rounded-full border-4 border-blue-200"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Install Our App
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            Get the best experience by adding our app to your home screen. Enjoy
            offline access and lightning-fast performance!
          </p>

          {/* Install Button or Status */}
          {isInstallable ? (
            <button
              onClick={triggerInstall}
              className="bg-gradient-to-br cursor-pointer from-yellow-300 via-pink-300 to-blue-300 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Add to Home Screen
            </button>
          ) : (
            <p className="text-gray-500 italic">
              App is not ready to install or already installed.
            </p>
          )}

          {/* Optional Footer */}
          <div className="mt-8 text-sm text-gray-400">
            <p>Available on iOS and Android</p>
          </div>
        </div>
      </div>
    </div>
  );
}