import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../stores/toast.store';

export default function DevicesPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['devices', blockedOnly, page],
    queryFn: () =>
      api.get('/api/admin/devices', { params: { blocked: blockedOnly || undefined, page, limit: 20 } }).then((res) => res.data),
  });

  const blockMutation = useMutation({
    mutationFn: ({ fp, reason }: { fp: string; reason: string }) =>
      api.post(`/api/admin/devices/${fp}/block`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      addToast('차단 완료', 'success');
    },
    onError: () => addToast('차단 실패', 'error'),
  });

  const unblockMutation = useMutation({
    mutationFn: (fp: string) => api.post(`/api/admin/devices/${fp}/unblock`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      addToast('차단 해제 완료', 'success');
    },
    onError: () => addToast('차단 해제 실패', 'error'),
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <label className="flex items-center gap-2 text-sm text-txt-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={blockedOnly}
            onChange={(e) => { setBlockedOnly(e.target.checked); setPage(1); }}
            className="rounded border-geo-border"
          />
          차단된 디바이스만
        </label>
        <span className="text-sm text-txt-muted">총 {data?.total || 0}건</span>
      </div>

      <div className="bg-geo-card border border-geo-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-geo-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">Fingerprint</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">Total Claims</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">Abuse Count</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">상태</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">Last Seen</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-txt-muted">로딩 중...</td></tr>
            ) : !data?.items?.length ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-txt-muted">데이터 없음</td></tr>
            ) : (
              data.items.map((item: any) => (
                <tr key={item.fingerprint_hash} className="border-b border-geo-border hover:bg-geo-card-hover transition-colors">
                  <td className="px-4 py-3 text-sm text-txt-primary font-mono">{item.fingerprint_hash}</td>
                  <td className="px-4 py-3 text-sm text-txt-primary">{item.total_claims}</td>
                  <td className="px-4 py-3 text-sm text-txt-primary">{item.abuse_count}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.is_blocked
                        ? 'bg-status-red-dim text-status-red'
                        : 'bg-status-green-dim text-status-green'
                    }`}>
                      {item.is_blocked ? 'BLOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-muted">
                    {item.last_seen ? new Date(item.last_seen).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item.is_blocked ? (
                      <button
                        onClick={() => unblockMutation.mutate(item.fingerprint_hash)}
                        className="px-2.5 py-1 bg-status-green-dim text-status-green border border-status-green/30 rounded text-xs hover:bg-status-green/20"
                      >
                        해제
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const reason = prompt('차단 사유를 입력하세요:');
                          if (reason) blockMutation.mutate({ fp: item.fingerprint_hash, reason });
                        }}
                        className="px-2.5 py-1 bg-status-red-dim text-status-red border border-status-red/30 rounded text-xs hover:bg-status-red/20"
                      >
                        차단
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
