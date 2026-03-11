/**
 * Utility helper functions
 */

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getScoreColor(score: number) {
  if (score >= 80) return 'score-hot';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-warm';
  return 'score-cold';
}

export function getScoreLabel(score: number) {
  if (score >= 80) return '🔥 Hot';
  if (score >= 60) return '✅ Good';
  if (score >= 40) return '🟡 Warm';
  return '❄️ Cold';
}

export function getStatusClass(status: string) {
  const map: Record<string, string> = {
    new: 'status-new',
    qualified: 'status-qualified',
    contacted: 'status-contacted',
    closed: 'status-closed',
  };
  return map[status] ?? 'status-new';
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}
