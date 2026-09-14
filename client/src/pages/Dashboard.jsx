import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SiteFormModal from '../components/SiteFormModal.jsx';

const PAGE_SIZE = 8;

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

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const openCreate = () => {
    setEditingSite(null);
    setModalOpen(true);
  };

  const openEdit = (site) => {
    setEditingSite(site);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editingSite) {
      await api.patch(`/sites/${editingSite._id}`, form);
    } else {
      await api.post('/sites', form);
    }
    setModalOpen(false);
    fetchSites();
  };

  const handleDelete = async (id) => {
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
    <div>
      <header className="topbar">
        <span className="brand">Site Health Dashboard</span>
        <div className="user-chip">
          <span>{user?.name}</span>
          <span className="role-badge">{user?.role}</span>
          <button className="btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="container">
        <div className="toolbar">
          <div className="filters">
            <input
              placeholder="Search by name or URL…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openCreate}>
              + Add site
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="spinner" role="status" aria-label="Loading sites" />
        ) : sites.length === 0 ? (
          <div className="card empty-state">No sites match your filters yet.</div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Last checked</th>
                    <th>Notes</th>
                    <th>Owner</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <tr key={site._id}>
                      <td>{site.name}</td>
                      <td>
                        <a href={site.url} target="_blank" rel="noopener noreferrer">
                          {site.url}
                        </a>
                      </td>
                      <td>
                        <StatusBadge status={site.status} />
                      </td>
                      <td>{new Date(site.lastChecked).toLocaleString()}</td>
                      <td style={{ maxWidth: 220, whiteSpace: 'pre-wrap' }}>{site.notes || '—'}</td>
                      <td>{site.owner?.name || '—'}</td>
                      {isAdmin && (
                        <td>
                          <div className="row-actions">
                            <button className="link-btn" onClick={() => openEdit(site)}>
                              Edit
                            </button>
                            <button
                              className="link-btn"
                              style={{ color: 'var(--danger)' }}
                              onClick={() => handleDelete(site._id)}
                              disabled={deletingId === site._id}
                            >
                              {deletingId === site._id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                className="btn"
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {meta.page} of {meta.totalPages} · {meta.total} sites
              </span>
              <button
                className="btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      {modalOpen && (
        <SiteFormModal initial={editingSite} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
