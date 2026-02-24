import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/admin/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-geo-main flex items-center justify-center">
      <div className="w-[400px] bg-geo-card border border-geo-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-status-purple to-status-blue rounded-lg flex items-center justify-center text-lg font-bold text-white">
            N
          </div>
          <div>
            <h1 className="text-xl font-semibold text-txt-primary">NeoStudio</h1>
            <p className="text-xs text-txt-muted">Verification Console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-txt-secondary mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-geo-main border border-geo-border rounded-lg text-sm text-txt-primary focus:outline-none focus:border-status-blue"
              placeholder="admin@arteon.io"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-txt-secondary mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-geo-main border border-geo-border rounded-lg text-sm text-txt-primary focus:outline-none focus:border-status-blue"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="px-3 py-2 bg-status-red-dim border border-status-red/30 rounded-lg text-sm text-status-red">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-status-blue hover:bg-status-blue/80 text-white rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
