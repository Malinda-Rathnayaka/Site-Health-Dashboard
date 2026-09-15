import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SiteFormModal from '../components/SiteFormModal.jsx';
import {
  Activity, Globe, Search, Plus, ExternalLink,
  Trash2, Edit3, ShieldAlert, CheckCircle2, AlertTriangle, LogOut,
  Clock, UserCheck, RefreshCw, Filter, Server, BarChart3, Zap,
} from 'lucide-react';

const PAGE_SIZE = 8;

const STATUS_STYLES = {
  healthy: {
    label: 'Operational',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    iconBorder: 'border-emerald-500/30',
    glow: 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]',
    activeRing: 'border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] ring-1 ring-emerald-500/40',
    tint: 'from-emerald-500/10',
    dot: 'bg-emerald-400 ring-4 ring-emerald-500/20',
  },
  warning: {
    label: 'Degraded',
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    iconBorder: 'border-amber-500/30',
    glow: 'shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)]',
    activeRing: 'border-amber-500/50 shadow-[0_0_40px_-10px_rgba(245,158,11,0.6)] ring-1 ring-amber-500/40',
    tint: 'from-amber-500/10',
    dot: 'bg-amber-400 ring-4 ring-amber-500/20',
  },
  critical: {
    label: 'Critical',
    icon: ShieldAlert,
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    iconBorder: 'border-rose-500/30',
    glow: 'shadow-[0_0_40px_-10px_rgba(244,63,94,0.4)]',
    activeRing: 'border-rose-500/50 shadow-[0_0_40px_-10px_rgba(244,63,94,0.6)] ring-1 ring-rose-500/40',
    tint: 'from-rose-500/10',
    dot: 'bg-rose-400 ring-4 ring-rose-500/20',
  },
};

