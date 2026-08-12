import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

// Screens
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { SignupScreen } from '../screens/Auth/SignupScreen';
import { OtpScreen } from '../screens/Auth/OtpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { QuestionsScreen } from '../screens/QuestionsScreen';
import { QuestionDetailScreen } from '../screens/QuestionDetailScreen';
import { InterviewScreen } from '../screens/InterviewScreen';
import { InterviewSessionScreen } from '../screens/InterviewSessionScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, loginWithToken } = useAuth();

  // Deep Link Listener for Mobile OAuth
  useEffect(() => {
    const handleUrl = (event) => {
      const url = event?.url || event;
      if (url && url.includes('oauth')) {
        const tokenMatch = url.match(/[?&]token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          loginWithToken(tokenMatch[1]);
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // Auth Sub-route state
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'signup' | 'otp'
  const [otpEmail, setOtpEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');

  // Main Tab state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'questions' | 'interview' | 'profile'

  // Modal / Detail state
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeInterviewSession, setActiveInterviewSession] = useState(null);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.splashLogoContainer}>
          <Text style={styles.splashLogo}>⚡</Text>
        </View>
        <Text style={styles.splashTitle}>DevPrep AI</Text>
        <Text style={styles.splashSubtitle}>Loading your workspace...</Text>
      </View>
    );
  }

  // 1. Unauthenticated Flow (Auth Stack)
  if (!isAuthenticated) {
    if (authScreen === 'signup') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <SignupScreen
            onNavigateToLogin={() => setAuthScreen('login')}
            onNavigateToOtp={(email, receivedOtp) => {
              setOtpEmail(email);
              if (receivedOtp) setDevOtp(receivedOtp);
              setAuthScreen('otp');
            }}
          />
        </SafeAreaView>
      );
    }

    if (authScreen === 'otp') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <OtpScreen
            email={otpEmail}
            devOtp={devOtp}
            onVerificationSuccess={() => setAuthScreen('login')}
            onBackToLogin={() => setAuthScreen('login')}
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <LoginScreen onNavigateToSignup={() => setAuthScreen('signup')} />
      </SafeAreaView>
    );
  }

  // 2. Question Detail View Modal
  if (selectedQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <QuestionDetailScreen
          question={selectedQuestion}
          onBack={() => setSelectedQuestion(null)}
          onStartInterviewWithQuestion={(q) => {
            setSelectedQuestion(null);
            setActiveInterviewSession({
              _id: 'session-' + Date.now(),
              topic: `${q.title} - ${q.difficulty}`,
              chatHistory: [
                {
                  role: 'interviewer',
                  content: `Welcome to your mock interview on **${q.title}**. Walk me through your high-level approach to solving this problem efficiently.`,
                },
              ],
            });
          }}
        />
      </SafeAreaView>
    );
  }

  // 3. Active AI Mock Interview Session Modal
  if (activeInterviewSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <InterviewSessionScreen
          sessionData={activeInterviewSession}
          onFinish={() => {
            setActiveInterviewSession(null);
            setActiveTab('home');
          }}
        />
      </SafeAreaView>
    );
  }

  // 4. Main Tab Navigation
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToQuestion={(q) => setSelectedQuestion(q)}
            onNavigateToInterview={() => setActiveTab('interview')}
            onNavigateToQuestionsTab={() => setActiveTab('questions')}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
      case 'questions':
        return (
          <QuestionsScreen
            onSelectQuestion={(q) => setSelectedQuestion(q)}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
      case 'interview':
        return (
          <InterviewScreen
            onStartSession={(session) => setActiveInterviewSession(session)}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Bottom Navigation Dock */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.75}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'questions' && styles.tabButtonActive]}
          onPress={() => setActiveTab('questions')}
          activeOpacity={0.75}
        >
          <Text style={styles.tabIcon}>📚</Text>
          <Text style={[styles.tabLabel, activeTab === 'questions' && styles.tabLabelActive]}>Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'interview' && styles.tabButtonActive]}
          onPress={() => setActiveTab('interview')}
          activeOpacity={0.75}
        >
          <Text style={styles.tabIcon}>🎙️</Text>
          <Text style={[styles.tabLabel, activeTab === 'interview' && styles.tabLabelActive]}>AI Prep</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.75}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  splashLogo: {
    fontSize: 40,
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 6,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 17, 32, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 12 : 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
