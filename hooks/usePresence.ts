"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function usePresence() {
  const { user } = useUser();
  const setPresence = useMutation(api.users.setPresence);

  useEffect(() => {
    if (!user) return;

    setPresence({ isOnline: true });

    const handleVisibilityChange = () => {
      setPresence({ isOnline: !document.hidden });
    };
    // This part tracks when the user switches tabs. 
    // so when the user switch to another tab or minimize the browser,
    //we set their presence to offline, and when they come back we set it to online.
    //We also have a fallback interval that sets the user to online every 30 seconds if they are active, 
    //just in case the visibility change event doesn't fire for some reason.

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(() => {
      if (!document.hidden) {
        setPresence({ isOnline: true });
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      setPresence({ isOnline: false });
    };
  }, [user, setPresence]);
}