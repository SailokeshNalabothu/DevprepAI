/**
 * DevPrep AI Design System Color Tokens (Dark Obsidian & Neon Accents)
 */

export const colors = {
  // Backgrounds
  background: '#090d16',
  surface: '#0f172a',
  surfaceLight: '#1e293b',
  surfaceBorder: '#334155',
  card: '#111827',
  cardHover: '#1f2937',

  // Brand Accents
  primary: '#06b6d4',       // Cyan Neon
  primaryGlow: 'rgba(6, 182, 212, 0.25)',
  secondary: '#8b5cf6',     // Purple Accent
  secondaryGlow: 'rgba(139, 92, 246, 0.25)',
  accent: '#38bdf8',

  // Status & Feedback
  success: '#10b981',       // Emerald (Easy / Accepted)
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: '#f59e0b',       // Amber (Medium / Streak)
  warningBg: 'rgba(245, 158, 11, 0.15)',
  danger: '#ef4444',        // Red (Hard / Error)
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  info: '#3b82f6',

  // Text Hierarchy
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDark: '#0f172a',

  // Navigation
  tabBar: '#0b1120',
  tabActive: '#06b6d4',
  tabInactive: '#64748b',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 14, color: colors.textSecondary },
  caption: { fontSize: 12, color: colors.textMuted },
  mono: { fontFamily: 'Courier', fontSize: 13 },
};
