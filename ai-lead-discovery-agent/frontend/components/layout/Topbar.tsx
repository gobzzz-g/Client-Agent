'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, Search, X, Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topbar({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Lead Discovery Completed', desc: 'Found 12 new high-quality leads', time: '2m ago', read: false },
    { id: 2, title: 'Outreach Campaign Started', desc: 'Email sequence initiated for 5 clients', time: '15m ago', read: false },
    { id: 3, title: 'System Updated', desc: 'Successfully updated to version 2.1.0', time: '1h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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

      {/* ── Right actions (Premium Control Deck) ─────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="flex items-center p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative group">
          
          {/* Subtle sheen effect - scoped to rounded container */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Live System Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-emerald-100 uppercase drop-shadow-sm">Live</span>
          </div>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-white/10 mx-2" />

          {/* Command Search */}
          <button className="hidden md:flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors group/cmd">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover/cmd:text-brand-400 transition-colors" />
            <span className="opacity-80 group-hover/cmd:opacity-100">Command</span>
            <kbd className="hidden lg:inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-slate-400 group-hover/cmd:text-white group-hover/cmd:border-white/20 transition-all shadow-sm">
              ⌘K
            </kbd>
          </button>

          {/* Divider */}
          <div className="hidden md:block h-5 w-[1px] bg-white/10 mx-2" />

          {/* Icons Group */}
          <div className="flex items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-yellow-300 transition-colors active:scale-95 duration-200"
                title="Toggle theme"
              >
                {theme === 'dark' 
                  ? <Sun className="w-4 h-4 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" /> 
                  : <Moon className="w-4 h-4" />
                }
              </button>
            )}

            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-colors active:scale-95 duration-200 relative group/bell"
              >
                <Bell className="w-4 h-4 group-hover/bell:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-500 ring-2 ring-[#16162a] shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-4 w-80 bg-[#16162a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] text-brand-400 hover:text-brand-300 font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-xs">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-brand-500/5' : ''}`}>
                            <div className="flex items-start justify-between mb-1">
                              <span className={`text-xs font-medium ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</span>
                              <span className="text-[10px] text-slate-500">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{n.desc}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-white/5 bg-white/5 text-center">
                      <button className="text-[10px] text-slate-400 hover:text-white transition-colors">View all activity</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Avatar (Floating) */}
          <div className="pl-3 border-l border-white/10 ml-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-500 via-purple-500 to-pink-500 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-shadow duration-300 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full blur-xl opacity-50"></div>
              <div className="h-full w-full rounded-full bg-[#0f0f1a] flex items-center justify-center relative z-10">
                <span className="text-xs font-black bg-gradient-to-br from-brand-300 to-purple-300 bg-clip-text text-transparent">AI</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
