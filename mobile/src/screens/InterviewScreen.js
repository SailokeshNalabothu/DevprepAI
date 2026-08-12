import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { Header } from '../components/Header';
import api from '../config/api';

const ROLES = [
  { id: 'Fullstack', title: 'Fullstack Engineer', icon: '💻', desc: 'React, Node.js, DB architecture, REST APIs & problem solving' },
  { id: 'Frontend', title: 'Frontend Specialist', icon: '🎨', desc: 'Modern JavaScript, React, State Management, CSS & Web Vitals' },
  { id: 'Backend', title: 'Backend & Systems', icon: '⚙️', desc: 'Node.js, microservices, caching, concurrency & DB indexing' },
  { id: 'System Design', title: 'System Architecture', icon: '🏗️', desc: 'High scalability, distributed caches, sharding & load balancing' },
];

const EXPERIENCE_LEVELS = ['Junior (0-2 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'];

export const InterviewScreen = ({ onStartSession, onNavigateToProfile }) => {
  const [selectedRole, setSelectedRole] = useState('Fullstack');
  const [selectedExp, setSelectedExp] = useState('Mid-Level (3-5 yrs)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartInterview = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/interview/start', {
        topic: `${selectedRole} - ${selectedExp}`,
      });

      if (res.data && res.data._id) {
        onStartSession(res.data);
      } else {
        setError('Failed to initialize session. Please check backend connection.');
      }
    } catch (err) {
      console.warn('Interview start failed:', err.message);
      // Fallback session for offline demo
      onStartSession({
        _id: 'mock-session-' + Date.now(),
        topic: `${selectedRole} - ${selectedExp}`,
        chatHistory: [
          {
            role: 'interviewer',
            content: `Hello! I am your AI Technical Interviewer today. We will be conducting a mock interview for the **${selectedRole}** (${selectedExp}) role. Could you briefly introduce yourself and describe a recent complex project you architected?`,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="AI Mock Interview"
        subtitle="Real-time conversational practice"
        onProfilePress={onNavigateToProfile}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroIcon}>🎙️</Text>
          <Text style={styles.heroTitle}>Simulate Real Tech Interviews</Text>
          <Text style={styles.heroDesc}>
            Practice answering behavioral, architectural, and DSA questions with instant feedback and score rubrics from Gemini AI.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Domain Selection */}
        <Text style={styles.sectionTitle}>SELECT TARGET ROLE</Text>
        <View style={styles.rolesList}>
          {ROLES.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleCard, isSelected && styles.roleCardActive]}
                onPress={() => setSelectedRole(r.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.roleIcon}>{r.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.roleTitle, isSelected && styles.roleTitleActive]}>
                    {r.title}
                  </Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                </View>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Experience Level Selection */}
        <Text style={styles.sectionTitle}>EXPERIENCE SENIORITY</Text>
        <View style={styles.expRow}>
          {EXPERIENCE_LEVELS.map((lvl) => {
            const isSelected = selectedExp === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[styles.expPill, isSelected && styles.expPillActive]}
                onPress={() => setSelectedExp(lvl)}
                activeOpacity={0.8}
              >
                <Text style={[styles.expText, isSelected && styles.expTextActive]}>{lvl}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Launch Button */}
        <TouchableOpacity
          style={[styles.launchButton, loading && styles.buttonDisabled]}
          onPress={handleStartInterview}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <Text style={styles.launchButtonText}>Begin Interview Session</Text>
              <Text style={styles.launchArrow}>→</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  heroBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  heroIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  rolesList: {
    gap: 10,
    marginBottom: 24,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  roleTitleActive: {
    color: colors.primary,
  },
  roleDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  expRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  expPill: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  expPillActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryGlow,
  },
  expText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  expTextActive: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  launchButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  launchButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  launchArrow: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '800',
  },
});
