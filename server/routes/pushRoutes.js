
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Get public VAPID key
router.get("/public-key", (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});

// Save browser push subscription
router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const subscription = req.body;

    if (
      !subscription.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return res.status(400).json({
        message: "Invalid push subscription",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadySubscribed = user.pushSubscriptions.some(
      (item) => item.endpoint === subscription.endpoint
    );

    if (!alreadySubscribed) {
      user.pushSubscriptions.push(subscription);
      await user.save();
    }

    res.status(200).json({
      message: "Browser subscribed successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save subscription",
    });
  }
});

module.exports = router;
