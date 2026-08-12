import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import api from '../config/api';

export const HomeScreen = ({ onNavigateToQuestion, onNavigateToInterview, onNavigateToQuestionsTab, onNavigateToProfile }) => {
  const { user, refreshProfile } = useAuth();
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const fetchDailyQuestion = async () => {
    try {
      setLoadingDaily(true);
      const res = await api.get('/questions/daily');
      if (res.data) {
        setDailyQuestion(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch daily question:', err.message);
      setDailyQuestion({
        _id: 'default-daily',
        title: 'Two Sum & Target Array Search',
        difficulty: 'Easy',
        category: 'Arrays & Hash Maps',
        company: 'Google',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      });
    } finally {
      setLoadingDaily(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshProfile(), fetchDailyQuestion()]);
    setRefreshing(false);
  };

  const solvedCount = user?.solvedQuestions?.length || 0;
  const streakCount = user?.streak || 0;
  const rank = user?.rank || 'Top 15%';

  return (
    <View style={styles.container}>
      <Header
        title="DevPrep AI"
        subtitle={`Welcome, ${user?.name || 'Developer'} 👋`}
        onProfilePress={onNavigateToProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Streak Banner */}
        <View style={styles.streakBanner}>
          <View style={styles.streakFlameContainer}>
            <Text style={styles.streakFlame}>🔥</Text>
          </View>
          <View style={styles.streakTextWrapper}>
            <Text style={styles.streakTitle}>{streakCount} Day Streak Active!</Text>
            <Text style={styles.streakSubtitle}>Keep solving daily to level up your rank</Text>
          </View>
        </View>

        {/* Performance Metrics Row */}
        <Text style={styles.sectionHeader}>PERFORMANCE METRICS</Text>
        <View style={styles.statsRow}>
          <StatCard
            icon="⚡"
            label="SOLVED"
            value={String(solvedCount)}
            color={colors.success}
            sublabel="Problems"
          />
          <StatCard
            icon="🏆"
            label="RANK"
            value={rank}
            color={colors.primary}
            sublabel="Global"
          />
          <StatCard
            icon="🔥"
            label="STREAK"
            value={`${streakCount}d`}
            color={colors.warning}
            sublabel="Active"
          />
        </View>

        {/* Daily Challenge Card */}
        <Text style={styles.sectionHeader}>DAILY CHALLENGE</Text>
        {loadingDaily ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : dailyQuestion ? (
          <TouchableOpacity
            style={styles.dailyCard}
            onPress={() => onNavigateToQuestion(dailyQuestion)}
            activeOpacity={0.85}
          >
            <View style={styles.dailyTop}>
              <View style={styles.dailyBadgeRow}>
                <Badge label="TODAY'S PICK" variant="primary" />
                <Badge label={dailyQuestion.difficulty || 'Medium'} variant={dailyQuestion.difficulty || 'Medium'} />
              </View>
              <View style={styles.xpPillContainer}>
                <Text style={styles.xpPill}>+50 XP</Text>
              </View>
            </View>

            <Text style={styles.dailyTitle}>{dailyQuestion.title}</Text>
            <Text style={styles.dailyDesc} numberOfLines={2}>
              {dailyQuestion.description || 'Solve this curated challenge to maintain your daily streak and earn bonus leaderboard points.'}
            </Text>

            <View style={styles.dailyFooter}>
              {dailyQuestion.company ? (
                <View style={styles.companyBadge}>
                  <Text style={styles.companyText}>🏢 {dailyQuestion.company}</Text>
                </View>
              ) : <View />}

              <View style={styles.solveCta}>
                <Text style={styles.solveCtaText}>Solve Problem</Text>
                <Text style={styles.solveCtaArrow}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Quick Preparation Shortcuts */}
        <Text style={styles.sectionHeader}>QUICK PREPARATION</Text>
        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            style={[styles.shortcutCard, styles.shortcutCardInterview]}
            onPress={onNavigateToInterview}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconContainer, { backgroundColor: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.3)' }]}>
              <Text style={styles.shortcutIcon}>🎙️</Text>
            </View>
            <Text style={styles.shortcutTitle}>AI Mock Interview</Text>
            <Text style={styles.shortcutDesc}>Live conversational chat & evaluation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, styles.shortcutCardQuestions]}
            onPress={onNavigateToQuestionsTab}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.12)', borderColor: 'rgba(139, 92, 246, 0.3)' }]}>
              <Text style={styles.shortcutIcon}>📚</Text>
            </View>
            <Text style={styles.shortcutTitle}>Question Bank</Text>
            <Text style={styles.shortcutDesc}>Explore 300+ curated tech challenges</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 110, // Generous padding so last cards are never cut off by tab dock
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 14,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  streakFlameContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakFlame: {
    fontSize: 26,
  },
  streakTextWrapper: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  streakSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
  },
  dailyCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(6, 182, 212, 0.45)',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  dailyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  xpPillContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  xpPill: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '800',
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 24,
  },
  dailyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  dailyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
  },
  companyBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  companyText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  solveCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  solveCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  solveCtaArrow: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
  },
  shortcutCardInterview: {
    borderColor: 'rgba(6, 182, 212, 0.35)',
  },
  shortcutCardQuestions: {
    borderColor: 'rgba(139, 92, 246, 0.35)',
  },
  shortcutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shortcutIcon: {
    fontSize: 22,
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  shortcutDesc: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
