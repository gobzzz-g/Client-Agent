'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, TrendingUp, Star, Zap, ArrowUpRight, Loader2,
  ExternalLink, Target
} from 'lucide-react';
import Link from 'next/link';
import Topbar from '@/components/layout/Topbar';
import { leadsApi, type Analytics, type Lead } from '@/lib/api';
import { getScoreColor, getScoreLabel, truncate, formatDate } from '@/lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
  }),
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, leadsRes] = await Promise.all([
          leadsApi.getAnalytics(),
          leadsApi.getAll({ sort_by: 'created_at', sort_order: 'desc', limit: 5 }),
        ]);
        setAnalytics(analyticsRes.data);
        setRecentLeads(leadsRes.data);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const industryData = analytics
    ? Object.entries(analytics.industry_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const scoreData = analytics
    ? Object.entries(analytics.score_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const statCards = [
    {
      label: 'Total Leads',
      value: analytics?.total_leads ?? 0,
      icon: Users,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      change: '+12%',
    },
    {
      label: 'High Quality Leads',
      value: analytics?.high_quality_leads ?? 0,
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      change: '+8%',
    },
    {
      label: 'Avg Lead Score',
      value: analytics ? `${analytics.avg_score}` : '0',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      change: '+5%',
    },
    {
      label: 'Top Opportunities',
      value: analytics?.top_opportunities.length ?? 0,
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      change: 'AI Powered',
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">

        {/* ── Welcome banner ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #16162a 60%, #0f1629 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          <div className="absolute right-6 top-6 opacity-10">
            <Target className="w-32 h-32 text-brand-400" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-3 py-1 text-xs text-brand-300 mb-3">
              <Zap className="w-3 h-3" />
              AI-Powered Lead Discovery
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Welcome back! 👋
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Your AI sales agent has discovered and scored {analytics?.total_leads ?? 0} business leads.
            </p>
            <Link href="/discovery" className="btn-primary text-sm">
              <Zap className="w-4 h-4" />
              Discover New Leads
            </Link>
          </div>
        </motion.div>

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <div className={`card border ${card.border}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className="text-xs text-green-400 font-medium">{card.change}</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                <p className="text-sm text-slate-400">{card.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Charts row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Score Distribution Bar Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="card h-full">
              <h3 className="text-base font-semibold text-white mb-4">Lead Score Distribution</h3>
              {scoreData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scoreData} barSize={40}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 12, color: '#f1f5f9' }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]}>
                      {scoreData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
                  No data yet — discover some leads!
                </div>
              )}
            </div>
          </motion.div>

          {/* Industry Breakdown Pie Chart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <div className="card h-full">
              <h3 className="text-base font-semibold text-white mb-4">Industry Breakdown</h3>
              {industryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={industryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {industryData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 12, color: '#f1f5f9' }}
                    />
                    <Legend formatter={(v) => <span className="text-slate-400 text-xs">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
                  No data yet — discover some leads!
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Recent Leads ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Recent Leads</h3>
              <Link href="/leads" className="btn-ghost text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="table-th">Company</th>
                    <th className="table-th">Industry</th>
                    <th className="table-th">Score</th>
                    <th className="table-th">Opportunity</th>
                    <th className="table-th">Added</th>
                    <th className="table-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="table-row">
                      <td className="table-td font-medium text-white">{lead.company_name}</td>
                      <td className="table-td text-slate-400">{lead.industry || '—'}</td>
                      <td className="table-td">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getScoreColor(lead.score)}`}>
                          {lead.score} — {getScoreLabel(lead.score)}
                        </span>
                      </td>
                      <td className="table-td text-slate-400">{truncate(lead.opportunity, 50)}</td>
                      <td className="table-td text-slate-500">{formatDate(lead.created_at)}</td>
                      <td className="table-td">
                        <Link href={`/leads/${lead.id}`} className="btn-ghost p-1.5 rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {recentLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
                        No leads yet. <Link href="/discovery" className="text-brand-400 hover:underline">Discover leads →</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ── AI Insights ──────────────────────────────────────────────── */}
        {analytics && analytics.top_opportunities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="card border border-brand-500/20" style={{ background: 'rgba(99,102,241,0.05)' }}>
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-400" /> Top AI-Identified Opportunities
              </h3>
              <div className="space-y-2">
                {analytics.top_opportunities.map((opp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3">
                    <span className="w-6 h-6 rounded-lg bg-brand-600/30 text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300">{opp}</p>
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
