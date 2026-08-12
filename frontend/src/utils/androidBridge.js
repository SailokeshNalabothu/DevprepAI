/**
 * Utility for communicating with the ScrollOrStudy Android parent application
 * via the native JavaScript Bridge (window.AndroidBridge).
 */

/**
 * Notifies the parent ScrollOrStudy Android app when a problem or challenge is solved.
 * @param {number} credits - Number of credits earned (default: 25)
 * @param {string} problemTitle - Title of the problem, quiz, or challenge
 */
export function sendRewardToAndroidApp(credits = 25, problemTitle = "Coding Challenge") {
  if (typeof window !== "undefined" && window.AndroidBridge) {
    try {
      window.AndroidBridge.onProblemSolved(credits, problemTitle);
      console.log(`[ScrollOrStudy Bridge] Awarded ${credits} credits for: ${problemTitle}`);
    } catch (err) {
      console.error("[ScrollOrStudy Bridge] Error invoking onProblemSolved:", err);
    }
  }
}

/**
 * Checks if the website is currently running inside the ScrollOrStudy Android app.
 * @returns {boolean}
 */
export function isRunningInScrollOrStudyApp() {
  return typeof window !== "undefined" && Boolean(window.AndroidBridge);
}

/**
 * Closes the in-app WebView and returns the student to the ScrollOrStudy dashboard.
 */
export function closeToStudyApp() {
  if (typeof window !== "undefined" && window.AndroidBridge) {
    try {
      window.AndroidBridge.closePractice();
    } catch (err) {
      console.error("[ScrollOrStudy Bridge] Error invoking closePractice:", err);
    }
  }
}
