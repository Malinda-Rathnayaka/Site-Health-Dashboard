import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// VideoBackground Component
const VideoBackground = ({ videoUrl }) => {
  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />
    </>
  );
};

// LoginForm Component
const LoginForm = ({ onSubmit }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Call the onSubmit prop if provided (for the App wrapper)
    if (onSubmit) {
      onSubmit(email, password, false);
    }

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
    <div className="card auth-card">
      <h1 style={{ marginTop: 0 }}>Site Health Dashboard</h1>
      <p className="muted" style={{ marginTop: -8 }}>Sign in to continue</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            placeholder="you@example.com"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={submitting}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="muted" style={{ marginTop: 16 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

// Main App Component
function App() {
  const handleLogin = (email, password, remember) => {
    console.log('Login attempt:', { email, password, remember });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <VideoBackground videoUrl="https://cdn.21st.dev/assets/mirror/38/38f6c913209f4092ea0643267302c0b4873f6aeb56deeb59ead88c794340e84d.mp4" />

      <div className="relative z-20 w-full max-w-md animate-fadeIn">
        <LoginForm onSubmit={handleLogin} />
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20">
        © 2025 NexusGate. All rights reserved.
      </footer>
    </div>
  );
}

export default App;