import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function DinaSearchPage() {
  const [dinaId, setDinaId] = useState('');
  const [searchId, setSearchId] = useState('');

  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['dina-status', searchId],
    queryFn: () => api.get(`/api/geocam/status/${searchId}`).then((res) => res.data),
    enabled: !!searchId,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dinaId.trim()) {
      setSearchId(dinaId.trim());
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-txt-primary mb-6">인증 코드 조회</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={dinaId}
            onChange={(e) => setDinaId(e.target.value)}
            placeholder="DINA ID 입력 (예: DINA-TEST000001)"
            className="flex-1 px-4 py-3 bg-geo-card border border-geo-border rounded-lg text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-geo-border-hover"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-status-blue text-white rounded-lg font-medium hover:bg-status-blue/80 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-txt-secondary">검색 중...</div>
      )}

      {error && isFetched && (
        <div className="bg-status-red-dim border border-status-red/30 rounded-xl p-5">
          <div className="text-status-red">DINA를 찾을 수 없습니다</div>
        </div>
      )}

      {data && (
        <div className="bg-geo-card border border-geo-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-txt-primary mb-4">조회 결과</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">DINA ID</div>
              <div className="text-sm font-medium text-txt-primary">{data.dina_id}</div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Status</div>
              <div className={`text-sm font-medium ${data.status === 'CLAIMED' ? 'text-status-green' : data.status === 'UNCLAIMED' ? 'text-status-yellow' : 'text-status-blue'}`}>
                {data.status}
              </div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Asset Public ID</div>
              <div className="text-sm font-medium text-txt-primary">{data.asset_public_id || '-'}</div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Series ID</div>
              <div className="text-sm font-medium text-txt-primary">{data.series_id || '-'}</div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Shipped At</div>
              <div className="text-sm font-medium text-txt-primary">
                {data.shipped_at ? new Date(data.shipped_at).toLocaleString() : '-'}
              </div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Claim Count</div>
              <div className="text-sm font-medium text-txt-primary">{data.claim_count ?? 0}</div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Last Scan At</div>
              <div className="text-sm font-medium text-txt-primary">
                {data.last_scan_at ? new Date(data.last_scan_at).toLocaleString() : '-'}
              </div>
            </div>
            <div className="p-4 bg-geo-bg rounded-lg">
              <div className="text-xs text-txt-muted mb-1">Last Claim At</div>
              <div className="text-sm font-medium text-txt-primary">
                {data.last_claim_at ? new Date(data.last_claim_at).toLocaleString() : '-'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
