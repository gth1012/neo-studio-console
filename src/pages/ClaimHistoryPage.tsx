import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface ClaimEvent {
  dina_id: string;
  device_fingerprint: string;
  claimed_at: string;
}

export default function ClaimHistoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['claim-history'],
    queryFn: () => api.get('/api/admin/claims').then((res) => res.data),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-txt-secondary">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-status-red">Claim 이력 로드 실패</div>
      </div>
    );
  }

  const claims: ClaimEvent[] = data?.claims || data || [];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-txt-primary">Claim 이력</h1>
        <span className="text-xs text-txt-muted">60초마다 자동 갱신</span>
      </div>

      <div className="bg-geo-card border border-geo-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-geo-border bg-geo-bg">
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">DINA ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">Device Fingerprint</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">Claimed At</th>
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-txt-muted">
                  Claim 이력이 없습니다
                </td>
              </tr>
            ) : (
              claims.map((claim, idx) => (
                <tr key={idx} className="border-b border-geo-border last:border-b-0 hover:bg-geo-bg/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-txt-primary font-mono">{claim.dina_id}</td>
                  <td className="px-4 py-3 text-sm text-txt-secondary font-mono">{claim.device_fingerprint || '-'}</td>
                  <td className="px-4 py-3 text-sm text-txt-secondary">
                    {claim.claimed_at ? new Date(claim.claimed_at).toLocaleString() : '-'}
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
