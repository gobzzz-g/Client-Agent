'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Brain, TrendingUp, Zap, Target, Loader2 } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { leadsApi, type Analytics } from '@/lib/api';

const COLORS = ['#0affff', '#a855f7', '#10b981', '#f59e0b', '#ecfeff']; // Fixed multi-color palette
const INDUSTRY_COLORS_MAP: Record<string, string> = {
  Technology: '#0affff',
  Healthcare: '#a855f7',
  Finance: '#10b981',
  Retail: '#f59e0b',
  Other: '#94a3b8',
};
const DEFAULT_COLOR = '#6366f1';

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
  
  const totalLeadsCount = industryData.reduce((acc, curr) => acc + curr.value, 0);

  const radarData = [
    { subject: 'Hot Leads',   A: analytics?.high_quality_leads ?? 0 },
    { subject: 'Total Leads', A: analytics?.total_leads ?? 0 },
    { subject: 'Avg Score',   A: analytics?.avg_score ?? 0 },
    { subject: 'Industries',  A: Object.keys(analytics?.industry_breakdown ?? {}).length },
    { subject: 'Opportunities', A: analytics?.top_opportunities.length ?? 0 },
  ];

  const statCards = [
    {
      label: 'Total Leads',
      value: analytics?.total_leads ?? 0,
      accentColor: '#0affff', // Cyan
      change: '+12%',
      subtext: 'avg. +2 leads'
    },
    {
      label: 'High Quality Leads',
      value: analytics?.high_quality_leads ?? 0,
      accentColor: '#a855f7', // Purple
      change: '+8%',
      subtext: 'vs. last month'
    },
    {
      label: 'Avg Lead Score',
      value: analytics ? `${analytics.avg_score}` : '0',
      accentColor: '#10b981', // Green
      change: '+5%',
      subtext: 'improving trend'
    },
    {
      label: 'Top Opportunities',
      value: analytics?.top_opportunities.length ?? 0,
      accentColor: '#f97316', // Orange
      change: '+3',
      subtext: 'AI identified'
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="AI Analysis" />

      <div className="flex-1 p-6 space-y-6">

        {/* ── Summary row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} custom={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <div
                className="rounded-xl p-5 relative bg-surface-card h-full flex flex-col justify-between"
                style={{ borderBottom: `3px solid ${card.accentColor}`, boxShadow: 'none' }}
              >
                <div>
                  <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-1 opacity-70">{card.label}</p>
                  <p className="text-4xl font-bold text-white mb-2">{card.value}</p>
                </div>
                <div>
                  <span className="text-sm font-bold block" style={{ color: card.accentColor }}>{card.change}</span>
                  <span className="text-[11px] text-slate-500">{card.subtext}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Charts ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-xl p-6 bg-surface-card h-full flex flex-col justify-between">
              <h3 className="text-base font-semibold text-white mb-6">Score Distribution</h3>
              <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 11 }} 
                      axisLine={false} 
                      tickLine={false} 
                      dy={10} 
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 11 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip
                      contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 12, color: '#f1f5f9' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="value" fillOpacity={0.7} barSize={20} radius={[4, 4, 0, 0]}>
                      {scoreData.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                    <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#a855f7' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div className="rounded-xl p-6 bg-surface-card h-full">
              <h3 className="text-base font-semibold text-white mb-4">Leads Overview Radar</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar name="Leads" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 12, color: '#f1f5f9' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

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
