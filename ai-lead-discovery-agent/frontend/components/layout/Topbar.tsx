'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Topbar({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: 'rgba(15,15,26,0.8)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}>

      {/* ── Page title ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold text-white">{title ?? 'Dashboard'}</h1>
        <p className="text-xs text-slate-500">AI Lead Discovery Platform</p>
      </div>

      {/* ── Right actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-ghost w-9 h-9 rounded-xl flex items-center justify-center"
            title="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 text-yellow-400" />
              : <Moon className="w-4 h-4 text-slate-400" />
            }
          </button>
        )}

        {/* Notifications */}
        <button className="btn-ghost w-9 h-9 rounded-xl flex items-center justify-center relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
          style={{ boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
          AI
        </div>
      </div>
    </header>
  );
}
