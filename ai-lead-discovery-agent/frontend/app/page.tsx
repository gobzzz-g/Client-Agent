'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import {
  Users, TrendingUp, Star, Zap, ArrowUpRight, Loader2,
  ExternalLink, Target
} from 'lucide-react';
import Link from 'next/link';
import Topbar from '@/components/layout/Topbar';
import { leadsApi, type Analytics, type Lead } from '@/lib/api';
import { getScoreColor, getScoreLabel, truncate, formatDate } from '@/lib/utils';

const COLORS = ['#00d4ff', '#a855f7', '#00e5a0', '#f5a623', '#ff6b9d'];
const INDUSTRY_COLORS_MAP: Record<string, string> = {
  Technology: '#00d4ff', // Cyan
  Healthcare: '#a855f7', // Purple
  Finance: '#00e5a0',    // Green
  Retail: '#f5a623',     // Orange
  Other: '#ff6b9d',      // Pink
};
const DEFAULT_COLOR = '#ff6b9d';

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

  const totalLeadsCount = industryData.reduce((acc, curr) => acc + curr.value, 0);

  const scoreData = analytics
    ? Object.entries(analytics.score_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const statCards = [
    {
      label: 'Total Leads',
      value: analytics?.total_leads ?? 0,
      accentColor: '#00d4ff', // Cyan
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
      accentColor: '#00e5a0', // Green
      change: '+5%',
      subtext: 'improving trend'
    },
    {
      label: 'Top Opportunities',
      value: analytics?.top_opportunities.length ?? 0,
      accentColor: '#f5a623', // Orange
      change: '+3',
      subtext: 'AI identified'
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
          </div>
        </motion.div>

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
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

        {/* ── Charts row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Score Distribution Bar Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="rounded-xl p-6 bg-surface-card h-full flex flex-col justify-between">
              <h3 className="text-base font-semibold text-white mb-6">Lead Score Distribution</h3>
              
              {scoreData.length > 0 ? (
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
                      <Bar dataKey="value" fill="#00d4ff" fillOpacity={0.7} barSize={20} radius={[4, 4, 0, 0]}>
                        {scoreData.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Bar>
                      <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#a855f7' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                 <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">
                  No data yet — discover some leads!
                </div>
              )}
            </div>
          </motion.div>

          {/* Industry Breakdown Donut Chart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <div className="rounded-xl p-6 bg-surface-card h-full relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">Industry Breakdown</h3>
                <div className="flex items-center gap-1.5">
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]"></span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Live</span>
                </div>
              </div>

              {industryData.length > 0 ? (
                <div className="relative flex-1 min-h-[250px] flex flex-col items-center justify-center">
                  <div className="relative w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          innerRadius="65%"
                          outerRadius="90%"
                          dataKey="value"
                          nameKey="name"
                          paddingAngle={5}
                          stroke="none"
                        >
                          {industryData.map((entry, idx) => (
                            <Cell 
                              key={`cell-${idx}`} 
                              fill={INDUSTRY_COLORS_MAP[entry.name] || DEFAULT_COLOR} 
                            />
                          ))}
                        </Pie>
                         <Tooltip
                          contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 12, color: '#f1f5f9' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-white">100%</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Total Leads</span>
                    </div>
                  </div>

                  {/* Custom Legend Below */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 w-full max-w-[80%]">
                    {industryData.map((entry) => {
                       const color = INDUSTRY_COLORS_MAP[entry.name] || DEFAULT_COLOR;
                       const percent = totalLeadsCount > 0 ? Math.round((entry.value / totalLeadsCount) * 100) : 0;
                       return (
                         <div key={entry.name} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                             <span className="text-slate-400">{entry.name}</span>
                           </div>
                           <span className="font-bold text-white">{percent}%</span>
                         </div>
                       );
                    })}
                  </div>

                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">
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
