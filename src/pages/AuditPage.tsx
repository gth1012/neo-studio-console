import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function AuditPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit'],
    queryFn: () => api.get('/api/admin/audit').then((res) => res.data),
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <span className="text-sm text-txt-muted">최근 관리 기록</span>
      </div>

      <div className="bg-geo-card border border-geo-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-geo-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">작업</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">대상 항목</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">운영자</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">결과</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-txt-muted">시간</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-txt-muted">로딩 중...</td></tr>
            ) : !data?.items?.length ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-txt-muted">데이터 없음</td></tr>
            ) : (
              data.items.map((item: any) => (
                <tr key={item.id} className="border-b border-geo-border hover:bg-geo-card-hover transition-colors">
                  <td className="px-4 py-3 text-sm text-txt-primary">{item.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.action?.includes('DELETE') ? 'bg-status-red-dim text-status-red' :
                      item.action?.includes('BLOCK') ? 'bg-status-yellow-dim text-status-yellow' :
                      'bg-status-blue-dim text-status-blue'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-secondary font-mono">{item.target || '-'}</td>
                  <td className="px-4 py-3 text-sm text-txt-secondary">{item.operator_email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.result === 'SUCCESS' ? 'bg-status-green-dim text-status-green' : 'bg-status-red-dim text-status-red'
                    }`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-txt-muted">{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
