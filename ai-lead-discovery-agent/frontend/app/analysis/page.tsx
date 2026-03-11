'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';
import { Brain, TrendingUp, Zap, Target, Loader2 } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { leadsApi, type Analytics } from '@/lib/api';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed'];

export default function AnalysisPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsApi.getAnalytics().then(r => setAnalytics(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const scoreData = analytics
    ? Object.entries(analytics.score_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const industryData = analytics
    ? Object.entries(analytics.industry_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const radarData = [
    { subject: 'Hot Leads',   A: analytics?.high_quality_leads ?? 0 },
    { subject: 'Total Leads', A: analytics?.total_leads ?? 0 },
    { subject: 'Avg Score',   A: analytics?.avg_score ?? 0 },
    { subject: 'Industries',  A: Object.keys(analytics?.industry_breakdown ?? {}).length },
    { subject: 'Opportunities', A: analytics?.top_opportunities.length ?? 0 },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="AI Analysis" />

      <div className="flex-1 p-6 space-y-6">

        {/* ── Summary row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Total Analyzed', value: analytics?.total_leads ?? 0, icon: Brain, color: 'text-brand-400' },
            { label: 'High Quality (70+)', value: analytics?.high_quality_leads ?? 0, icon: TrendingUp, color: 'text-green-400' },
            { label: 'Avg Score', value: analytics?.avg_score ?? 0, icon: Target, color: 'text-yellow-400' },
            { label: 'Opportunities', value: analytics?.top_opportunities.length ?? 0, icon: Zap, color: 'text-purple-400' },
          ].map((item, i) => (
            <motion.div key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <div className="card flex items-center gap-4">
                <item.icon className={`w-8 h-8 ${item.color}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Charts ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreData} barSize={44}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 12, color: '#f1f5f9' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]}>
                    {scoreData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-4">Leads Overview Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2a45" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar name="Leads" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ── Industry Breakdown ────────────────────────────────────────── */}
        {industryData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="card">
              <h3 className="text-base font-semibold text-white mb-4">Industry Breakdown</h3>
              <div className="space-y-3">
                {industryData.sort((a, b) => b.value - a.value).map((item, i) => {
                  const max = Math.max(...industryData.map(d => d.value));
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <p className="text-sm text-slate-300 w-32 flex-shrink-0">{item.name}</p>
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-brand-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / max) * 100}%` }}
                          transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 w-8 text-right">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Top Opportunities ─────────────────────────────────────────── */}
        {analytics?.top_opportunities && analytics.top_opportunities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="card border border-brand-500/20" style={{ background: 'rgba(99,102,241,0.04)' }}>
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-400" /> AI-Identified Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analytics.top_opportunities.map((opp, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
                    <span className="w-7 h-7 rounded-lg bg-brand-600/30 text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">{opp}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
