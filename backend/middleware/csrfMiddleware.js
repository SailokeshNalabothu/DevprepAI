/**
 * CSRF Protection Middleware
 * Verifies that the Origin or Referer of state-changing HTTP requests
 * matches allowed origins (including mobile apps and local IP testing).
 */
module.exports = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

  // Native mobile app requests (no browser origin header) or matching allowed origins
  if (!origin && !referer) {
    return next();
  }

  const isLocalIp = (urlStr) => {
    if (!urlStr) return false;
    return urlStr.includes("localhost") || 
           urlStr.includes("127.0.0.1") || 
           urlStr.includes("10.") || 
           urlStr.includes("192.168.");
  };

  // 1. Origin header check
  if (origin && origin !== allowedOrigin && !isLocalIp(origin)) {
    console.warn(`[CSRF Alert] Rejected request from invalid origin: ${origin}`);
    return res.status(403).json({ message: "CSRF protection: Invalid origin" });
  }

  // 2. Referer header fallback check
  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      const allowedUrl = new URL(allowedOrigin);
      if (refererUrl.origin !== allowedUrl.origin && !isLocalIp(refererUrl.origin)) {
        console.warn(`[CSRF Alert] Rejected request from invalid referer: ${refererUrl.origin}`);
        return res.status(403).json({ message: "CSRF protection: Invalid referer origin" });
      }
    } catch (e) {
      console.warn(`[CSRF Alert] Rejected request due to malformed referer: ${referer}`);
      return res.status(403).json({ message: "CSRF protection: Malformed referer" });
    }
  }

  next();
};
