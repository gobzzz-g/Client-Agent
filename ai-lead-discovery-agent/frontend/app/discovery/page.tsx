'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Topbar from '@/components/layout/Topbar';
import { discoveryApi, type Lead } from '@/lib/api';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

export default function DiscoveryPage() {
  const [form, setForm] = useState({ industry: '', location: '', service: '', max_results: 10 });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[] | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');

  const steps = [
    'Searching the web for matching businesses...',
    'Scraping company websites...',
    'Running AI analysis on each lead...',
    'Scoring leads based on signals...',
    'Saving to database...',
  ];

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.industry || !form.location || !form.service) {
      setError('Please fill in all three fields.');
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);

    // Animate through steps
    let stepIdx = 0;
    const interval = setInterval(() => {
      setStep(steps[stepIdx % steps.length]);
      stepIdx++;
    }, 2500);

    try {
      const res = await discoveryApi.discover(form);
      clearInterval(interval);
      setResults(res.data.leads);
      setStep('');
    } catch (err: any) {
      clearInterval(interval);
      setError(err?.response?.data?.detail ?? 'Discovery failed. Make sure the backend is running.');
      setStep('');
    } finally {
      setLoading(false);
    }
  };

  const industryExamples = ['Restaurants', 'Hotels', 'Dental Clinics', 'Real Estate', 'E-commerce', 'Law Firms'];
  const serviceExamples = ['AI chatbot automation', 'CRM software', 'Digital marketing', 'Website redesign'];

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Lead Discovery" />

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-white mb-1">Discover Business Leads</h2>
          <p className="text-slate-400 text-sm">
            AI searches the web, scrapes company sites, and scores leads based on business opportunity.
          </p>
        </motion.div>

        {/* ── Search Form ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card border border-brand-500/20">
            <form onSubmit={handleDiscover} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="label">Industry *</label>
                  <input
                    className="input"
                    placeholder="e.g. Restaurants"
                    value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    disabled={loading}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {industryExamples.map(ex => (
                      <button key={ex} type="button"
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-brand-500/20 hover:text-brand-300 transition-all"
                        onClick={() => setForm(f => ({ ...f, industry: ex }))}>
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Location *</label>
                  <input
                    className="input"
                    placeholder="e.g. Mumbai, India"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="label">Product / Service *</label>
                  <input
                    className="input"
                    placeholder="e.g. AI chatbot automation"
                    value={form.service}
                    onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    disabled={loading}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {serviceExamples.map(ex => (
                      <button key={ex} type="button"
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-brand-500/20 hover:text-brand-300 transition-all"
                        onClick={() => setForm(f => ({ ...f, service: ex }))}>
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="label mb-0">Max results:</label>
                  <select
                    className="input w-24 py-2"
                    value={form.max_results}
                    onChange={e => setForm(f => ({ ...f, max_results: parseInt(e.target.value) }))}
                    disabled={loading}
                  >
                    {[5, 10, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {loading ? 'Discovering...' : 'Discover Leads'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ── Progress indicator ────────────────────────────────────────── */}
        <AnimatePresence>
          {loading && step && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="card border border-brand-500/30 flex items-center gap-4"
              style={{ background: 'rgba(99,102,241,0.07)' }}
            >
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-brand-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Pipeline Running</p>
                <p className="text-xs text-slate-400">{step}</p>
              </div>
              <div className="ml-auto">
                <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {results !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">
                  Found {results.length} leads
                </h3>
                <Link href="/leads" className="btn-secondary text-xs ml-auto">
                  View all in Lead Database →
                </Link>
              </div>

              <div className="space-y-3">
                {results.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div className="card-hover flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-white">{lead.company_name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score} · {getScoreLabel(lead.score)}
                          </span>
                        </div>
                        <p className="text-xs text-brand-400 mb-1">{lead.website}</p>
                        <p className="text-sm text-slate-400 line-clamp-2">{lead.opportunity}</p>
                      </div>
                      <Link href={`/leads/${lead.id}`} className="btn-ghost flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
