'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Database,
  Brain,
  Settings,
  Zap,
  ChevronRight,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',           label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/discovery',  label: 'Lead Discovery', icon: Search },
  { href: '/leads',      label: 'Lead Database',  icon: Database },
  { href: '/analysis',   label: 'AI Analysis',    icon: Brain },
  { href: '/settings',   label: 'Settings',       icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-30"
      style={{ backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">AI Lead Agent</p>
          <p className="text-xs text-slate-500">Discovery Platform</p>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Main Menu
        </p>

        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={cn('sidebar-link', active && 'active')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="px-4 pb-5">
        <div className="rounded-xl p-4 bg-brand-600/10 border border-brand-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold text-brand-300">AI Powered</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Powered by Gemini AI for intelligent lead scoring & analysis.
          </p>
        </div>
      </div>
    </aside>
  );
}
