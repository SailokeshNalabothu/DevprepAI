import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import api from '../config/api';

export const ProfileScreen = ({ onNavigateToSettings }) => {
  const { user, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [summary, setSummary] = useState(user?.summary || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name,
        college,
        summary,
      });

      if (res.data) {
        setUser(res.data);
        setIsEditing(false);
        Alert.alert('Success', 'Your profile has been updated.');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const solvedCount = user?.solvedQuestions?.length || 0;
  const streakCount = user?.streak || 0;
  const enrollmentId = user?.enrollmentId || '20260001';

  return (
    <View style={styles.container}>
      <Header title="My Profile" showStreak={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
            </Text>
          </View>

          <Text style={styles.userName}>{user?.name || 'Developer'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'developer@devprep.ai'}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.enrollmentPill}>
              <Text style={styles.enrollmentLabel}>ENROLLMENT ID</Text>
              <Text style={styles.enrollmentValue}>#{enrollmentId}</Text>
            </View>
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>{user?.role || 'Candidate'}</Text>
            </View>
          </View>
        </View>

        {/* Stats Summary */}
        <Text style={styles.sectionTitle}>PROGRESS SUMMARY</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="⚡" label="Solved" value={String(solvedCount)} color={colors.success} />
          <StatCard icon="🔥" label="Streak" value={`${streakCount}d`} color={colors.warning} />
          <StatCard icon="💎" label="XP" value="1,250" color={colors.secondary} />
        </View>

        {/* Profile Details / Edit Section */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>ACADEMIC & PROFESSIONAL</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editLink}>{isEditing ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>COLLEGE / UNIVERSITY</Text>
              <TextInput
                style={styles.input}
                value={college}
                onChangeText={setCollege}
                placeholder="e.g. Stanford University"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>BIO / SUMMARY</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={summary}
                onChangeText={setSummary}
                placeholder="Brief developer bio..."
                placeholderTextColor={colors.textMuted}
                multiline
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Institution</Text>
                <Text style={styles.infoValue}>{user?.college || 'Not specified'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Summary</Text>
                <Text style={styles.infoValue}>
                  {user?.summary || 'Preparing for Tier-1 Tech Interviews.'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarLargeText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  enrollmentPill: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollmentLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
  },
  enrollmentValue: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 1,
  },
  rolePill: {
    backgroundColor: colors.secondaryGlow,
    borderColor: colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  editLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  editForm: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '800',
  },
});
