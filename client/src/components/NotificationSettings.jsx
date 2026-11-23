
import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const enableNotifications = async () => {
    try {
      setLoading(true);

      if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        toast.error("Browser notifications are not supported.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Please allow browser notifications.");
        return;
      }

      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );

      const keyResponse = await API.get("/push/public-key");
      const publicKey = keyResponse.data.publicKey;

      if (!publicKey) {
        throw new Error("VAPID public key is missing.");
      }

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(publicKey),
        });
      }

      await API.post(
        "/push/subscribe",
        subscription.toJSON()
      );

      setEnabled(true);
      toast.success("Browser notifications enabled!");
    } catch (error) {
      console.error("Notification error:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Could not enable notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-settings">
      <div>
        <h3>Deadline Notifications</h3>
        <p>
          Receive browser notifications for upcoming task deadlines.
        </p>
      </div>

      <button
        onClick={enableNotifications}
        disabled={loading || enabled}
      >
        {loading
          ? "Enabling..."
          : enabled
          ? "Notifications Enabled"
          : "Enable Notifications"}
      </button>
    </div>
  );
}

export default NotificationSettings;
