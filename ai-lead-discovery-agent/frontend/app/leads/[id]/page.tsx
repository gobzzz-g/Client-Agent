'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Globe, Mail, Phone, Zap, Copy, Check,
  Loader2, AlertCircle, Star, Target, ChevronRight,
  Sparkles, MessageSquare
} from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { leadsApi, emailApi, type Lead } from '@/lib/api';
import { getScoreColor, getScoreLabel, getStatusClass } from '@/lib/utils';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Email generation state
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState('Alex');
  const [senderCompany, setSenderCompany] = useState('Your Company');

  // Status update
  const [status, setStatus] = useState('new');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await leadsApi.getById(Number(id));
        setLead(res.data);
        setStatus(res.data.status);
        if (res.data.outreach_email) {
          const parts = res.data.outreach_email.split('\n\n');
          setEmail({
            subject: parts[0]?.replace('Subject: ', '') ?? '',
            body: parts.slice(1).join('\n\n'),
          });
        }
      } catch {
        setError('Lead not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await leadsApi.updateStatus(Number(id), newStatus);
  };

  const handleGenerateEmail = async () => {
    setEmailLoading(true);
    try {
      const res = await emailApi.generate({
        lead_id: Number(id),
        sender_name: senderName,
        sender_company: senderCompany,
        product_description: lead?.service_query ?? '',
      });
      setEmail({ subject: res.data.subject, body: res.data.body });
    } catch (e) {
      console.error('Email generation failed:', e);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-400">{error}</p>
        <button onClick={() => router.push('/leads')} className="btn-secondary">← Back to leads</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title={lead.company_name} />

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">

        {/* ── Back + Status ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/leads')} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <select
            value={status}
            onChange={e => handleStatusChange(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium border cursor-pointer ${getStatusClass(status)}`}
            style={{ background: 'var(--bg-card)' }}
          >
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column: Profile ──────────────────────────────────── */}
          <div className="space-y-4">

            {/* Company Profile */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                    {lead.company_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg leading-tight">{lead.company_name}</h2>
                    <a href={lead.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {lead.website.replace(/^https?:\/\//, '').slice(0, 30)}
                    </a>
                  </div>
                </div>

                {/* Score badge */}
                <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${getScoreColor(lead.score)}`}>
                  <Star className="w-4 h-4" />
                  <span className="font-bold text-lg">{lead.score}</span>
                  <span className="text-sm">{getScoreLabel(lead.score)}</span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">{lead.description || 'No description available.'}</p>

                <div className="mt-4 space-y-2">
                  {lead.industry && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Target className="w-4 h-4 text-brand-400" />
                      Industry: <span className="text-slate-200">{lead.industry}</span>
                    </div>
                  )}
                  {lead.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      📍 Location: <span className="text-slate-200">{lead.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="card">
                <h3 className="font-semibold text-white mb-3 text-sm">Contact Info</h3>
                {lead.contact_info?.emails?.length ? (
                  lead.contact_info.emails.map(e => (
                    <div key={e} className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <a href={`mailto:${e}`} className="hover:text-brand-400">{e}</a>
                    </div>
                  ))
                ) : <p className="text-slate-500 text-sm">No email found</p>}

                {lead.contact_info?.phones?.map(p => (
                  <div key={p} className="flex items-center gap-2 text-sm text-slate-300 mt-2">
                    <Phone className="w-4 h-4 text-slate-500" />{p}
                  </div>
                ))}

                {lead.contact_info?.social && Object.entries(lead.contact_info.social).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(lead.contact_info.social).map(([k, v]) => (
                      <a key={k} href={v as string} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-brand-300 capitalize">
                        {k}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tech Signals */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="card">
                <h3 className="font-semibold text-white mb-3 text-sm">Tech Signals</h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tech_signals?.length ? lead.tech_signals.map(sig => (
                    <span key={sig} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${sig.startsWith('No') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-500/10 text-brand-300 border border-brand-500/20'}`}>
                      {sig}
                    </span>
                  )) : <p className="text-slate-500 text-sm">No signals detected</p>}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right column: AI Analysis + Email ────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* AI Analysis */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="card border border-brand-500/20" style={{ background: 'rgba(99,102,241,0.05)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  <h3 className="font-semibold text-white">AI Analysis</h3>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Opportunity</p>
                  <p className="text-brand-300 font-semibold">{lead.opportunity || 'No opportunity identified'}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">AI Explanation</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{lead.ai_explanation || 'No AI analysis available.'}</p>
                </div>
              </div>
            </motion.div>

            {/* Email Generator */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">AI Email Generator</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="label">Your Name</label>
                    <input className="input" placeholder="Alex" value={senderName} onChange={e => setSenderName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Your Company</label>
                    <input className="input" placeholder="Your Company" value={senderCompany} onChange={e => setSenderCompany(e.target.value)} />
                  </div>
                </div>

                <button onClick={handleGenerateEmail} className="btn-primary w-full mb-4" disabled={emailLoading}>
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {emailLoading ? 'Generating...' : 'Generate Personalized Email'}
                </button>

                <AnimatePresence>
                  {email && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="rounded-xl border p-4 space-y-3" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Subject</p>
                          <p className="text-white font-medium text-sm">{email.subject}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Body</p>
                          <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{email.body}</pre>
                        </div>
                        <button onClick={handleCopy} className="btn-secondary w-full">
                          {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Email</>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
