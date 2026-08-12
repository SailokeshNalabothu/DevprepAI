import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const Badge = ({ label, variant = 'default', style }) => {
  const getBadgeStyle = () => {
    switch (variant.toLowerCase()) {
      case 'easy':
        return { bg: colors.successBg, text: colors.success, border: colors.success };
      case 'medium':
        return { bg: colors.warningBg, text: colors.warning, border: colors.warning };
      case 'hard':
        return { bg: colors.dangerBg, text: colors.danger, border: colors.danger };
      case 'primary':
        return { bg: colors.primaryGlow, text: colors.primary, border: colors.primary };
      case 'secondary':
        return { bg: colors.secondaryGlow, text: colors.secondary, border: colors.secondary };
      default:
        return { bg: colors.surfaceLight, text: colors.textSecondary, border: colors.surfaceBorder };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }, style]}>
      <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
