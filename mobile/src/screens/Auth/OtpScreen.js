import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export const OtpScreen = ({ email, devOtp, onVerificationSuccess, onBackToLogin }) => {
  const [otp, setOtp] = useState(devOtp || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { verifyOtp } = useAuth();

  const handleVerify = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setError('');
    setLoading(true);

    const res = await verifyOtp(email, otp.trim());
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Email verified successfully! You can now log in.');
      setTimeout(() => {
        onVerificationSuccess();
      }, 1500);
    } else {
      setError(res.message || 'Invalid or expired OTP code.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to <Text style={styles.emailText}>{email}</Text>
          </Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {successMsg ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>✓ {successMsg}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.otpInput}
              placeholder="123456"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify & Proceed</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  emailText: {
    color: colors.primary,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  successText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
