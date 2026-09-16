import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SiteFormModal from '../components/SiteFormModal.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import TopologyField from '../components/ui/topology-field.jsx';
import {
  Activity, Plus, ExternalLink, Trash2, Edit3,
  ShieldAlert, CheckCircle2, AlertTriangle, Clock,
  UserCheck, RefreshCw, Filter, Server, TrendingUp, TrendingDown, Minus,
  Globe, Orbit, Radio, Zap
} from 'lucide-react';

const PAGE_SIZE = 8;

const STATUS_STYLES = {
  healthy: {
    label: 'Operational',
    icon: CheckCircle2,
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    iconShadow: 'shadow-[0_10px_25px_-8px_rgba(16,185,129,0.7)]',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400 ring-4 ring-emerald-500/20',
  },
  warning: {
    label: 'Degraded',
    icon: AlertTriangle,
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    iconShadow: 'shadow-[0_10px_25px_-8px_rgba(245,158,11,0.7)]',
    text: 'text-amber-400',
    dot: 'bg-amber-400 ring-4 ring-amber-500/20',
  },
  critical: {
    label: 'Critical',
    icon: ShieldAlert,
    iconBg: 'bg-gradient-to-br from-rose-400 to-pink-600',
    iconShadow: 'shadow-[0_10px_25px_-8px_rgba(244,63,94,0.7)]',
    text: 'text-rose-400',
    dot: 'bg-rose-400 ring-4 ring-rose-500/20',
  },
};

/* ── Cinematic topology background ──────────────────── */
function TopologyBackground({ theme }) {
  return (
    <div className={`topology-background fixed inset-0 z-0 overflow-hidden pointer-events-none ${theme}`}>
      <div className="absolute inset-0">
        <TopologyField nodeCount={70} />
      </div>

      <div className="topology-wash absolute inset-0 bg-black/55" />
      <div className="topology-gradient absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-950/25 to-fuchsia-900/20" />
      <div className="topology-vignette absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.85)_100%)]" />

      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] animate-[spin_60s_linear_infinite] rounded-full border border-purple-500/10" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[720px] w-[720px] animate-[spin_90s_linear_infinite_reverse] rounded-full border border-indigo-500/[0.06]" />
    </div>
  );
}

