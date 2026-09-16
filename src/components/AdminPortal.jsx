import React, { useState } from 'react';
import { 
  Plus, Search, Trash2, Edit2, ShieldAlert, Globe, Building, ArrowRight, 
  Phone, MessageSquare, ExternalLink, Lock, LayoutDashboard, X,
  HelpCircle, AlertTriangle
} from 'lucide-react';

export default function AdminPortal({ 
  users, 
  onAddUser, 
  onEditUser, 
  onDeleteUser, 
  onToggleWebsiteVisibility, 
  onViewWebsite, 
  onNavigateToDashboard 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [dealingFilter, setDealingFilter] = useState('All');
  const [syncFilter, setSyncFilter] = useState('All'); // 'All' | 'Live' | 'Hidden'
  const [isPolicyDismissed, setIsPolicyDismissed] = useState(false);
  const [hoveredLangUserId, setHoveredLangUserId] = useState(null);
  
  // Custom in-app delete modal state
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.territory && user.territory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.languages && user.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesDealing = dealingFilter === 'All' || user.dealing === dealingFilter;
    const matchesSync = 
      syncFilter === 'All' ? true :
      syncFilter === 'Live' ? (user.role === 'Sales' && user.status === 'Active' && user.showOnWebsite) :
      (user.role === 'Sales' && (!user.showOnWebsite || user.status !== 'Active'));

    return matchesSearch && matchesRole && matchesDealing && matchesSync;
  });

  const salesCount = users.filter(u => u.role === 'Sales').length;
  const domesticCount = users.filter(u => u.role === 'Sales' && (u.dealing === 'Domestic' || u.dealing === 'Both')).length;
  const exportCount = users.filter(u => u.role === 'Sales' && (u.dealing === 'Export' || u.dealing === 'Both')).length;
  const publicSalesCount = users.filter(u => u.role === 'Sales' && u.status === 'Active' && u.showOnWebsite).length;

  // Quick Drilldown Click Handlers
  const handleFilterTotal = () => {
    setRoleFilter('All');
    setDealingFilter('All');
    setSyncFilter('All');
    setSearchQuery('');
  };

  const handleFilterSales = () => {
    setRoleFilter('Sales');
    setDealingFilter('All');
    setSyncFilter('All');
  };

  const handleFilterLive = () => {
    setRoleFilter('Sales');
    setSyncFilter('Live');
    setDealingFilter('All');
  };

  const handleFilterMarkets = () => {
    setRoleFilter('Sales');
    setDealingFilter(prev => prev === 'Domestic' ? 'Export' : 'Domestic');
  };

  const confirmDelete = () => {
    if (pendingDeleteUser) {
      onDeleteUser(pendingDeleteUser.id, pendingDeleteUser.name);
      setPendingDeleteUser(null);
    }
  };

  return (
    <div style={{ padding: '1.5rem 1.25rem', maxWidth: '1360px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
      
      {/* Browser URL bar simulation */}
      <div style={{ backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '0.5rem 0.5rem 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.8rem', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0f172a', padding: '0.2rem 0.75rem', borderRadius: '4px', border: '1px solid #334155', color: '#93c5fd', fontFamily: 'monospace' }}>
            <Lock size={12} color="#10b981" />
            <strong style={{ color: '#ffffff' }}>https://app.cochinwood.in</strong>/admin/sales-team
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          {onNavigateToDashboard && (
            <button 
              onClick={onNavigateToDashboard}
              style={{
                backgroundColor: '#064e3b',
                color: '#ffffff',
                border: '1px solid #059669',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <LayoutDashboard size={12} color="#34d399" />
              <span>Operations Cockpit</span>
            </button>
          )}
          <span style={{ color: '#94a3b8' }}>Target Customer Site:</span>
          <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            https://cochinwood.in/sales-team <ExternalLink size={12} />
          </span>
        </div>
      </div>

      {/* Top Interactive KPI Drill-Down Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Card 1: Total Staff */}
        <div 
          onClick={handleFilterTotal}
          className="card card-hover" 
          title="Click to view all staff"
          style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer', border: roleFilter === 'All' && syncFilter === 'All' ? '2px solid #3b82f6' : '1px solid #e2e8f0' }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Cochin Wood Staff</span>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{users.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#3b82f6' }}>All ➔</span></h3>
          </div>
        </div>

        {/* Card 2: Sales Role Profiles */}
        <div 
          onClick={handleFilterSales}
          className="card card-hover" 
          title="Click to filter to Sales roles"
          style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer', borderLeft: '4px solid #b45309', border: roleFilter === 'Sales' && syncFilter === 'All' ? '2px solid #b45309' : '1px solid #e2e8f0' }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{salesCount}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>Sales Role Profiles</span>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{salesCount} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748b' }}>enforced ➔</span></h3>
          </div>
        </div>

        {/* Card 3: Live on Website */}
        <div 
          onClick={handleFilterLive}
          className="card card-hover" 
          title="Click to filter to managers currently live on website"
          style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer', border: syncFilter === 'Live' ? '2px solid #10b981' : '1px solid #e2e8f0' }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Live On cochinwood.in</span>
            <h3 style={{ fontSize: '1.4rem', color: '#065f46' }}>{publicSalesCount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#059669' }}>active ➔</span></h3>
          </div>
        </div>

        {/* Card 4: Markets Covered */}
        <div 
          onClick={handleFilterMarkets}
          className="card card-hover" 
          title="Click to toggle between Domestic & Export filter"
          style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer', border: dealingFilter !== 'All' ? '2px solid #7c3aed' : '1px solid #e2e8f0' }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>MKT</span>
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase' }}>Markets ({dealingFilter})</span>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
              🇮🇳 Dom: {domesticCount} | 🌍 Exp: {exportCount}
            </div>
          </div>
        </div>

      </div>

      {/* Dismissible / Collapsible Policy Banner */}
      {!isPolicyDismissed ? (
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ShieldAlert color="#1d4ed8" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: 700 }}>
                  Mandatory Sales Staff Policy Enforcement
                </h4>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                  Strict Compliance
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#1e3a8a', lineHeight: 1.4 }}>
                When adding or updating sales staff in <strong>app.cochinwood.in</strong>, the system mandatorily requires: <strong>1) Dealing Scope</strong> (Domestic, Export, Both), <strong>2) Spoken Languages</strong>, and <strong>3) Direct Phone & WhatsApp</strong>. Changes immediately synchronize to the customer-facing directory on <strong>cochinwood.in</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button 
              onClick={onViewWebsite}
              className="btn btn-outline" 
              style={{ borderColor: '#93c5fd', color: '#1d4ed8', backgroundColor: '#ffffff', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              <span>Preview Site</span>
              <ArrowRight size={13} />
            </button>
            <button 
              onClick={() => setIsPolicyDismissed(true)}
              title="Dismiss banner"
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.3rem', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <button
            onClick={() => setIsPolicyDismissed(false)}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <HelpCircle size={13} />
            <span>Show Mandatory Policy Guidelines</span>
          </button>
        </div>
      )}

      {/* Action Controls & Filters Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* Search & Select Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', flex: 1 }}>
            
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search staff, languages, territory..."
                className="form-input"
                style={{ paddingLeft: '2rem', padding: '0.5rem 0.65rem 0.5rem 2rem', fontSize: '0.825rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Role:</span>
              <select
                className="form-input"
                style={{ width: 'auto', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Sales">Sales Only</option>
                <option value="Operations">Operations</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Dealing:</span>
              <select
                className="form-input"
                style={{ width: 'auto', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                value={dealingFilter}
                onChange={(e) => setDealingFilter(e.target.value)}
              >
                <option value="All">All Dealings</option>
                <option value="Domestic">Domestic</option>
                <option value="Export">Export</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Sync Status:</span>
              <select
                className="form-input"
                style={{ width: 'auto', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                value={syncFilter}
                onChange={(e) => setSyncFilter(e.target.value)}
              >
                <option value="All">All Staff</option>
                <option value="Live">Live on Website</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>

            {(roleFilter !== 'All' || dealingFilter !== 'All' || syncFilter !== 'All' || searchQuery) && (
              <button
                onClick={handleFilterTotal}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Filters
              </button>
            )}

          </div>

          {/* Add Staff Button */}
          <button 
            onClick={onAddUser}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', backgroundColor: '#78350f', borderColor: '#78350f' }}
          >
            <Plus size={16} />
            <span>Add Sales Staff</span>
          </button>

        </div>
      </div>

      {/* Staff Roster Table with Uniform Row Heights */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.75rem 1.25rem' }}>Staff Member & Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Dealing Scope</th>
                <th style={{ padding: '0.75rem 1rem' }}>Languages Spoken</th>
                <th style={{ padding: '0.75rem 1rem' }}>Direct Numbers</th>
                <th style={{ padding: '0.75rem 1rem' }}>cochinwood.in Sync</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No staff members found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isSales = user.role === 'Sales';
                  const isLive = isSales && user.status === 'Active' && user.showOnWebsite;
                  const langs = user.languages || [];
                  const visibleLangs = langs.slice(0, 2);
                  const remainingCount = langs.length - visibleLangs.length;

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}>
                      
                      {/* Name & Avatar */}
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
                            alt={user.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.title || user.role}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.55rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.725rem', 
                          fontWeight: 700,
                          backgroundColor: isSales ? '#fef3c7' : '#f1f5f9',
                          color: isSales ? '#92400e' : '#475569',
                          border: isSales ? '1px solid #fde68a' : '1px solid #e2e8f0'
                        }}>
                          {user.role}
                        </span>
                      </td>

                      {/* Dealing Scope */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {isSales ? (
                          <span className={`badge ${
                            user.dealing === 'Domestic' ? 'badge-domestic' :
                            user.dealing === 'Export' ? 'badge-export' : 'badge-both'
                          }`}>
                            {user.dealing === 'Domestic' && '🇮🇳 Domestic'}
                            {user.dealing === 'Export' && '🌍 Export'}
                            {user.dealing === 'Both' && '🔄 Dom & Exp'}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontStyle: 'italic' }}>
                            Internal HQ
                          </span>
                        )}
                      </td>

                      {/* Languages Spoken (Capped to 2 with Tooltip) */}
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '210px' }}>
                        {isSales && langs.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {visibleLangs.map(l => (
                              <span key={l} className="badge badge-lang" style={{ fontSize: '0.7rem' }}>
                                {l}
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <div 
                                className="tooltip-wrapper"
                                onMouseEnter={() => setHoveredLangUserId(user.id)}
                                onMouseLeave={() => setHoveredLangUserId(null)}
                              >
                                <span 
                                  className="badge" 
                                  style={{ backgroundColor: '#e2e8f0', color: '#334155', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}
                                >
                                  +{remainingCount}
                                </span>
                                {hoveredLangUserId === user.id && (
                                  <div className="tooltip-bubble">
                                    All: {langs.join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : isSales ? (
                          <span style={{ color: '#ef4444', fontSize: '0.725rem', fontWeight: 600 }}>
                            ⚠️ Missing Languages
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>—</span>
                        )}
                      </td>

                      {/* Direct Numbers with Quick Dial / WhatsApp Test Links */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {isSales ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#0f172a', fontWeight: 600 }}>
                              <a 
                                href={`tel:${(user.phone || '').replace(/\s+/g, '')}`} 
                                title="Click to test dial"
                                style={{ display: 'flex', alignItems: 'center', color: '#0284c7' }}
                              >
                                <Phone size={12} />
                              </a>
                              <span>{user.phone || '—'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', color: '#15803d', marginTop: '3px', fontWeight: 600 }}>
                              <a 
                                href={`https://wa.me/${(user.whatsapp || user.phone || '').replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                title="Click to test WhatsApp chat"
                                style={{ display: 'flex', alignItems: 'center', color: '#25D366' }}
                              >
                                <MessageSquare size={12} />
                              </a>
                              <span>{user.whatsapp || user.phone || '—'}</span>
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>HQ Operations</span>
                        )}
                      </td>

                      {/* Website Sync Status (True iOS Switch Toggle) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {isSales ? (
                          <button
                            type="button"
                            onClick={() => onToggleWebsiteVisibility(user.id)}
                            className="switch-toggle-btn"
                            title={isLive ? 'Click to hide from customer website' : 'Click to make live on website'}
                          >
                            <div className={`switch-track ${isLive ? 'active' : ''}`}>
                              <div className="switch-thumb"></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isLive ? '#047857' : '#64748b' }}>
                              {isLive ? 'Live on site' : 'Hidden'}
                            </span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Internal Only</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => onEditUser(user)}
                            title="Edit details"
                            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.375rem', padding: '0.35rem', cursor: 'pointer', color: '#475569' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setPendingDeleteUser(user)}
                            title="Remove staff member"
                            style={{ background: 'none', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.35rem', cursor: 'pointer', color: '#dc2626' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
      {pendingDeleteUser && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setPendingDeleteUser(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '440px', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>Confirm Staff Removal</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>This action immediately affects customer contact links</p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to remove <strong>"{pendingDeleteUser.name}"</strong>? 
              They will be instantly removed from <strong>app.cochinwood.in</strong> and their phone numbers will disappear from the public directory on <strong>cochinwood.in</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setPendingDeleteUser(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={confirmDelete}
              >
                Remove Staff Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
