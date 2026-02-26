import { useState } from 'react';
import { useUnreadCount } from '../../hooks/useNotifications';
import { NotificationPanel } from './NotificationPanel';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
        title="Notifications"
      >
        <span style={{ fontSize: '1.1rem' }}>🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
    </div>
  );
};
