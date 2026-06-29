import { useState, useEffect } from 'react';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { ProjectWorkspaceView } from './components/ProjectWorkspaceView';
import { AdminPortal } from './components/AdminPortal';
import { User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [appInitializing, setAppInitializing] = useState(true);

  // Read saved session state on startup
  useEffect(() => {
    const checkSession = async () => {
      const savedId = localStorage.getItem('nexus_user_id');
      if (savedId) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'X-User-Id': savedId,
            }
          });
          const json = await res.json();
          if (res.ok && json.success) {
            setCurrentUser(json.user);
          } else {
            localStorage.removeItem('nexus_user_id');
          }
        } catch (e) {
          console.error('Session reconnection error', e);
        }
      }
      setAppInitializing(false);
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_user_id', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProjectId(null);
    localStorage.removeItem('nexus_user_id');
  };

  if (appInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest"></div>
          <span className="text-xs font-semibold text-slate-400 font-mono">ESTABLISHING NEXUS SESSION...</span>
        </div>
      </div>
    );
  }

  // Routing Tree
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  if (adminOpen) {
    return (
      <AdminPortal
        currentUser={currentUser}
        onClose={() => setAdminOpen(false)}
        onRefreshData={() => setRefreshSeed((s) => s + 1)}
      />
    );
  }

  if (selectedProjectId) {
    return (
      <ProjectWorkspaceView
        projectId={selectedProjectId}
        currentUser={currentUser}
        onBackToDashboard={() => setSelectedProjectId(null)}
      />
    );
  }

  return (
    <DashboardView
      refreshKey={refreshSeed}
      currentUser={currentUser}
      onLogout={handleLogout}
      onSelectProject={(pId) => setSelectedProjectId(pId)}
      onOpenAdminPortal={() => setAdminOpen(true)}
    />
  );
}
