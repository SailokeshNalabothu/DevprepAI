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
import { Badge } from '../components/Badge';

export const QuestionDetailScreen = ({ question, onBack, onStartInterviewWithQuestion }) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!question) return null;

  // Sample multiple choice quiz fallback
  const quizOptions = [
    { id: 'A', text: 'Use a Hash Map for O(N) time and O(N) space complexity.', isCorrect: true },
    { id: 'B', text: 'Sort the array first with O(N log N) time and use two pointers.', isCorrect: false },
    { id: 'C', text: 'Brute force double nested loop with O(N^2) time complexity.', isCorrect: false },
    { id: 'D', text: 'Recursive depth first search with exponential time.', isCorrect: false },
  ];

  const handleQuizSubmit = () => {
    if (selectedQuizOption !== null) {
      setQuizSubmitted(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Questions</Text>
        </TouchableOpacity>
        <Badge label={question.difficulty || 'Medium'} variant={question.difficulty || 'Medium'} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title & Metadata */}
        <Text style={styles.title}>{question.title}</Text>

        <View style={styles.metaRow}>
          {question.company && (
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>🏢 {question.company}</Text>
            </View>
          )}
          {question.category && (
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>🏷️ {question.category}</Text>
            </View>
          )}
        </View>

        {/* Problem Description */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>PROBLEM DESCRIPTION</Text>
          <Text style={styles.bodyText}>{question.description || 'No description provided.'}</Text>
        </View>

        {/* Examples */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>EXAMPLE 1</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>Input: nums = [2,7,11,15], target = 9</Text>
            <Text style={styles.codeText}>Output: [0,1]</Text>
            <Text style={styles.codeText}>Explanation: nums[0] + nums[1] == 9, return [0, 1].</Text>
          </View>
        </View>

        {/* Interactive Theory Quiz Mode */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>💡 CONCEPT QUIZ: OPTIMAL APPROACH</Text>
          <Text style={styles.quizQuestion}>
            What is the optimal algorithmic strategy to solve this challenge?
          </Text>

          {quizOptions.map((opt) => {
            const isSelected = selectedQuizOption === opt.id;
            let optionCardStyle = styles.quizOption;

            if (isSelected) {
              optionCardStyle = [styles.quizOption, styles.quizOptionSelected];
            }
            if (quizSubmitted) {
              if (opt.isCorrect) {
                optionCardStyle = [styles.quizOption, styles.quizOptionCorrect];
              } else if (isSelected && !opt.isCorrect) {
                optionCardStyle = [styles.quizOption, styles.quizOptionIncorrect];
              }
            }

            return (
              <TouchableOpacity
                key={opt.id}
                style={optionCardStyle}
                onPress={() => !quizSubmitted && setSelectedQuizOption(opt.id)}
                activeOpacity={0.8}
                disabled={quizSubmitted}
              >
                <Text style={styles.optionLetter}>{opt.id}</Text>
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            );
          })}

          {!quizSubmitted ? (
            <TouchableOpacity
              style={[styles.submitQuizButton, selectedQuizOption === null && styles.buttonDisabled]}
              onPress={handleQuizSubmit}
              disabled={selectedQuizOption === null}
            >
              <Text style={styles.submitQuizText}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quizFeedback}>
              <Text style={styles.feedbackTitle}>
                {selectedQuizOption === 'A' ? '🎉 Correct Strategy!' : '❌ Sub-optimal Strategy'}
              </Text>
              <Text style={styles.feedbackDesc}>
                Using a Hash Map enables single-pass lookup in O(1) average time, reducing overall complexity to O(N).
              </Text>
            </View>
          )}
        </View>

        {/* Hint Accordion */}
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => setShowHint(!showHint)}
          activeOpacity={0.8}
        >
          <Text style={styles.accordionTitle}>💡 Hint 1: Data Structures</Text>
          <Text style={styles.accordionArrow}>{showHint ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showHint && (
          <View style={styles.accordionBody}>
            <Text style={styles.accordionContent}>
              Can you store previous numbers in a hash map as you iterate through the list to check for complements in O(1) time?
            </Text>
          </View>
        )}

        {/* Mock Interview CTA */}
        <TouchableOpacity
          style={styles.interviewCta}
          onPress={() => onStartInterviewWithQuestion(question)}
          activeOpacity={0.85}
        >
          <Text style={styles.interviewCtaIcon}>🎙️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.interviewCtaTitle}>Start AI Mock Interview</Text>
            <Text style={styles.interviewCtaSubtitle}>
              Practice this question live with the AI interviewer
            </Text>
          </View>
          <Text style={styles.interviewCtaArrow}>→</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backArrow: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '800',
  },
  backText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  metaPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  codeBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: colors.primary,
    lineHeight: 18,
  },
  quizQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  quizOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  quizOptionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  quizOptionIncorrect: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    width: 24,
  },
  optionText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  submitQuizButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitQuizText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
  quizFeedback: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  feedbackDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warning,
  },
  accordionArrow: {
    color: colors.warning,
    fontSize: 12,
  },
  accordionBody: {
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 16,
  },
  accordionContent: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  interviewCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.secondary,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    gap: 14,
    marginTop: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  interviewCtaIcon: {
    fontSize: 28,
  },
  interviewCtaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  interviewCtaSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  interviewCtaArrow: {
    fontSize: 20,
    color: colors.secondary,
    fontWeight: '800',
  },
});