const FILTERS = ['', 'healthy', 'warning', 'critical'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [sites, setSites] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: PAGE_SIZE };
      if (status) params.status = status;
      if (search) params.search = search;
      const { data } = await api.get('/sites', { params });
      setSites(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { fetchSites(); }, [fetchSites]);

  const summary = useMemo(() => {
    const counts = { healthy: 0, warning: 0, critical: 0 };
    sites.forEach((s) => { if (counts[s.status] !== undefined) counts[s.status] += 1; });
    const total = sites.length || 1;
    const healthScore = Math.round(((counts.healthy + counts.warning * 0.5) / total) * 100);
    return { ...counts, healthScore };
  }, [sites]);

  const openCreate = () => { setEditingSite(null); setModalOpen(true); };
  const openEdit = (site) => { setEditingSite(site); setModalOpen(true); };

  const handleSubmit = async (form) => {
    if (editingSite) await api.patch(`/sites/${editingSite._id}`, form);
    else await api.post('/sites', form);
    setModalOpen(false);
    fetchSites();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this site? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/sites/${id}`);
      fetchSites();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#06070d] text-zinc-100 antialiased">
      {/* ── Ambient neon glows ───────────────────────── */}
      <div className="pointer-events-none fixed -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-indigo-600/25 blur-[140px]" />
      <div className="pointer-events-none fixed right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-fuchsia-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* ── Top bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#06070d]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/20 to-indigo-600/20 text-fuchsia-300 shadow-[0_0_20px_-4px_rgba(217,70,239,0.6)]">
              <Activity className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">PulseGuard</span>
                <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-300">
                  Live
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-500">Endpoint Telemetry Monitor</p>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-2 pl-2.5 pr-5 backdrop-blur-md sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-zinc-100">{user?.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'text-fuchsia-400' : 'text-zinc-500'}`}>
                  {user?.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* ── Welcome row ─────────────────────────────── */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400">
              General Statistics
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Operator'} 👋
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {meta.total} endpoints registered · {summary.healthy} healthy · {summary.critical} critical
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 backdrop-blur-md">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-zinc-300">Health Score</span>
            <span className="text-sm font-bold text-white">{summary.healthScore}%</span>
          </div>
        </div>

        {/* ── Stat cards (Vision UI style) ────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Health score card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/60 to-[#0b0d1a] p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-indigo-400/30">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                System Health
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold tracking-tight text-white">
                  {summary.healthScore}
                </p>
                <span className="text-sm font-semibold text-zinc-500">/ 100</span>
              </div>
              <p className="mt-2 text-xs font-medium text-indigo-300/80">
                {summary.healthScore >= 70 ? 'All systems nominal' : summary.healthScore >= 40 ? 'Elevated risk detected' : 'Immediate attention required'}
              </p>

              {/* Mini gauge */}
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all duration-700"
                  style={{ width: `${summary.healthScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status stat cards */}
          {(['healthy', 'warning', 'critical']).map((key) => {
            const m = STATUS_STYLES[key];
            const Icon = m.icon;
            const active = status === key;
            return (
              <button
                key={key}
                onClick={() => { setStatus(active ? '' : key); setPage(1); }}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br ${m.tint} via-transparent to-transparent p-5 text-left backdrop-blur-md transition-all hover:-translate-y-0.5 ${
                  active ? m.activeRing : `border-white/[0.08] hover:${m.iconBorder}`
                }`}
              >
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                      {m.label}
                    </p>
                    <div className={`grid h-10 w-10 place-items-center rounded-2xl border ${m.iconBg} ${m.iconBorder} ${m.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <p className="text-4xl font-extrabold tracking-tight text-white">
                      {summary[key]}
                    </p>
                    <span className={`text-xs font-semibold ${m.iconColor}`}>sites</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Toolbar ──────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search endpoints by name or URL..."
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                className="w-full rounded-2xl border border-white/[0.08] bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={status}
                onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                className="w-full cursor-pointer appearance-none rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm font-medium text-zinc-200 outline-none transition-all focus:border-fuchsia-400/50"
              >
                <option value="">All statuses</option>
                <option value="healthy">Healthy only</option>
                <option value="warning">Warnings only</option>
                <option value="critical">Critical only</option>
              </select>
              <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all hover:shadow-xl hover:shadow-fuchsia-500/40 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add endpoint
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Content ─────────────────────────────────── */}
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01]">
            <RefreshCw className="h-8 w-8 animate-spin text-fuchsia-400" />
            <span className="text-sm font-medium text-zinc-500">Syncing telemetry data…</span>
          </div>
        ) : sites.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center">
            <Server className="h-10 w-10 text-zinc-600" />
            <h3 className="text-base font-semibold text-zinc-200">No targets found</h3>
            <p className="max-w-xs text-xs text-zinc-500">
              No active monitor targets match your search or filter query.
            </p>
          </div>
        ) : (
          <>
            {/* Card grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sites.map((site) => {
                const m = STATUS_STYLES[site.status] ?? STATUS_STYLES.warning;
                return (
                  <div
                    key={site._id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-fuchsia-950/30"
                  >
                    {/* Top neon edge */}
                    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-40 ${m.iconColor}`} />

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="truncate text-base font-bold tracking-tight text-white" title={site.name}>
                          {site.name}
                        </h3>
                        <StatusBadge status={site.status} />
                      </div>

                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-fuchsia-300/80 transition-colors hover:text-fuchsia-200"
                      >
                        <span className="truncate">{site.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>

                      <div className="mt-4 rounded-2xl border border-white/[0.05] bg-black/40 p-3">
                        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {site.notes || 'No notes provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/[0.05] pt-4">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="truncate">{site.owner?.name || 'Unassigned'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                          {new Date(site.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.05] pt-3">
                          <button
                            onClick={() => openEdit(site)}
                            className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-all hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10 hover:text-fuchsia-300"
                            title="Edit target"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(site._id)}
                            disabled={deletingId === site._id}
                            className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-40"
                            title="Delete target"
                          >
                            {deletingId === site._id ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-current" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination footer */}
            <footer className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-zinc-500">
                Showing page <strong className="text-white">{meta.page}</strong> of{' '}
                <strong className="text-white">{meta.totalPages}</strong> ·{' '}
                <span className="text-zinc-300">{meta.total} targets registered</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-fuchsia-400/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous page
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-fuchsia-400/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next page
                </button>
              </div>
            </footer>
          </>
        )}
      </main>

      {modalOpen && (
        <SiteFormModal
          initial={editingSite}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}