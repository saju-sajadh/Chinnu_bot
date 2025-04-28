'use client'

import { useState, useEffect } from "react";

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
  
    useEffect(() => {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };
  
      window.addEventListener("beforeinstallprompt", handler);
  
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }, []);
  
    const triggerInstall = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    };
  
    return { isInstallable, triggerInstall };
  };