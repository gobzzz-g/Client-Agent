/**
 * API client — Axios instance configured for the FastAPI backend.
 * All API calls go through this module.
 */

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s for long discovery requests
  headers: { 'Content-Type': 'application/json' },
});

// ── Lead Types ──────────────────────────────────────────────────────────────

export interface Lead {
  id: number;
  company_name: string;
  website: string;
  contact_info: { emails?: string[]; phones?: string[]; social?: Record<string, string> };
  description: string;
  tech_signals: string[];
  industry: string;
  location: string;
  service_query: string;
  lead_type: 'client' | 'competitor' | 'partner';
  score: number;
  opportunity: string;
  ai_explanation: string;
  outreach_email: string;
  status: 'new' | 'qualified' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  total_leads: number;
  high_quality_leads: number;
  avg_score: number;
  industry_breakdown: Record<string, number>;
  score_distribution: Record<string, number>;
  opportunity_distribution: Record<string, number>;
  top_opportunities: string[];
}

export interface DiscoveryResponse {
  message: string;
  leads_discovered: number;
  leads: Lead[];
}

// ── API Methods ─────────────────────────────────────────────────────────────

export const leadsApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<Lead[]>('/leads', { params }),

  getById: (id: number) =>
    api.get<Lead>(`/leads/${id}`),

  getAnalytics: () =>
    api.get<Analytics>('/leads/analytics'),

  updateStatus: (id: number, status: string) =>
    api.patch(`/leads/${id}/status`, null, { params: { status } }),

  delete: (id: number) =>
    api.delete(`/leads/${id}`),
};

export const discoveryApi = {
  discover: (data: { industry: string; location: string; service: string; max_results?: number }) =>
    api.post<DiscoveryResponse>('/discover', data),
};

export const emailApi = {
  generate: (data: {
    lead_id: number;
    sender_name?: string;
    sender_company?: string;
    product_description?: string;
  }) => api.post<{ lead_id: number; subject: string; body: string }>('/email/generate', data),
};

export const exportUrl = {
  csv:   `${API_BASE}/export/csv`,
  excel: `${API_BASE}/export/excel`,
  json:  `${API_BASE}/export/json`,
};
