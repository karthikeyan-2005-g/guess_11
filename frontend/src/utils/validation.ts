export function validateUserId(userId: string): string | null {
  if (!userId) return 'User ID is required';
  if (userId.length < 3) return 'User ID must be at least 3 characters';
  if (userId.length > 20) return 'User ID cannot exceed 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(userId)) return 'User ID can only contain letters, numbers, and underscores';
  return null;
}

export function validatePassword(password: string): { isValid: boolean; message?: string; strength: 'weak' | 'medium' | 'strong' } {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters', strength: 'weak' };
  }

  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 3 && password.length >= 10) {
    return { isValid: true, strength: 'strong' };
  } else if (score >= 2) {
    return { isValid: true, strength: 'medium' };
  } else {
    return { isValid: true, strength: 'weak' };
  }
}
