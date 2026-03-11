'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, Check, Settings as SettingsIcon, Key, Palette, Info } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState('');
  const [serperKey, setSerperKey] = useState('');
  const [showGemini, setShowGemini] = useState(false);
  const [showSerper, setShowSerper] = useState(false);
  const [saved, setSaved] = useState(false);
  const [senderName, setSenderName] = useState('Alex');
  const [senderCompany, setSenderCompany] = useState('Your Company');

  const handleSave = () => {
    // Save to localStorage for demo purposes
    // In production, these would be sent to the backend
    if (typeof window !== 'undefined') {
      localStorage.setItem('senderName', senderName);
      localStorage.setItem('senderCompany', senderCompany);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Settings" />

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">

        {/* ── API Keys ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">API Keys</h3>
                <p className="text-xs text-slate-500">Configure your AI and search API keys</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showGemini ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="AIza..."
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                  />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowGemini(v => !v)}>
                    {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Get your free key at{' '}
                  <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                    aistudio.google.com
                  </a>
                </p>
              </div>

              <div>
                <label className="label">Serper.dev API Key (Search)</label>
                <div className="relative">
                  <input
                    type={showSerper ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="Your Serper API key"
                    value={serperKey}
                    onChange={e => setSerperKey(e.target.value)}
                  />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowSerper(v => !v)}>
                    {showSerper ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Get 2500 free searches/month at{' '}
                  <a href="https://serper.dev" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                    serper.dev
                  </a>
                </p>
              </div>

              <div className="rounded-xl p-4 bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-300 leading-relaxed">
                    API keys should be configured in the backend <code className="bg-white/10 px-1 rounded">.env</code> file for security. This UI shows how they can be managed in a production app with proper backend secret storage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Email Defaults ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                <SettingsIcon className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Email Defaults</h3>
                <p className="text-xs text-slate-500">Used for AI-generated outreach emails</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Your Name</label>
                <input className="input" placeholder="Alex" value={senderName} onChange={e => setSenderName(e.target.value)} />
              </div>
              <div>
                <label className="label">Your Company</label>
                <input className="input" placeholder="Your Company Name" value={senderCompany} onChange={e => setSenderCompany(e.target.value)} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── About ────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="card border border-brand-500/20" style={{ background: 'rgba(99,102,241,0.04)' }}>
            <h3 className="font-semibold text-white mb-3">About AI Lead Discovery Agent</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between"><span>Version</span><span className="text-slate-200">1.0.0</span></div>
              <div className="flex justify-between"><span>AI Engine</span><span className="text-slate-200">Google Gemini 1.5 Flash</span></div>
              <div className="flex justify-between"><span>Scraper</span><span className="text-slate-200">Playwright + BeautifulSoup</span></div>
              <div className="flex justify-between"><span>Search</span><span className="text-slate-200">Serper.dev</span></div>
              <div className="flex justify-between"><span>Database</span><span className="text-slate-200">SQLite (default)</span></div>
              <div className="flex justify-between"><span>Frontend</span><span className="text-slate-200">Next.js 14 + TailwindCSS</span></div>
              <div className="flex justify-between"><span>Backend</span><span className="text-slate-200">FastAPI (Python)</span></div>
            </div>
          </div>
        </motion.div>

        {/* ── Save ─────────────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary">
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
          </button>
        </div>

      </div>
    </div>
  );
}
