import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';

interface NotificationPanelProps {
  onClose: () => void;
}

const typeIcons: Record<string, string> = {
  session: '📅',
  alert: '⚠️',
  info: 'ℹ️',
  system: '⚙️',
};

const formatRelative = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'A l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadNotifs = notifications.filter(n => !n.is_read);

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        onClick={onClose}
      />
      {/* Panel */}
      <div className="notification-panel">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px', borderBottom: '1px solid var(--color-gray-200)',
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-black)' }}>
            Notifications
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {unreadNotifs.length > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                style={{
                  background: 'none', border: 'none', fontSize: '0.75rem',
                  color: '#002F5D', cursor: 'pointer', fontWeight: 600,
                }}
              >
                Tout marquer lu
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', fontSize: '1.1rem',
                cursor: 'pointer', color: 'var(--color-gray-400)', lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          {isLoading ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>
              Chargement...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.4 }}>🔔</div>
              <p style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>Aucune notification</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                onClick={() => {
                  if (!notif.is_read) markAsRead.mutate(notif.id);
                }}
              >
                <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                  {typeIcons[notif.type] || '📋'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.85rem', fontWeight: notif.is_read ? 500 : 700,
                    color: 'var(--color-black)', marginBottom: '2px',
                  }}>
                    {notif.title}
                  </div>
                  {notif.body && (
                    <div style={{
                      fontSize: '0.8rem', color: 'var(--color-gray-500)',
                      lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                    }}>
                      {notif.body}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)', marginTop: '4px' }}>
                    {formatRelative(notif.created_at)}
                  </div>
                </div>
                {!notif.is_read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#002F5D', flexShrink: 0,
                  }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
