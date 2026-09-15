import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Bell, Settings, LogOut, Menu, X,
  Activity, ChevronDown, User, Shield, HelpCircle, Command
} from 'lucide-react';

export default function Navbar({
  user,
  isAdmin,
  onLogout,
  search,
  onSearchChange,
  notifications = [],
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 transition-all duration-300 md:px-6">
      {/* ── Floating Glass Navbar Container ─────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-slate-950/40 px-4 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] md:px-6 md:py-3">

        {/* ── LEFT: Brand Logo & Title ───────────────────── */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group relative flex items-center gap-3 transition-transform active:scale-95"
          >
            <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-slate-950/80 backdrop-blur-md transition group-hover:bg-slate-950/40">
                <Activity className="h-5 w-5 text-purple-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
              </div>
              
              {/* Live Pulsing Status Dot */}
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
                Real-time System Monitoring
              </span>
            </div>
          </Link>
        </div>

        {/* ── RIGHT: Desktop Actions & Controls ────────────────── */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Glass Search Input */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-purple-400" />
            <input
              type="text"
              placeholder="Search endpoints…"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-48 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-9 text-xs text-white placeholder-zinc-500 outline-none backdrop-blur-md transition-all duration-300 focus:w-64 focus:border-purple-500/50 focus:bg-slate-950/60 focus:ring-4 focus:ring-purple-500/10 lg:w-60 lg:focus:w-72"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 lg:flex">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </div>

          <div className="h-5 w-[1px] bg-white/10" />

          {/* Notifications Button */}
          <button
            className="group relative grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 backdrop-blur-md transition-all duration-200 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300 active:scale-95"
            title="Notifications"
          >
            <Bell className="h-4 w-4 transition-transform group-hover:rotate-12" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-lg shadow-rose-500/50">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            className="group grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 backdrop-blur-md transition-all duration-200 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300 active:scale-95"
            title="Settings"
          >
            <Settings className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 pr-3 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] active:scale-95"
            >
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-purple-500/20">
                {initials}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-semibold leading-none text-zinc-100">{user?.name}</span>
                <span className={`mt-0.5 text-[9px] font-extrabold uppercase tracking-widest ${isAdmin ? 'text-purple-400' : 'text-zinc-400'}`}>
                  {user?.role || 'Member'}
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu Overlay */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl">
                  <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-3">
                    <p className="text-xs font-bold text-white">{user?.name}</p>
                    <p className="truncate text-[11px] font-medium text-zinc-400">
                      {user?.email || 'operator@sitehealth.io'}
                    </p>
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white">
                      <User className="h-4 w-4 text-zinc-400" />
                      Profile Settings
                    </button>
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white">
                      <Shield className="h-4 w-4 text-zinc-400" />
                      Security & Keys
                    </button>
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white">
                      <HelpCircle className="h-4 w-4 text-zinc-400" />
                      Help & Support
                    </button>
                  </div>

                  <div className="my-2 border-t border-white/[0.06]" />

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 active:scale-95"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile Menu Trigger ───────────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer Panel ──────────────────────────── */}
      {mobileOpen && (
        <div className="mt-2 rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search endpoints…"
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-100">{user?.name}</span>
                <span className="text-[10px] text-zinc-400">{user?.email || 'operator@sitehealth.io'}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-semibold text-rose-400 transition active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}