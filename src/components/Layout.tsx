import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    section: '모니터링',
    items: [
      { path: '/', label: '운영 현황', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      )},
    ],
  },
  {
    section: '운영',
    items: [
      { path: '/deadletter', label: '처리 실패 기록', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      )},
      { path: '/devices', label: '차단 기기 관리', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      )},
      { path: '/ratelimit', label: '요청 제한 관리', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
      )},
    ],
  },
  {
    section: '시스템',
    items: [
      { path: '/whitelist', label: '허용 기기 관리', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      )},
      { path: '/audit', label: '관리 기록', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      )},
    ],
  },
  {
    section: '검증 관리',
    items: [
      { path: '/dina-search', label: '인증 코드 조회', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      )},
      { path: '/claim-history', label: '정품 등록 기록', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      )},
      { path: '/verify-events', label: '검증 기록', icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      )},
    ],
  },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const currentLabel = menuItems
    .flatMap((s) => s.items)
    .find((m) => isActive(m.path))?.label || '';

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-geo-main">
      <aside className="w-[220px] min-h-screen bg-geo-sidebar border-r border-geo-border flex flex-col fixed z-10">
        <div className="px-5 py-6 flex items-center gap-2.5 border-b border-geo-border">
          <div className="w-8 h-8 bg-gradient-to-br from-status-purple to-status-blue rounded-lg flex items-center justify-center text-sm font-bold text-white">
            N
          </div>
          <span className="text-base font-semibold tracking-tight text-txt-primary">NeoStudio</span>
        </div>

        <nav className="p-2 flex-1 flex flex-col gap-0.5">
          {menuItems.map((section) => (
            <div key={section.section}>
              <div className="px-3 pt-4 pb-1.5 text-[11px] font-semibold text-txt-muted tracking-widest uppercase">
                {section.section}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive(item.path)
                      ? 'bg-geo-card text-txt-primary font-medium'
                      : 'text-txt-secondary hover:bg-geo-card hover:text-txt-primary'
                  }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-blue rounded-r-full" />
                  )}
                  <div className="flex items-center justify-center text-txt-secondary group-hover:text-txt-primary">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-geo-border flex flex-col gap-0.5">
          <div className="px-3 py-2.5 text-sm text-txt-secondary">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-txt-secondary hover:bg-geo-card hover:text-txt-primary transition-all duration-150"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      <main className="ml-[220px] flex-1 flex flex-col">
        <header className="h-16 bg-geo-card border-b border-geo-border flex items-center px-8">
          <h1 className="text-xl font-semibold text-txt-primary">{currentLabel || 'NeoStudio'}</h1>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
