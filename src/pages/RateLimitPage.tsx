import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function RateLimitPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['ratelimit'],
    queryFn: () => api.get('/api/admin/ratelimit').then((res) => res.data),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-txt-secondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-geo-card border border-geo-border rounded-xl p-5">
          <div className="text-xs text-txt-muted mb-2">기기 제한 (분당)</div>
          <div className="text-2xl font-semibold text-status-blue">{data?.device_limit_per_min || 0}</div>
        </div>
        <div className="bg-geo-card border border-geo-border rounded-xl p-5">
          <div className="text-xs text-txt-muted mb-2">IP 제한 (분당)</div>
          <div className="text-2xl font-semibold text-status-blue">{data?.ip_limit_per_min || 0}</div>
        </div>
        <div className="bg-geo-card border border-geo-border rounded-xl p-5">
          <div className="text-xs text-txt-muted mb-2">최근 1시간 검증 수</div>
          <div className="text-2xl font-semibold text-status-purple">{data?.recent_verifications_1h || 0}</div>
        </div>
        <div className="bg-geo-card border border-geo-border rounded-xl p-5">
          <div className="text-xs text-txt-muted mb-2">차단된 기기</div>
          <div className={`text-2xl font-semibold ${data?.blocked_devices > 0 ? 'text-status-red' : 'text-status-green'}`}>
            {data?.blocked_devices || 0}
          </div>
        </div>
      </div>

      <div className="bg-geo-card border border-geo-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-txt-primary mb-4">허용 기기 현황</h3>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-semibold text-status-purple">{data?.whitelist_count || 0}</div>
          <div className="flex flex-col gap-1">
            {data?.whitelist_by_type?.map((item: any) => (
              <div key={item.type} className="text-sm text-txt-secondary">
                {item.type}: <span className="text-txt-primary font-medium">{item.cnt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
