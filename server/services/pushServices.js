const webpush = require("web-push");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("Push notification error:", error.message);

    if (error.statusCode === 404 || error.statusCode === 410) {
      return false;
    }

    throw error;
  }

  return true;
};

module.exports = { sendPushNotification };