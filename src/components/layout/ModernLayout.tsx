import React, { type ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { NotificationBell } from '../molecules/NotificationBell';

interface ModernLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: { email?: string; profile?: { full_name?: string; role?: string } } | null;
  onSignOut: () => void;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  user,
  onSignOut
}) => {
  const isStudent = user?.profile?.role === 'student';

  const navigationItems = isStudent
    ? [
        { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
        { id: 'sessions', label: 'Planning', icon: '📅' },
      ]
    : [
        { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
        { id: 'sessions', label: 'Sessions', icon: '📅' },
        { id: 'participants', label: 'Participants', icon: '👥' },
        { id: 'programs', label: 'Programmes', icon: '🎓' },
      ];

  const configItems = isStudent
    ? []
    : [
        { id: 'rooms', label: 'Salles', icon: '🏢' },
        { id: 'diplomas', label: 'Diplomes', icon: '🏆' },
        { id: 'classes', label: 'Classes', icon: '🏫' },
        { id: 'subjects', label: 'Matieres', icon: '📚' },
      ];

  const integrationItems = isStudent
    ? []
    : [
        { id: 'zoom', label: 'Zoom', icon: '🎥' },
        { id: 'emails', label: 'Emails', icon: '📧' },
        { id: 'settings', label: 'Parametres', icon: '⚙️' },
      ];

  const NavItem = ({ id, label, icon }: { id: string; label: string; icon: string }) => (
    <button
      onClick={() => onTabChange(id)}
      className={`nav-item w-full text-left ${activeTab === id ? 'active' : ''}`}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="app-modern">
      <div className="flex">
        {/* Sidebar */}
        <div className="sidebar-modern">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <div className="logo-text">
                <h1>AntiPlanning</h1>
                <p>Gestion de formation</p>
              </div>
            </div>
          </div>

          <div className="nav-modern">
            <div className="nav-section">
              <div className="nav-section-title">Principal</div>
              {navigationItems.map((item) => <NavItem key={item.id} {...item} />)}
            </div>

            {configItems.length > 0 && (
              <div className="nav-section">
                <div className="nav-section-title">Configuration</div>
                {configItems.map((item) => <NavItem key={item.id} {...item} />)}
              </div>
            )}

            {integrationItems.length > 0 && (
              <div className="nav-section">
                <div className="nav-section-title">Integrations</div>
                {integrationItems.map((item) => <NavItem key={item.id} {...item} />)}
              </div>
            )}
          </div>

          {/* User */}
          <div className="p-4 border-t border-white/[0.08] mt-auto">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', paddingRight: '8px' }}>
              <NotificationBell />
            </div>
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-[#FF5B46] rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.profile?.full_name || 'Utilisateur'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 text-neutral-500 hover:text-[#FF5B46] rounded-md hover:bg-white/[0.06] transition-colors"
                title="Deconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="main-content">
          <div className="h-full animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
