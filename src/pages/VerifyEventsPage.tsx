import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface VerifyEvent {
  dina_id: string;
  event_type: string;
  device_fingerprint: string;
  gate_a_result: boolean;
  gate_b_result: boolean;
  gate_c_result: boolean;
  gps_lat: number | null;
  gps_lng: number | null;
  created_at: string;
}

export default function VerifyEventsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['verify-events'],
    queryFn: () => api.get('/api/admin/verify-events').then((res) => res.data),
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
        <div className="text-status-red">검증 이벤트 로드 실패</div>
      </div>
    );
  }

  const events: VerifyEvent[] = data?.events || data || [];

  const GateStatus = ({ passed }: { passed: boolean }) => (
    <span className={`inline-block w-5 h-5 rounded-full text-center text-xs leading-5 ${passed ? 'bg-status-green-dim text-status-green' : 'bg-status-red-dim text-status-red'}`}>
      {passed ? 'O' : 'X'}
    </span>
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-txt-primary">검증 이벤트</h1>
        <span className="text-xs text-txt-muted">60초마다 자동 갱신</span>
      </div>

      <div className="bg-geo-card border border-geo-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-geo-border bg-geo-bg">
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">DINA ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">Event Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">Device</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-txt-muted uppercase">Gate A</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-txt-muted uppercase">Gate B</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-txt-muted uppercase">Gate C</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">GPS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted uppercase">Created At</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-txt-muted">
                  검증 이벤트가 없습니다
                </td>
              </tr>
            ) : (
              events.map((event, idx) => (
                <tr key={idx} className="border-b border-geo-border last:border-b-0 hover:bg-geo-bg/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-txt-primary font-mono">{event.dina_id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${event.event_type === 'ATTESTED_TRUST' ? 'bg-status-green-dim text-status-green' : 'bg-status-yellow-dim text-status-yellow'}`}>
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-secondary font-mono truncate max-w-[120px]">
                    {event.device_fingerprint || '-'}
                  </td>
                  <td className="px-4 py-3 text-center"><GateStatus passed={event.gate_a_result} /></td>
                  <td className="px-4 py-3 text-center"><GateStatus passed={event.gate_b_result} /></td>
                  <td className="px-4 py-3 text-center"><GateStatus passed={event.gate_c_result} /></td>
                  <td className="px-4 py-3 text-sm text-txt-secondary">
                    {event.gps_lat && event.gps_lng ? `${event.gps_lat.toFixed(4)}, ${event.gps_lng.toFixed(4)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-secondary">
                    {event.created_at ? new Date(event.created_at).toLocaleString() : '-'}
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
