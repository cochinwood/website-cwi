import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  GitBranch, 
  RefreshCw, 
  ArrowRightLeft, 
  LayoutDashboard,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, users, onResetSeed }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const activeSalesCount = users.filter(u => u.role === 'Sales' && u.status === 'Active' && u.showOnWebsite).length;
  const totalUsersCount = users.length;

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
  };

  const handleConfirmReset = () => {
    setShowResetModal(false);
    onResetSeed();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Operations Dashboard',
      icon: LayoutDashboard,
      badge: 'Live Cockpit',
      badgeColor: { bg: '#d1fae5', text: '#065f46' },
      activeColor: '#064e3b',
      iconColor: '#34d399'
    },
    {
      id: 'website',
      label: 'cochinwood.in',
      icon: Globe,
      badge: `${activeSalesCount} Reps Live`,
      badgeColor: { bg: '#d1fae5', text: '#065f46' },
      activeColor: '#059669',
      iconColor: '#059669'
    },
    {
      id: 'app',
      label: 'app.cochinwood.in',
      icon: Building2,
      badge: `${totalUsersCount} Staff`,
      badgeColor: { bg: '#dbeafe', text: '#1e40af' },
      activeColor: '#1d4ed8',
      iconColor: '#1d4ed8'
    },
    {
      id: 'split',
      label: 'Live Side-by-Side Sync',
      icon: ArrowRightLeft,
      badge: null,
      activeColor: '#7c3aed',
      iconColor: '#7c3aed'
    },
    {
      id: 'flowchart',
      label: 'Architecture & Spec',
      icon: GitBranch,
      badge: null,
      activeColor: '#b45309',
      iconColor: '#b45309'
    }
  ];

  return (
    <>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '240px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(120,53,15,0.35)', flexShrink: 0 }}>
              CW
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>Cochin Wood Industries</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                  cochinwood.in
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                <strong>app.cochinwood.in</strong> (Staff Portal) ⟷ <strong>cochinwood.in</strong> (Customer Portal)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav 
            className="hide-on-mobile"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem', 
              backgroundColor: '#f1f5f9', 
              padding: '0.25rem', 
              borderRadius: '0.625rem', 
              border: '1px solid #e2e8f0',
              overflowX: 'auto',
              maxWidth: '750px'
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '0.45rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    backgroundColor: isActive 
                      ? (item.id === 'dashboard' ? '#064e3b' : '#ffffff') 
                      : 'transparent',
                    color: isActive 
                      ? (item.id === 'dashboard' ? '#ffffff' : item.activeColor) 
                      : '#475569',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <Icon size={15} color={isActive ? (item.id === 'dashboard' ? '#34d399' : item.iconColor) : '#64748b'} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{ 
                      fontSize: '0.68rem', 
                      padding: '0.1rem 0.4rem', 
                      borderRadius: '9999px', 
                      backgroundColor: isActive && item.id === 'dashboard' ? 'rgba(255,255,255,0.2)' : item.badgeColor.bg, 
                      color: isActive && item.id === 'dashboard' ? '#ffffff' : item.badgeColor.text, 
                      fontWeight: 700 
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions: Live sync badge, reset, and mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} className="animate-pulse-slow"></span>
              <span className="hide-on-mobile">app ⟷ site Live Sync</span>
              <span className="show-on-mobile" style={{ display: 'none' }}>Live</span>
            </div>

            <button 
              onClick={() => setShowResetModal(true)} 
              title="Reset to default sample data"
              style={{ background: 'none', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', padding: '0.4rem', borderRadius: '0.45rem', display: 'flex', alignItems: 'center', backgroundColor: '#ffffff' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
            >
              <RefreshCw size={15} />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="show-on-mobile-flex"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem',
                borderRadius: '0.45rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                color: '#0f172a'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '0.75rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                    backgroundColor: isActive ? '#f8fafc' : 'transparent',
                    color: isActive ? item.activeColor : '#334155',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Icon size={18} color={item.iconColor} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '9999px', 
                      backgroundColor: item.badgeColor.bg, 
                      color: item.badgeColor.text, 
                      fontWeight: 700 
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* In-App Reset Confirmation Modal */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }} className="animate-fade-in">
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1.75rem',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Reset Sample Database?
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Factory default dataset restoration
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              This will restore all team members, phone numbers, and dealing preferences back to the initial sample seed. Any custom edits or newly created sales managers will be reverted.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="btn btn-secondary"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="btn"
                style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 700 }}
              >
                Reset to Factory Seed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

