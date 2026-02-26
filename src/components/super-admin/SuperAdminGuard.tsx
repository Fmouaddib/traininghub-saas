import { useAuth } from '../../hooks/useAuth';

export const SuperAdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="animate-spin" style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid #e5e5e5', borderTopColor: '#e74c3c',
        }} />
      </div>
    );
  }

  if (user?.profile?.role !== 'super_admin') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', gap: '16px', padding: '24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>Acces refuse</h2>
        <p style={{ fontSize: '0.9rem', color: '#737373', maxWidth: '400px' }}>
          Vous n'avez pas les permissions necessaires pour acceder a l'espace Super Admin.
        </p>
        <button
          onClick={() => { window.location.hash = '#/'; }}
          style={{
            padding: '10px 24px', background: '#e74c3c', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '0.9rem',
            fontWeight: 600, cursor: 'pointer', marginTop: '8px',
          }}
        >
          Retour a l'accueil
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
