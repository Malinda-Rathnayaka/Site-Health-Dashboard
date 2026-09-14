import { useState } from 'react';

const STATUSES = ['healthy', 'warning', 'critical'];

export default function SiteFormModal({ initial, onClose, onSubmit }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState({
    name: initial?.name || '',
    url: initial?.url || '',
    status: initial?.status || 'healthy',
    notes: initial?.notes || '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Site' : 'Add Site'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Site name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required maxLength={120} />
            {fieldErrors.name && <p className="error-text">{fieldErrors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="url">URL</label>
            <input
              id="url"
              name="url"
              placeholder="https://example.com"
              value={form.url}
              onChange={handleChange}
              required
            />
            {fieldErrors.url && <p className="error-text">{fieldErrors.url}</p>}
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={2000}
              placeholder="e.g. SSL cert expiring in 5 days"
            />
            {fieldErrors.notes && <p className="error-text">{fieldErrors.notes}</p>}
          </div>
          <div className="row-actions" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
            <button type="button" className="btn" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
