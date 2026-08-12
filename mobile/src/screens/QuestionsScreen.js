import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { QuestionCard } from '../components/QuestionCard';
import api from '../config/api';

const FILTER_TAGS = ['All', 'Easy', 'Medium', 'Hard', 'Google', 'Amazon', 'Microsoft', 'System Design'];

export const QuestionsScreen = ({ onSelectQuestion, onNavigateToProfile }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/questions');
      if (res.data && Array.isArray(res.data)) {
        setQuestions(res.data);
      } else if (res.data && res.data.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.warn('Failed to fetch questions:', err.message);
      // Fallback seeded dataset for immediate offline testing
      setQuestions([
        {
          _id: 'q1',
          title: 'Two Sum',
          difficulty: 'Easy',
          category: 'Arrays & Hashing',
          company: 'Google',
          tags: ['Array', 'Hash Table'],
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        },
        {
          _id: 'q2',
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          category: 'Sliding Window',
          company: 'Amazon',
          tags: ['String', 'Sliding Window'],
          description: 'Given a string s, find the length of the longest substring without repeating characters.',
        },
        {
          _id: 'q3',
          title: 'Design a Distributed Rate Limiter',
          difficulty: 'Hard',
          category: 'System Design',
          company: 'Meta',
          tags: ['Redis', 'Concurrency'],
          description: 'Design a scalable rate limiter that can handle 100K QPS with sliding window log algorithm.',
        },
        {
          _id: 'q4',
          title: 'LRU Cache Implementation',
          difficulty: 'Medium',
          category: 'Data Structures',
          company: 'Microsoft',
          tags: ['Hash Table', 'Doubly Linked List'],
          description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        },
        {
          _id: 'q5',
          title: 'Trapping Rain Water',
          difficulty: 'Hard',
          category: 'Two Pointers',
          company: 'Google',
          tags: ['Two Pointers', 'Stack'],
          description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuestions();
    setRefreshing(false);
  };

  // Filter & Search Logic
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      (q.title && q.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.category && q.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.company && q.company.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Easy' || activeFilter === 'Medium' || activeFilter === 'Hard') {
      return q.difficulty && q.difficulty.toLowerCase() === activeFilter.toLowerCase();
    }
    if (activeFilter === 'System Design') {
      return q.category && q.category.toLowerCase().includes('system');
    }
    return q.company && q.company.toLowerCase() === activeFilter.toLowerCase();
  });

  const solvedIds = user?.solvedQuestions || [];

  return (
    <View style={styles.container}>
      <Header
        title="Question Bank"
        subtitle={`${filteredQuestions.length} challenges available`}
        onProfilePress={onNavigateToProfile}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search problems, topics, companies..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterScrollWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTER_TAGS}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => {
              const isActive = activeFilter === item;
              return (
                <TouchableOpacity
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setActiveFilter(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Question List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading challenges...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredQuestions}
            keyExtractor={(item, index) => item._id || String(index)}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            renderItem={({ item }) => (
              <QuestionCard
                question={item}
                isSolved={solvedIds.includes(item._id)}
                onPress={() => onSelectQuestion(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📂</Text>
                <Text style={styles.emptyTitle}>No Questions Found</Text>
                <Text style={styles.emptySubtitle}>
                  Try clearing your search query or selecting a different filter.
                </Text>
                <TouchableOpacity
                  style={styles.resetFilterButton}
                  onPress={() => {
                    setSearchQuery('');
                    setActiveFilter('All');
                  }}
                >
                  <Text style={styles.resetFilterText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  clearSearch: {
    fontSize: 16,
    color: colors.textMuted,
    padding: 4,
  },
  filterScrollWrapper: {
    marginBottom: 12,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.background,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 110,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  resetFilterButton: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetFilterText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
