import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Badge } from './Badge';

export const QuestionCard = ({ question, onPress, isSolved }) => {
  const { title, difficulty, company, category, tags } = question;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <Badge label={difficulty || 'Medium'} variant={difficulty || 'Medium'} />
          {category && (
            <Badge label={category} variant="default" style={styles.categoryBadge} />
          )}
        </View>
        {isSolved && (
          <View style={styles.solvedPill}>
            <Text style={styles.solvedCheck}>✓</Text>
            <Text style={styles.solvedText}>Solved</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      <View style={styles.bottomRow}>
        {company ? (
          <View style={styles.companyPill}>
            <Text style={styles.companyIcon}>🏢</Text>
            <Text style={styles.companyText}>{company}</Text>
          </View>
        ) : null}

        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.slice(0, 2).map((tag, idx) => (
              <Text key={idx} style={styles.tagText}>#{tag}</Text>
            ))}
          </View>
        )}

        <Text style={styles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    borderColor: 'transparent',
    backgroundColor: colors.surfaceLight,
  },
  solvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    borderColor: colors.success,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  solvedCheck: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  solvedText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  companyIcon: {
    fontSize: 11,
  },
  companyText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  arrowIcon: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
});
