import { useToastStore } from '../stores/toast.store';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`px-4 py-3 rounded-lg text-sm font-medium cursor-pointer animate-fade-in ${
            toast.type === 'success'
              ? 'bg-status-green-dim text-status-green border border-status-green/30'
              : toast.type === 'error'
              ? 'bg-status-red-dim text-status-red border border-status-red/30'
              : 'bg-status-blue-dim text-status-blue border border-status-blue/30'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
