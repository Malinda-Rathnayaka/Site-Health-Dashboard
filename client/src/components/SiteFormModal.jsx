import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const STATUSES = ['healthy', 'warning', 'critical'];

export default function SiteFormModal({ initial, onClose, onSubmit }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState({
    name: initial?.name || '',
    url: initial?.url || '',
    status: initial?.status || 'healthy',
    notes: initial?.notes || '',
    owner: initial?.owner?._id || '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // FIX: Added users fetching for the "Owner" dropdown field
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get('/users');
        setUsers(data.data || []);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      if (err.details) {
        const map = {};
        err.details.forEach((d) => {
          if (d.field) map[d.field] = d.message;
        });
        setFieldErrors(map);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // FIX: Updated modal to use Tailwind CSS for beautiful UI instead of unstyled classes
  // The unstyled classes caused "nothing happens" because the modal was invisible/unusable
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-purple-900/20 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
          {isEdit ? 'Update Endpoint' : 'Add New Endpoint'}
        </h2>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-zinc-300">Target Identity (Name)</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={120}
              className={`rounded-xl border ${fieldErrors.name ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'} bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:ring-4`}
              placeholder="e.g. Primary Payment Gateway"
            />
            {fieldErrors.name && <span className="text-xs text-rose-400">{fieldErrors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className="text-sm font-medium text-zinc-300">Target Vector (URL)</label>
            <input
              id="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              required
              className={`rounded-xl border ${fieldErrors.url ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'} bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:ring-4`}
              placeholder="https://example.com"
            />
            {fieldErrors.url && <span className="text-xs text-rose-400">{fieldErrors.url}</span>}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium text-zinc-300">Operational Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-zinc-900">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* FIX: Added Owner field missing from original implementation */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="owner" className="text-sm font-medium text-zinc-300">Assigned Operator</label>
              <select
                id="owner"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                required
                className={`rounded-xl border ${fieldErrors.owner ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'} bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all focus:ring-4`}
              >
                <option value="" disabled className="bg-zinc-900">Select an operator...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id} className="bg-zinc-900">
                    {u.name}
                  </option>
                ))}
              </select>
              {fieldErrors.owner && <span className="text-xs text-rose-400">{fieldErrors.owner}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-zinc-300">Telemetry Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={2000}
              rows={3}
              className={`resize-none rounded-xl border ${fieldErrors.notes ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'} bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:ring-4`}
              placeholder="e.g. SSL cert expiring in 5 days, scheduled maintenance on Friday..."
            />
            {fieldErrors.notes && <span className="text-xs text-rose-400">{fieldErrors.notes}</span>}
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {submitting ? 'Transmitting...' : isEdit ? 'Update Target' : 'Establish Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
