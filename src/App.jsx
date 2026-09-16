import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import PublicWebsite from './components/PublicWebsite';
import SplitView from './components/SplitView';
import FlowchartSpec from './components/FlowchartSpec';
import UserModal from './components/UserModal';
import CwiSalesDashboard from './components/CwiSalesDashboard';
import { INITIAL_USERS } from './data/initialUsers';
import { CheckCircle2, X, Sparkles, Undo2 } from 'lucide-react';

const STORAGE_KEY = 'cwi_portal_users_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam && ['dashboard', 'app', 'website', 'split', 'flowchart'].includes(viewParam)) {
        return viewParam;
      }
      if (window.location.hash.includes('directory')) {
        return 'website';
      }
    } catch (e) {
      console.error(e);
    }
    return 'dashboard'; // Default directly to the Operations Dashboard cockpit!
  });

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const url = new URL(window.location);
    url.searchParams.set('view', newTab);
    window.history.pushState({ view: newTab }, '', url);
  };

  // Browser navigation Back/Forward button popstate listener
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        if (viewParam && ['dashboard', 'app', 'website', 'split', 'flowchart'].includes(viewParam)) {
          setActiveTab(viewParam);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load from storage:', e);
    }
    return INITIAL_USERS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }, [users]);

  const showToast = (message, type = 'success', onUndo = null) => {
    setToastMessage({ message, type, onUndo });
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, onUndo ? 6000 : 3500);
    return timer;
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
      showToast(`Updated profile for "${userData.name}". Public website directory synchronized!`);
    } else {
      setUsers(prev => [userData, ...prev]);
      showToast(`Added new sales manager "${userData.name}". Now live on public website!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId, userName) => {
    const userToRestore = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));

    // Show toast with 1-click Undo capability
    showToast(
      `Removed "${userName}" from internal app and website directory.`,
      'delete',
      userToRestore ? () => {
        setUsers(prev => [userToRestore, ...prev]);
        setToastMessage(null);
        showToast(`Restored "${userToRestore.name}" successfully!`);
      } : null
    );
  };

  const handleToggleWebsiteVisibility = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.showOnWebsite;
        showToast(
          nextState 
            ? `"${u.name}" is now visible on public website.` 
            : `"${u.name}" has been hidden from public website.`
        );
        return { ...u, showOnWebsite: nextState };
      }
      return u;
    }));
  };

  const handleResetSeed = () => {
    setUsers(INITIAL_USERS);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Reset to default team profiles successfully.');
  };

  const handleTrackLeadClick = (rep, actionType) => {
    showToast(`⚡ Lead Recorded: Direct ${actionType} inquiry to ${rep.name} logged in telemetry.`, 'lead');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.625rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 999,
          maxWidth: '480px',
          border: '1px solid #334155'
        }} className="animate-fade-in">
          {toastMessage.type === 'lead' ? (
            <Sparkles size={18} color="#38bdf8" />
          ) : (
            <CheckCircle2 size={18} color="#10b981" />
          )}
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{toastMessage.message}</span>
          
          {toastMessage.onUndo && (
            <button
              onClick={toastMessage.onUndo}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '0.3rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Undo2 size={13} />
              <span>Undo</span>
            </button>
          )}

          <button 
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        users={users}
        onResetSeed={handleResetSeed}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'dashboard' && (
          <CwiSalesDashboard
            users={users}
            onNavigateToTeamDirectory={() => handleTabChange('app')}
            onNavigateToPublicSite={() => handleTabChange('website')}
          />
        )}

        {activeTab === 'app' && (
          <AdminPortal
            users={users}
            onAddUser={handleOpenAdd}
            onEditUser={handleOpenEdit}
            onDeleteUser={handleDeleteUser}
            onToggleWebsiteVisibility={handleToggleWebsiteVisibility}
            onViewWebsite={() => handleTabChange('website')}
            onNavigateToDashboard={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'website' && (
          <PublicWebsite
            users={users}
            onNavigateToApp={() => handleTabChange('app')}
            onTrackLeadClick={handleTrackLeadClick}
          />
        )}

        {activeTab === 'split' && (
          <SplitView
            users={users}
            onAddUser={handleOpenAdd}
            onEditUser={handleOpenEdit}
            onDeleteUser={handleDeleteUser}
            onToggleWebsiteVisibility={handleToggleWebsiteVisibility}
            onTrackLeadClick={handleTrackLeadClick}
          />
        )}

        {activeTab === 'flowchart' && (
          <FlowchartSpec />
        )}
      </main>

      {/* Add / Edit User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialData={editingUser}
      />

    </div>
  );
}

