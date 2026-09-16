import React, { useState } from 'react';
import AdminPortal from './AdminPortal';
import PublicWebsite from './PublicWebsite';
import { ArrowRightLeft, Lock, Smartphone, Monitor, Columns } from 'lucide-react';

export default function SplitView({ users, onAddUser, onEditUser, onDeleteUser, onToggleWebsiteVisibility, onTrackLeadClick }) {
  const [deviceMode, setDeviceMode] = useState('phone'); // 'phone' | 'desktop'
  const [layoutRatio, setLayoutRatio] = useState('50-50'); // '50-50' | '40-60'

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      
      {/* Split View Header Controls Bar */}
      <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid #334155', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ArrowRightLeft size={16} color="#fbbf24" />
          <span style={{ fontWeight: 800, color: '#f8fafc' }}>Live Cross-Domain Playground:</span>
          <span style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
            Edit on Left (<strong>app.cochinwood.in</strong>) ➔ Instant live sync on Right (<strong>cochinwood.in</strong>)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Layout Ratio Switcher */}
          <button
            onClick={() => setLayoutRatio(prev => prev === '50-50' ? '40-60' : '50-50')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              fontSize: '0.725rem',
              fontWeight: 700,
              border: '1px solid #475569',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#334155',
              color: '#ffffff'
            }}
            title="Toggle split screen column ratio"
          >
            <Columns size={13} />
            <span>Ratio: {layoutRatio === '50-50' ? '50:50' : '40:60'}</span>
          </button>

          {/* Customer Preview Viewport Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '0 0.4rem', fontWeight: 600 }}>Customer Device:</span>
            <button
              onClick={() => setDeviceMode('phone')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.6rem',
                fontSize: '0.725rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: deviceMode === 'phone' ? '#2563eb' : 'transparent',
                color: '#ffffff'
              }}
            >
              <Smartphone size={13} />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.6rem',
                fontSize: '0.725rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: deviceMode === 'desktop' ? '#2563eb' : 'transparent',
                color: '#ffffff'
              }}
            >
              <Monitor size={13} />
              <span>Full Desktop</span>
            </button>
          </div>

          {/* Sync status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.75rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399' }} className="animate-pulse-slow"></span>
            <span>Live Sync Active</span>
          </div>

        </div>

      </div>

      {/* Split Screen Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: layoutRatio === '50-50' ? '1fr 1fr' : '1fr 1.3fr', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Internal App (app.cochinwood.in) */}
        <div style={{ overflowY: 'auto', borderRight: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
          <div style={{ padding: '0.65rem 1rem', backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={13} color="#2563eb" />
              <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#1e40af', letterSpacing: '0.3px', fontFamily: 'monospace' }}>
                https://app.cochinwood.in
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              Internal Admin Portal
            </span>
          </div>
          <AdminPortal
            users={users}
            onAddUser={onAddUser}
            onEditUser={onEditUser}
            onDeleteUser={onDeleteUser}
            onToggleWebsiteVisibility={onToggleWebsiteVisibility}
            onViewWebsite={() => {}}
          />
        </div>

        {/* Right Side: Public Website (cochinwood.in) */}
        <div style={{ overflowY: 'auto', backgroundColor: deviceMode === 'phone' ? '#0f172a' : '#ffffff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.65rem 1rem', backgroundColor: '#fef3c7', borderBottom: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={13} color="#b45309" />
              <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#92400e', letterSpacing: '0.3px', fontFamily: 'monospace' }}>
                https://cochinwood.in/sales-team
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                {deviceMode === 'phone' ? '📱 Mobile Contractor View (390px)' : '💻 Desktop Customer View'}
              </span>
            </div>
          </div>

          {/* Conditional rendering of mobile device mockup or desktop full view */}
          {deviceMode === 'phone' ? (
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div className="device-frame-phone">
                <div className="device-frame-notch"></div>
                <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px' }}>
                  <PublicWebsite
                    users={users}
                    onNavigateToApp={() => {}}
                    onTrackLeadClick={onTrackLeadClick}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <PublicWebsite
                users={users}
                onNavigateToApp={() => {}}
                onTrackLeadClick={onTrackLeadClick}
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

