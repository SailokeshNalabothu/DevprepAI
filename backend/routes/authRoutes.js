const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { signup, login, logout, verifyOTP, refreshToken, forgotPassword, resetPassword } = require("../controllers/authController");

// Rate limiter for Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // allow dev and mobile testing
  message: "Too many requests from this IP, please try again after 15 minutes"
});

router.post("/signup", authLimiter, signup);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

// Google OAuth Initial Route
router.get("/google", (req, res, next) => {
  const state = req.query.platform || req.query.state || "web";
  passport.authenticate("google", { scope: ["profile", "email"], state })(req, res, next);
});

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/auth-failed" }),
  async (req, res) => {
    const jwt = require("jsonwebtoken");
    const user = req.user;
    
    // Check if maintenance mode is active
    const Settings = require("../models/Settings");
    const settings = await Settings.findOne();
    let isMaintenanceActive = false;
    if (settings && settings.maintenanceMode) {
      const now = new Date();
      const start = settings.maintenanceStartDate ? new Date(settings.maintenanceStartDate) : null;
      const end = settings.maintenanceEndDate ? new Date(settings.maintenanceEndDate) : null;
      if ((!start || now >= start) && (!end || now <= end)) {
        isMaintenanceActive = true;
      }
    }

    if (isMaintenanceActive && user.email.toLowerCase() !== "sailokeshnalabothu@gmail.com") {
      return res.send("<h3>Maintenance Mode is Active</h3>");
    }
    
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "15m" }
    );

    const refreshTokenToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || "refreshsecret",
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshTokenToken;
    await user.save();

    // Set secure cookies
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshTokenToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // 1. Mobile App OAuth Redirect (if requested by mobile client)
    if (req.query.state === "mobile" || req.query.platform === "mobile") {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>DevPrep AI - Google Authenticated</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background: #090d16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
            .card { background: #0f172a; border: 1.5px solid #06b6d4; padding: 32px 24px; border-radius: 20px; box-shadow: 0 10px 40px rgba(6, 182, 212, 0.2); max-width: 360px; width: 100%; }
            .icon { font-size: 40px; margin-bottom: 12px; }
            h2 { color: #f8fafc; font-size: 20px; margin: 0 0 8px 0; font-weight: 800; }
            p { color: #94a3b8; font-size: 13px; margin: 0 0 24px 0; line-height: 1.5; }
            .btn { display: block; background: #06b6d4; color: #090d16; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px; border-radius: 12px; transition: opacity 0.2s; }
            .btn:active { opacity: 0.8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">⚡</div>
            <h2>Google Sign-in Successful!</h2>
            <p>Tap the button below to return to DevPrep AI Mobile App.</p>
            <a href="devprep://oauth?token=${accessToken}" class="btn">Open DevPrep AI App</a>
          </div>
          <script>
            window.location.href = "devprep://oauth?token=${accessToken}";
          </script>
        </body>
        </html>
      `);
    }

    // 2. Web Browser OAuth: Redirect directly to Dashboard on Laptop
    return res.redirect(`${frontendUrl}/dashboard`);
  }
);

router.get("/auth-failed", (req, res) => {
  res.status(401).send("<h3>Google Authentication Failed</h3>");
});

module.exports = router;