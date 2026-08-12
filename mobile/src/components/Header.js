import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export const Header = ({ title, subtitle, showStreak = true, onStreakPress, onProfilePress }) => {
  const { user } = useAuth();
  const streak = user?.streak || 0;

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>{title || 'DevPrep AI'}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rightContainer}>
        {showStreak && (
          <TouchableOpacity style={styles.streakBadge} onPress={onStreakPress} activeOpacity={0.8}>
            <Text style={styles.flameIcon}>🔥</Text>
            <Text style={styles.streakText}>{streak}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress} activeOpacity={0.8}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 14 : 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
  },
  leftContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 3,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.6)',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  flameIcon: {
    fontSize: 15,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.warning,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.background,
  },
});
