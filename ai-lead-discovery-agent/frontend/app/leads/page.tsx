'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Download, Trash2, ExternalLink,
  ChevronUp, ChevronDown, Loader2, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Topbar from '@/components/layout/Topbar';
import { leadsApi, exportUrl, type Lead } from '@/lib/api';
import { getScoreColor, getScoreLabel, getStatusClass, truncate, formatDate } from '@/lib/utils';

type SortKey = 'score' | 'company_name' | 'created_at';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [minScore, setMinScore] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { sort_by: sortBy, sort_order: sortOrder };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (minScore) params.min_score = Number(minScore);
      const res = await leadsApi.getAll(params);
      setLeads(res.data);
    } catch {
      console.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, minScore, sortBy, sortOrder]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this lead?')) return;
    await leadsApi.delete(id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortBy !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="w-3 h-3 text-brand-400" />
      : <ChevronDown className="w-3 h-3 text-brand-400" />;
  };

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Lead Database" />

      <div className="flex-1 p-6 space-y-4">

        {/* ── Controls ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="input pl-9"
              placeholder="Search companies, opportunities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <select
            className="input w-40"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>

          {/* Min score */}
          <input
            className="input w-36"
            type="number"
            placeholder="Min score"
            min={0}
            max={100}
            value={minScore}
            onChange={e => setMinScore(e.target.value)}
          />

          <button onClick={fetchLeads} className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Exports */}
          <div className="flex gap-2">
            <a href={exportUrl.csv} className="btn-secondary text-xs" download>
              <Download className="w-3.5 h-3.5" /> CSV
            </a>
            <a href={exportUrl.excel} className="btn-secondary text-xs" download>
              <Download className="w-3.5 h-3.5" /> Excel
            </a>
            <a href={exportUrl.json} className="btn-secondary text-xs" download>
              <Download className="w-3.5 h-3.5" /> JSON
            </a>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────────────── */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th className="table-th cursor-pointer" onClick={() => handleSort('company_name')}>
                    <div className="flex items-center gap-1">Company <SortIcon col="company_name" /></div>
                  </th>
                  <th className="table-th">Website</th>
                  <th className="table-th cursor-pointer" onClick={() => handleSort('score')}>
                    <div className="flex items-center gap-1">Score <SortIcon col="score" /></div>
                  </th>
                  <th className="table-th">Opportunity</th>
                  <th className="table-th">Status</th>
                  <th className="table-th cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center gap-1">Added <SortIcon col="created_at" /></div>
                  </th>
                  <th className="table-th"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <Loader2 className="w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">Loading leads...</p>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <p className="text-slate-400 text-sm">No leads found.</p>
                      <Link href="/discovery" className="text-brand-400 hover:underline text-sm">Discover leads →</Link>
                    </td>
                  </tr>
                ) : leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="table-row"
                  >
                    <td className="table-td font-semibold text-white">{lead.company_name}</td>
                    <td className="table-td">
                      <a href={lead.website} target="_blank" rel="noopener noreferrer"
                        className="text-brand-400 hover:text-brand-300 text-xs truncate max-w-[140px] block">
                        {lead.website.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="table-td text-slate-400 max-w-[220px]">
                      {truncate(lead.opportunity, 55)}
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${getStatusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="table-td text-slate-500">{formatDate(lead.created_at)}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-1">
                        <Link href={`/leads/${lead.id}`} className="btn-ghost p-1.5 rounded-lg" title="View details">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(lead.id)} className="btn-danger p-1.5 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leads.length > 0 && (
            <div className="px-4 py-3 border-t text-sm text-slate-500" style={{ borderColor: 'var(--border)' }}>
              Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
