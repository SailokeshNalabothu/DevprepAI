# 📱 DevPrep AI Mobile App (React Native + Expo)

DevPrep AI Mobile is the companion mobile app for DevPrep AI, connecting directly to your existing **Node.js/Express backend** and **MongoDB database**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Backend API Endpoint
Open `src/config/api.js`:
- **Testing on Web / iOS Simulator**: Uses `http://localhost:5000`
- **Testing on Android Emulator**: Uses `http://10.0.2.2:5000`
- **Testing on Physical Phone via Expo Go (Same Wi-Fi)**: Set your PC's local Wi-Fi IP:
  ```javascript
  export const API_BASE_URL = 'http://192.168.1.15:5000'; // Replace with your PC IP (ipconfig)
  ```

### 3. Start Expo Bundler
```bash
npx expo start
```
* Scan the displayed QR code with the **Expo Go** app on your Android or iPhone camera to run the app live with hot reload.

---

## ✨ Features Included

1. **🔐 Shared Authentication Flow**:
   - Log in with your existing DevPrep AI web credentials.
   - Signup with 6-digit email OTP verification.
   - Hardware-encrypted session persistence via `@react-native-async-storage/async-storage`.

2. **🏠 Home Dashboard**:
   - Live daily streak counter with animated badge.
   - Solved problem counts, global ranking, and XP breakdown.
   - Dynamic Daily Challenge card with direct problem launcher.

3. **📚 Question Bank & Quizzes**:
   - 300+ problem catalog with instant search.
   - Company filters (*Google, Meta, Amazon, Microsoft*) and Difficulty badges (*Easy, Medium, Hard*).
   - Problem detail view with Markdown descriptions, code examples, and collapsible hints.
   - Interactive Theory Concept Quizzes with instant answer checking.

4. **🎙️ AI Mock Interview Engine**:
   - Role selection: *Fullstack, Frontend, Backend, System Design*.
   - Seniority levels: *Junior, Mid-Level, Senior*.
   - Interactive conversational chat with Gemini AI.
   - Live session timer, turn-by-turn context tracking.
   - Comprehensive Feedback Report with scoring rubrics (Technical Accuracy, Communication, Architecture) and hiring recommendation.

5. **👤 Profile & Academic Management**:
   - Sequential Enrollment ID display (`#YYYY####`).
   - Bio, college, and profile editor syncing directly with MongoDB (`PUT /api/users/profile`).
   - One-tap logout and session cleanup.
