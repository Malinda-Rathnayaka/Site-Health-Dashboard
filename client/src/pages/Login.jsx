import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck,
} from 'lucide-react';

/* ── Video background ───────────────────────────────── */
function VideoBackground({ videoUrl }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      {/* Dark gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      {/* Neon tint */}
      <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/20 via-transparent to-indigo-600/20" />
    </div>
  );
}

/* ── Login form ─────────────────────────────────────── */
function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-10">
      {/* Neon top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />

      {/* Ambient inner glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1">
          <Sparkles className="h-3 w-3 text-fuchsia-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300">
            Secure Access
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in to access the Site Health Dashboard.
        </p>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Email
            </label>
            <div className="group relative flex items-center rounded-xl border border-white/10 bg-white/[0.03] transition focus-within:border-fuchsia-400/60 focus-within:bg-white/[0.05] focus-within:ring-2 focus-within:ring-fuchsia-500/20">
              <Mail className="pointer-events-none absolute left-4 h-4 w-4 text-zinc-500 transition group-focus-within:text-fuchsia-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Password
            </label>
            <div className="group relative flex items-center rounded-xl border border-white/10 bg-white/[0.03] transition focus-within:border-fuchsia-400/60 focus-within:bg-white/[0.05] focus-within:ring-2 focus-within:ring-fuchsia-500/20">
              <Lock className="pointer-events-none absolute left-4 h-4 w-4 text-zinc-500 transition group-focus-within:text-fuchsia-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent py-3 pl-11 pr-12 text-sm text-white placeholder-zinc-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 grid h-7 w-7 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex cursor-pointer items-center gap-2 text-zinc-400">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 cursor-pointer rounded border-white/20 bg-white/5 accent-fuchsia-500"
              />
              Remember me
            </label>
            <a
              href="#"
              className="font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all hover:shadow-xl hover:shadow-fuchsia-500/50 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function Login() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#06070d] px-4 py-12">
      <VideoBackground videoUrl="https://cdn.21st.dev/assets/mirror/38/38f6c913209f4092ea0643267302c0b4873f6aeb56deeb59ead88c794340e84d.mp4" />

      <div className="relative z-20 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}