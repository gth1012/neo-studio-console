import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../stores/toast.store';

export default function DeadletterPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['deadletter', statusFilter, page],
    queryFn: () =>
      api.get('/api/admin/deadletter', { params: { status: statusFilter || undefined, page, limit: 20 } }).then((res) => res.data),
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => api.post(`/api/admin/deadletter/${id}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadletter'] });
      addToast('Retry 성공', 'success');
    },
    onError: () => addToast('Retry 실패', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/deadletter/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadletter'] });
      addToast('삭제 완료', 'success');
    },
    onError: () => addToast('삭제 실패', 'error'),
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-geo-card border border-geo-border rounded-lg text-sm text-txt-primary focus:outline-none focus:border-status-blue"
        >
          <option value="">전체 상태</option>
          <option value="PENDING">PENDING</option>
          <option value="RETRIED">RETRIED</option>
          <option value="FAILED">FAILED</option>
        </select>
        <span className="text-sm text-txt-muted">총 {data?.total || 0}건</span>
      </div>

      <div className="bg-geo-card border border-geo-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-geo-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">DINA ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">에러 메시지</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">재시도 횟수</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">상태</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">생성일</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-txt-muted">로딩 중...</td></tr>
            ) : !data?.items?.length ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-txt-muted">데이터 없음</td></tr>
            ) : (
              data.items.map((item: any) => (
                <tr key={item.event_id} className="border-b border-geo-border hover:bg-geo-card-hover transition-colors">
                  <td className="px-4 py-3 text-sm text-txt-primary font-mono">{item.event_id}</td>
                  <td className="px-4 py-3 text-sm text-txt-primary font-mono">{item.dina_id || '-'}</td>
                  <td className="px-4 py-3 text-sm text-txt-secondary max-w-[200px] truncate">{item.error_message || '-'}</td>
                  <td className="px-4 py-3 text-sm text-txt-primary">{item.retry_count}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'PENDING' ? 'bg-status-yellow-dim text-status-yellow' :
                      item.status === 'RETRIED' ? 'bg-status-blue-dim text-status-blue' :
                      'bg-status-red-dim text-status-red'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-muted">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    {item.status === 'PENDING' && (
                      <button
                        onClick={() => retryMutation.mutate(item.event_id)}
                        className="px-2.5 py-1 bg-status-blue-dim text-status-blue border border-status-blue/30 rounded text-xs hover:bg-status-blue/20"
                      >
                        Retry
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('삭제하시겠습니까?')) deleteMutation.mutate(item.event_id);
                      }}
                      className="px-2.5 py-1 bg-status-red-dim text-status-red border border-status-red/30 rounded text-xs hover:bg-status-red/20"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 bg-geo-card border border-geo-border rounded text-sm text-txt-secondary disabled:opacity-30"
          >
            이전
          </button>
          <span className="px-3 py-1.5 text-sm text-txt-muted">
            {page} / {Math.ceil(data.total / 20)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(data.total / 20)}
            className="px-3 py-1.5 bg-geo-card border border-geo-border rounded text-sm text-txt-secondary disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
