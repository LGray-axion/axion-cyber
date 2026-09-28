"use client";

import { useState } from "react";
import { getToken } from "firebase/messaging";
import { createClient } from "@/lib/supabase/client";
import { getFirebaseMessaging } from "@/lib/firebase";

export function NotificationButton() {
  const [status, setStatus] = useState<"idle" | "working" | "on" | "error">("idle");

  async function enableNotifications() {
    try {
      setStatus("working");
      if (!("Notification" in window) || !("serviceWorker" in navigator)) throw new Error("Notifications are not supported in this browser.");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted.");

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const messaging = await getFirebaseMessaging();
      if (!messaging) throw new Error("Firebase Messaging is not supported here.");

      const token = await getToken(messaging, {
        vapidKey: "BBIXNYpNBMnJ6138A8d2RzeTjwoBbZrVV7zULPyGMUwzgU3ldPbzMmVf29rCitt8OUWvaxow02ejJQPNN9W1MQA",
        serviceWorkerRegistration: registration,
      });
      if (!token) throw new Error("Firebase did not return a notification token.");

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in before enabling notifications.");

      const { error } = await supabase.from("push_subscriptions").upsert(
        { user_id: user.id, fcm_token: token, updated_at: new Date().toISOString() },
        { onConflict: "fcm_token" }
      );
      if (error) throw error;

      setStatus("on");
    } catch (error) {
      console.error("Axion notifications:", error);
      setStatus("error");
    }
  }

  return (
    <button
      type="button"
      onClick={enableNotifications}
      disabled={status === "working" || status === "on"}
      className="rounded-full border px-3 py-1.5 text-sm hover:bg-foreground/5 disabled:opacity-60"
      aria-label="Enable Axion security notifications"
    >
      {status === "on" ? "🔔 Alerts on" : status === "working" ? "Enabling…" : status === "error" ? "Retry alerts" : "Enable alerts"}
    </button>
  );
}
