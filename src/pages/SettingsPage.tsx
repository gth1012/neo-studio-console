import { useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../stores/toast.store';

export default function SettingsPage() {
  const { addToast } = useToastStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('All fields are required', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('New password must be at least 8 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/api/admin/auth/change-password', { currentPassword, newPassword });
      addToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-txt-primary">?ㅼ젙</h2>
        <p className="text-xs text-txt-muted mt-0.5">怨꾩젙 ?ㅼ젙</p>
      </div>

      <div className="max-w-[480px]">
        <div className="bg-geo-card border border-geo-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-txt-primary mb-4">鍮꾨?踰덊샇 蹂寃?/h3>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-txt-muted mb-1.5">?꾩옱 鍮꾨?踰덊샇</label>
              <input
                type="password" autoComplete="off"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="?꾩옱 鍮꾨?踰덊샇 ?낅젰"
                className="w-full px-3 py-2 bg-geo-deep border border-geo-border rounded-lg text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-status-purple"
              />
            </div>

            <div>
              <label className="block text-xs text-txt-muted mb-1.5">??鍮꾨?踰덊샇</label>
              <input
                type="password" autoComplete="off"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="??鍮꾨?踰덊샇 ?낅젰 (8???댁긽)"
                className="w-full px-3 py-2 bg-geo-deep border border-geo-border rounded-lg text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-status-purple"
              />
            </div>

            <div>
              <label className="block text-xs text-txt-muted mb-1.5">??鍮꾨?踰덊샇 ?뺤씤</label>
              <input
                type="password" autoComplete="off"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="??鍮꾨?踰덊샇 ?ъ엯??
                className="w-full px-3 py-2 bg-geo-deep border border-geo-border rounded-lg text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-status-purple"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium bg-status-purple text-white rounded-lg hover:bg-status-purple/80 transition-all disabled:opacity-50"
            >
              {loading ? '蹂寃?以?..' : '鍮꾨?踰덊샇 蹂寃?}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