/* ── Futuristic Telemetry Waveform Chart ─────────────────── */
function HealthTelemetryChart({ score, healthy, warning, critical, total }) {
  const gradientId = useMemo(() => `waveGradient-${Math.random().toString(36).substr(2, 9)}`, []);

  // Generate dynamic SVG curve coordinates based on score
  const wavePath = useMemo(() => {
    const heightFactor = 100 - score;
    const p1 = Math.max(20, Math.min(80, 50 + heightFactor * 0.3));
    const p2 = Math.max(10, Math.min(90, 30 + heightFactor * 0.5));
    const p3 = Math.max(15, Math.min(85, 40 - heightFactor * 0.2));
    const finalY = Math.max(15, Math.min(80, 90 - score * 0.7));

    return `M 0,${p1} C 70,${p2} 140,${p3} 200,${finalY} C 260,${finalY + 20} 330,${p1 - 10} 400,${finalY}`;
  }, [score]);

  const fillPath = `${wavePath} L 400,120 L 0,120 Z`;

  const strokeColor =
    score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-purple-500/30">
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              System Telemetry Pulse
            </h2>
            <p className="text-[10px] text-zinc-400">Live health frequency analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Score:</span>
          <span
            className="text-lg font-black tracking-tight transition-colors duration-500"
            style={{ color: strokeColor }}
          >
            {score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* SVG Waveform Area */}
        <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/60 lg:col-span-7">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />

          <svg
            viewBox="0 0 400 120"
            className="absolute inset-0 h-full w-full preserve-3d"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Fill under wave */}
            <path
              d={fillPath}
              fill={`url(#${gradientId})`}
              className="transition-all duration-1000 ease-in-out"
            />

            {/* Glowing Main Wave Line */}
            <path
              d={wavePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
              style={{ filter: `drop-shadow(0px 0px 8px ${strokeColor})` }}
            />
          </svg>

          {/* Pulse Overlay Line */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/80 to-transparent" />
        </div>

        {/* Breakdown Panel */}
        <div className="flex flex-col gap-3 lg:col-span-5">
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                Operational
              </span>
              <span className="text-zinc-300">
                {healthy} <span className="text-zinc-500">({Math.round((healthy / total) * 100)}%)</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${(healthy / total) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                Degraded
              </span>
              <span className="text-zinc-300">
                {warning} <span className="text-zinc-500">({Math.round((warning / total) * 100)}%)</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                style={{ width: `${(warning / total) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
                Critical
              </span>
              <span className="text-zinc-300">
                {critical} <span className="text-zinc-500">({Math.round((critical / total) * 100)}%)</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700"
                style={{ width: `${(critical / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [theme, setTheme] = useState(() => localStorage.getItem('site-health-theme') || 'dark');

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('site-health-theme', theme);
  }, [theme]);

  const summary = useMemo(() => {
    const counts = { healthy: 0, warning: 0, critical: 0 };
    sites.forEach((s) => { if (counts[s.status] !== undefined) counts[s.status] += 1; });
    const total = sites.length || 1;
    const healthScore = Math.round(((counts.healthy + counts.warning * 0.5) / total) * 100);
    return { ...counts, total: sites.length, healthScore };
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

  const statCards = [
    {
      key: 'healthScore',
      label: 'Health Score',
      value: `${summary.healthScore}%`,
      trend: summary.healthScore >= 70 ? 'Great' : summary.healthScore >= 40 ? 'Fair' : 'Low',
      trendDirection: summary.healthScore >= 70 ? 'up' : summary.healthScore >= 40 ? 'flat' : 'down',
      icon: Activity,
      iconBg: 'bg-gradient-to-br from-violet-400 to-indigo-600',
      iconShadow: 'shadow-[0_10px_25px_-8px_rgba(99,102,241,0.8)]',
    },
    {
      key: 'healthy',
      label: 'Operational',
      value: summary.healthy,
      trend: summary.healthy > 0 ? '+ live' : 'Idle',
      trendDirection: summary.healthy > 0 ? 'up' : 'flat',
      icon: CheckCircle2,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      iconShadow: 'shadow-[0_10px_25px_-8px_rgba(16,185,129,0.8)]',
      clickable: true,
      statusKey: 'healthy',
    },
    {
      key: 'warning',
      label: 'Degraded',
      value: summary.warning,
      trend: summary.warning > 0 ? 'Attention' : 'All clear',
      trendDirection: summary.warning > 0 ? 'down' : 'flat',
      icon: AlertTriangle,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      iconShadow: 'shadow-[0_10px_25px_-8px_rgba(245,158,11,0.8)]',
      clickable: true,
      statusKey: 'warning',
    },
    {
      key: 'critical',
      label: 'Critical',
      value: summary.critical,
      trend: summary.critical > 0 ? 'Urgent' : 'All clear',
      trendDirection: summary.critical > 0 ? 'down' : 'flat',
      icon: ShieldAlert,
      iconBg: 'bg-gradient-to-br from-rose-400 to-pink-600',
      iconShadow: 'shadow-[0_10px_25px_-8px_rgba(244,63,94,0.8)]',
      clickable: true,
      statusKey: 'critical',
    },
  ];

  const gridCols =
    sites.length === 1
      ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'
      : sites.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`dashboard-shell theme-${theme} relative min-h-screen w-full overflow-x-hidden antialiased`}>
      <TopologyBackground theme={theme} />

      <Navbar
        user={user}
        isAdmin={isAdmin}
        onLogout={logout}
        search={search}
        onSearchChange={(val) => { setPage(1); setSearch(val); }}
        notifications={[]}
        theme={theme}
        onThemeToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8">
        {/* Hero */}
        <div className="dashboard-hero mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
              <Radio className="h-3 w-3" />
              Global Mission Status
            </p>
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'Operator'}
            </h1>
            <p className="muted mt-2 flex items-center gap-2 text-sm">
              <Orbit className="accent h-3.5 w-3.5" />
              {meta.total} endpoints in orbit · {summary.healthy} healthy · {summary.critical} critical
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="online-pill flex items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="muted text-xs font-medium">Systems online</span>
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Chart Component */}
        {!loading && sites.length > 0 && (
          <HealthTelemetryChart
            score={summary.healthScore}
            healthy={summary.healthy}
            warning={summary.warning}
            critical={summary.critical}
            total={summary.total || 1}
          />
        )}

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            const active = card.clickable && status === card.statusKey;
            const Card = card.clickable ? 'button' : 'div';
            const TrendIcon =
              card.trendDirection === 'up' ? TrendingUp
              : card.trendDirection === 'down' ? TrendingDown
              : Minus;
            const trendColor =
              card.trendDirection === 'up' ? 'text-emerald-400'
              : card.trendDirection === 'down' ? 'text-rose-400'
              : 'text-zinc-400';

            return (
              <Card
                key={card.key}
                onClick={card.clickable ? () => { setStatus(active ? '' : card.statusKey); setPage(1); } : undefined}
                className={`group relative overflow-hidden rounded-3xl border bg-black/40 p-5 text-left backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-950/40 ${
                  active ? 'border-purple-400/60 ring-1 ring-purple-400/40' : 'border-white/10 hover:border-white/20'
                } ${card.clickable ? 'cursor-pointer' : ''}`}
              >
                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.iconBg} opacity-25 blur-3xl`} />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                      {card.value}
                    </p>
                  </div>
                  <div className={`grid h-10 w-10 place-items-center rounded-2xl text-white ${card.iconBg} ${card.iconShadow}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative mt-4 flex items-center gap-1.5">
                  <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
                  <span className={`text-xs font-semibold ${trendColor}`}>{card.trend}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter the current view…"
                value={status}
                onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                className="sr-only"
              />
              <select
                value={status}
                onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                className="w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-black/40 py-3 pl-11 pr-10 text-sm font-medium text-zinc-200 outline-none transition-all focus:border-purple-400/50"
              >
                <option value="">All statuses</option>
                <option value="healthy">Operational</option>
                <option value="warning">Degraded</option>
                <option value="critical">Critical</option>
              </select>
              <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/50 active:scale-95"
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

        {/* Content */}
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-black/30 backdrop-blur-xl">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
            <span className="text-sm font-medium text-zinc-400">Syncing orbital telemetry…</span>
          </div>
        ) : sites.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 bg-black/30 text-center backdrop-blur-xl">
            <Server className="h-10 w-10 text-zinc-600" />
            <h3 className="text-base font-semibold text-zinc-200">No targets in orbit</h3>
            <p className="max-w-xs text-xs text-zinc-500">
              No active monitor targets match your search or filter query.
            </p>
          </div>
        ) : (
          <>
            <div className={`grid gap-5 ${gridCols}`}>
              {sites.map((site) => {
                const m = STATUS_STYLES[site.status] ?? STATUS_STYLES.warning;
                return (
                  <div
                    key={site._id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-black/50 hover:shadow-2xl hover:shadow-purple-950/40"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${m.iconBg}`} />
                    <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${m.iconBg} opacity-15 blur-3xl transition-opacity group-hover:opacity-30`} />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${m.dot}`} />
                          <h3 className="truncate text-base font-bold tracking-tight text-white" title={site.name}>
                            {site.name}
                          </h3>
                        </div>
                        <StatusBadge status={site.status} />
                      </div>

                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-purple-300/80 transition-colors hover:text-purple-200"
                      >
                        <span className="truncate">{site.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>

                      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {site.notes || 'No notes provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-6 border-t border-white/[0.06] pt-4">
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
                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
                          <button
                            onClick={() => openEdit(site)}
                            className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300"
                            title="Edit target"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(site._id)}
                            disabled={deletingId === site._id}
                            className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-40"
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

            <footer className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-zinc-400">
                Showing page <strong className="text-white">{meta.page}</strong> of{' '}
                <strong className="text-white">{meta.totalPages}</strong> ·{' '}
                <span className="text-zinc-300">{meta.total} targets registered</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-2xl border border-white/10 bg-black/40 px-5 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md transition-all hover:border-purple-400/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous page
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-5 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md transition-all hover:border-purple-400/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next page
                </button>
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Embedded Footer */}
      <Footer />

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