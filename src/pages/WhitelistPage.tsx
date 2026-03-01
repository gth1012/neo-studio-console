import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../stores/toast.store';

export default function WhitelistPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState('DEVICE');
  const [newValue, setNewValue] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['whitelist'],
    queryFn: () => api.get('/api/admin/whitelist').then((res) => res.data),
  });

  const addMutation = useMutation({
    mutationFn: (entry: { type: string; value: string }) =>
      api.post('/api/admin/whitelist', entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelist'] });
      setShowAdd(false);
      setNewValue('');
      addToast('추가 완료', 'success');
    },
    onError: () => addToast('추가 실패', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/whitelist/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelist'] });
      addToast('삭제 완료', 'success');
    },
    onError: () => addToast('삭제 실패', 'error'),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-txt-muted">총 {data?.total || 0}건</span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 bg-status-blue hover:bg-status-blue/80 text-white rounded-lg text-sm font-medium transition-all"
        >
          + 추가
        </button>
      </div>

      {showAdd && (
        <div className="bg-geo-card border border-geo-border rounded-xl p-5 mb-4 flex items-end gap-3">
          <div>
            <label className="block text-xs text-txt-muted mb-1">허용 대상</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="px-3 py-2 bg-geo-main border border-geo-border rounded-lg text-sm text-txt-primary focus:outline-none"
            >
              <option value="DEVICE">기기 허용</option>
              <option value="IP">IP 허용</option>
              <option value="DINA">인증코드 허용</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-txt-muted mb-1">대상 정보</label>
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-3 py-2 bg-geo-main border border-geo-border rounded-lg text-sm text-txt-primary focus:outline-none focus:border-status-blue"
              placeholder="디바이스 ID / IP 주소 / DINA ID"
            />
          </div>
          <button
            onClick={() => {
              if (newValue) addMutation.mutate({ type: newType, value: newValue });
            }}
            className="px-4 py-2 bg-status-green hover:bg-status-green/80 text-white rounded-lg text-sm font-medium"
          >
            저장
          </button>
          <button
            onClick={() => setShowAdd(false)}
            className="px-4 py-2 bg-geo-main border border-geo-border rounded-lg text-sm text-txt-secondary hover:text-txt-primary"
          >
            취소
          </button>
        </div>
      )}

      <div className="bg-geo-card border border-geo-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-geo-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">허용 대상</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">대상 정보</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">만료일</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">생성자</th>
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
                <tr key={item.id} className="border-b border-geo-border hover:bg-geo-card-hover transition-colors">
                  <td className="px-4 py-3 text-sm text-txt-primary">{item.id}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-status-purple-dim text-status-purple">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-primary font-mono">{item.value}</td>
                  <td className="px-4 py-3 text-sm text-txt-muted">
                    {item.expires_at ? new Date(item.expires_at).toLocaleString() : '영구'}
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-secondary">{item.created_by || '-'}</td>
                  <td className="px-4 py-3 text-sm text-txt-muted">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm('삭제하시겠습니까?')) deleteMutation.mutate(item.id);
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
    </div>
  );
}
