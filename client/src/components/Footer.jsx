import { Link } from 'react-router-dom';
import {
  Activity, ShieldCheck, Heart, ExternalLink, Globe,
  MessageSquare, ArrowUpRight, ServerCog, Zap, Radio, Sparkles,
  Code2, Send, Users, AtSign,
} from 'lucide-react';

export default function Footer({
  version = 'v2.4.0',
  status = 'operational',
  uptime = '99.98%',
}) {
  const statusMap = {
    operational: {
      label: 'All systems operational',
      dot: 'bg-emerald-400',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    degraded: {
      label: 'Degraded performance',
      dot: 'bg-amber-400',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    maintenance: {
      label: 'Scheduled maintenance',
      dot: 'bg-cyan-400',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    outage: {
      label: 'Service outage',
      dot: 'bg-rose-400',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
    },
  };
  const s = statusMap[status] ?? statusMap.operational;

  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full px-4 pt-6 pb-8 md:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12]">

        {/* Top neon edge */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* ── Section 1: Brand + status ────────────────── */}
        <div className="flex flex-col gap-6 border-b border-white/[0.06] p-6 md:flex-row md:items-start md:justify-between md:p-8">

          {/* Brand block */}
          <div className="flex max-w-sm flex-col gap-4">
            <Link
              to="/"
              className="group flex items-center gap-3 transition-transform active:scale-95"
            >
              <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-slate-950/80 backdrop-blur-md transition group-hover:bg-slate-950/40">
                  <Activity className="h-5 w-5 text-purple-400 transition group-hover:scale-110 group-hover:text-white" />
                </div>
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  Site Health Dashboard
                </span>
                <span className="text-[10px] font-medium tracking-wide text-zinc-400">
                  Real-time system monitoring
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-zinc-500">
              Mission-critical uptime telemetry for every endpoint your team monitors.
              Built for engineers who care about reliability.
            </p>

            {/* Status pill */}
            <a
              href="https://status.sitehealth.io"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-fit items-center gap-2 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold ${s.border} ${s.bg} ${s.text} transition hover:scale-[1.02]`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${s.dot}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
              </span>
              {s.label}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-12">
            <div>
              <h3 className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500">
                Product
              </h3>
              <ul className="flex flex-col gap-2 text-xs">
                <li>
                  <Link to="/" className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-purple-300">
                    <ServerCog className="h-3 w-3" /> Endpoints
                  </Link>
                </li>
                <li>
                  <Link to="/" className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-purple-300">
                    <Zap className="h-3 w-3" /> Incidents
                  </Link>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-purple-300">
                    <Radio className="h-3 w-3" /> Webhooks
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-purple-300">
                    <Sparkles className="h-3 w-3" /> Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500">
                Resources
              </h3>
              <ul className="flex flex-col gap-2 text-xs">
                <li>
                  <a href="#" className="text-zinc-400 transition hover:text-purple-300">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 transition hover:text-purple-300">API reference</a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 transition hover:text-purple-300">Status page</a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 transition hover:text-purple-300">Support</a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500">
                System
              </h3>
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <span className="text-zinc-500">Uptime</span>
                  <span className="font-mono font-bold text-emerald-400">{uptime}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <span className="text-zinc-500">Version</span>
                  <span className="font-mono font-bold text-zinc-300">{version}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <span className="text-zinc-500">Region</span>
                  <span className="font-mono font-bold text-zinc-300">eu-west-1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Bottom bar ────────────────────── */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-zinc-500">
            <p>© {year} Site Health Dashboard</p>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
            <Link to="/privacy" className="transition hover:text-zinc-300">Privacy</Link>
            <Link to="/terms" className="transition hover:text-zinc-300">Terms</Link>
            <Link to="/security" className="transition hover:text-zinc-300">Security</Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[11px] text-zinc-500 sm:inline-flex">
              Built with
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              for reliability
            </span>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:-translate-y-px hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <Code2 className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:-translate-y-px hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <Send className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:-translate-y-px hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <Users className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:hello@sitehealth.io"
                aria-label="Contact"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:-translate-y-px hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <AtSign className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}