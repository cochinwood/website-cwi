import React, { useState } from 'react';
import { 
  Globe, Phone, Mail, MessageSquare, MapPin, Search, 
  Sparkles, ChevronRight, UserCheck, Copy, Check, 
  ExternalLink, Lock, Download, Eye, EyeOff
} from 'lucide-react';

export default function PublicWebsite({ users, onNavigateToApp, onTrackLeadClick }) {
  const [selectedDealing, setSelectedDealing] = useState('All');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [revealedPhones, setRevealedPhones] = useState({});

  // Publicly visible active sales managers only
  const publicSalesTeam = users.filter(
    u => u.role === 'Sales' && u.status === 'Active' && u.showOnWebsite
  );

  // Extract all unique languages available across active sales reps
  const availableLanguages = Array.from(
    new Set(publicSalesTeam.flatMap(u => u.languages || []))
  ).sort();

  // Top fast-dial desks
  const hotlines = [
    { label: '🇮🇳 Domestic Desk (Kerala & Mangalore)', rep: publicSalesTeam.find(u => u.dealing === 'Domestic' || u.dealing === 'Both') },
    { label: '🌍 Export Desk (UAE & GCC Trade)', rep: publicSalesTeam.find(u => u.dealing === 'Export' || u.dealing === 'Both') },
    { label: '🏢 Key Accounts (Commercial Plywood)', rep: publicSalesTeam.find(u => u.dealing === 'Both') || publicSalesTeam[0] }
  ].filter(h => Boolean(h.rep));

  // Multi-language filter handler
  const toggleLanguageFilter = (lang) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  // Filter logic
  const filteredReps = publicSalesTeam.filter(rep => {
    const matchesDealing = 
      selectedDealing === 'All' ? true :
      selectedDealing === 'Both' ? rep.dealing === 'Both' :
      rep.dealing === selectedDealing || rep.dealing === 'Both';

    const matchesLanguage = 
      selectedLanguages.length === 0 ? true :
      selectedLanguages.every(l => rep.languages && rep.languages.includes(l));

    const matchesSearch = 
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.territory && rep.territory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rep.phone && rep.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rep.languages && rep.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesDealing && matchesLanguage && matchesSearch;
  });

  const handleTrackLead = (type, rep) => {
    if (onTrackLeadClick) {
      onTrackLeadClick(type, rep);
    }
  };

  const generateWhatsAppLink = (rep) => {
    const rawNumber = (rep.whatsapp || rep.phone || '').replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${rep.name}, I am inquiring via cochinwood.in regarding ${rep.dealing || 'timber/plywood'} supply & quotations.`
    );
    return `https://wa.me/${rawNumber}?text=${message}`;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRevealPhone = (repId) => {
    setRevealedPhones(prev => ({
      ...prev,
      [repId]: !prev[repId]
    }));
  };

  const downloadVCard = (rep) => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:${rep.name};;;;
FN:${rep.name}
ORG:Cochin Wood Industries
TITLE:${rep.title || 'Sales Specialist'}
TEL;TYPE=CELL,VOICE:${rep.phone || ''}
TEL;TYPE=WHATSAPP:${rep.whatsapp || rep.phone || ''}
EMAIL:${rep.email || ''}
URL:https://cochinwood.in
NOTE:Market Dealing: ${rep.dealing}; Spoken Languages: ${(rep.languages || []).join(', ')}; Region: ${rep.territory || 'India / GCC'}
END:VCARD`;

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${rep.name.replace(/\s+/g, '_')}_CochinWood.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    handleTrackLead('vcard_download', rep);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      
      {/* Browser address bar simulation */}
      <div style={{ backgroundColor: '#0f172a', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.78rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#1e293b', padding: '0.2rem 0.75rem', borderRadius: '4px', border: '1px solid #334155', color: '#34d399', fontFamily: 'monospace' }}>
            <Lock size={12} color="#10b981" />
            <strong style={{ color: '#ffffff' }}>https://cochinwood.in</strong>/sales-team
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ color: '#94a3b8' }}>Managed via:</span>
          <button 
            onClick={onNavigateToApp}
            style={{ background: 'none', border: 'none', color: '#93c5fd', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            https://app.cochinwood.in <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* 1. TOP ANNOUNCEMENT & MULTI-DESK BAR */}
      <div style={{ backgroundColor: '#78350f', color: '#fef3c7', padding: '0.5rem 1.25rem', fontSize: '0.78rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ backgroundColor: '#d97706', color: '#fff', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem' }}>
              DIRECT PROCUREMENT DESK
            </span>
            <span>Connect instantly with specialized regional timber & plywood leads:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {hotlines.map((h, idx) => (
              <a 
                key={idx}
                href={`tel:${(h.rep.phone || '').replace(/\s+/g, '')}`} 
                onClick={() => handleTrackLead('header_call', h.rep)}
                style={{ color: idx === 0 ? '#fde68a' : idx === 1 ? '#a7f3d0' : '#e0e7ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
              >
                <span>{h.label}:</span>
                <strong style={{ color: '#ffffff', textDecoration: 'underline' }}>{h.rep.phone}</strong>
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* 2. CORPORATE WEBSITE NAVIGATION HEADER */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.85rem 1.25rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'linear-gradient(135deg, #78350f, #b45309)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                CW
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>Cochin Wood Industries</span>
                <span style={{ fontSize: '0.7rem', color: '#78350f', fontWeight: 700 }}>cochinwood.in</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              <span style={{ cursor: 'pointer', color: '#0f172a' }}>Plywood & Timber</span>
              <span style={{ cursor: 'pointer' }}>Domestic Wholesale</span>
              <span style={{ cursor: 'pointer' }}>Export Containers</span>
              <span style={{ cursor: 'pointer', color: '#b45309', borderBottom: '2px solid #b45309', paddingBottom: '4px', fontWeight: 700 }}>Sales Representatives</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a 
              href="#directory" 
              className="btn btn-primary" 
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', backgroundColor: '#78350f', borderColor: '#78350f' }}
            >
              <Phone size={14} />
              <span>Contact Sales Staff</span>
            </a>
          </div>

        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '3rem 1.25rem 2.25rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '1rem' }}>
            <Sparkles size={15} />
            <span>Cochin Wood Industries • Verified Sales Contact Directory</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '0.85rem', lineHeight: 1.2 }}>
            Connect Directly with Cochin Wood Sales Managers
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '780px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Looking for timber quotations, commercial/marine plywood supply, or export container shipments? Reach our specialized sales staff directly via <strong>WhatsApp</strong> or <strong>Phone Call</strong> in your native language.
          </p>

          {/* Sync indicator box */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', maxWidth: '850px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a' }} className="animate-pulse-slow"></span>
              <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                Live Feed from <strong>app.cochinwood.in</strong>: Displaying <strong>{publicSalesTeam.length} active sales managers</strong> with verified contact lines.
              </span>
            </div>
            <button 
              onClick={onNavigateToApp} 
              style={{ background: 'none', border: 'none', color: '#15803d', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}
            >
              Add/Edit in app.cochinwood.in <ChevronRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. MAIN DIRECTORY & INTERACTIVE FILTER BAR */}
      <div id="directory" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.25rem 4rem', width: '100%' }}>
        
        {/* Filter Card */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          
          {/* Top Row: Market Scope Tabs & Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Filter by Trade Scope:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'All', label: 'All Markets' },
                  { id: 'Domestic', label: '🇮🇳 Domestic (Kerala & Mangalore)' },
                  { id: 'Export', label: '🌍 Export (Middle East & GCC)' },
                  { id: 'Both', label: '🔄 Both Markets' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedDealing(tab.id)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: selectedDealing === tab.id ? '1px solid #78350f' : '1px solid #e2e8f0',
                      backgroundColor: selectedDealing === tab.id ? '#78350f' : '#ffffff',
                      color: selectedDealing === tab.id ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Search Representative or Territory:
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Kerala, GCC, Menon, +91..."
                  className="form-input"
                  style={{ paddingLeft: '2rem', minWidth: '240px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: Multi-Language Filter Pills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Filter by Spoken Language (Multi-Select):
              </label>
              {selectedLanguages.length > 0 && (
                <button
                  onClick={() => setSelectedLanguages([])}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear Language Filters
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {availableLanguages.map(lang => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguageFilter(lang)}
                    className={`preset-chip ${isSelected ? 'selected' : ''}`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Directory Cards Grid */}
        {filteredReps.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#94a3b8' }}>
              <UserCheck size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>No Sales Representatives Found</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              No active sales staff match your current filter combination on cochinwood.in.
            </p>
            <button 
              onClick={() => { setSelectedDealing('All'); setSelectedLanguages([]); setSearchQuery(''); }}
              className="btn btn-outline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredReps.map(rep => {
              const isDomestic = rep.dealing === 'Domestic';
              const isExport = rep.dealing === 'Export';
              const phoneClean = (rep.phone || '').replace(/\s+/g, '');
              const isPhoneRevealed = Boolean(revealedPhones[rep.id]);
              
              // Masked phone display against web scrapers
              const maskedPhone = rep.phone 
                ? `${rep.phone.slice(0, 6)} •••• ${rep.phone.slice(-2)}` 
                : '—';

              return (
                <div 
                  key={rep.id} 
                  className="card card-hover" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    overflow: 'hidden',
                    borderTop: isDomestic ? '4px solid #1d4ed8' : isExport ? '4px solid #059669' : '4px solid #7c3aed',
                    backgroundColor: '#ffffff'
                  }}
                >
                  
                  {/* Tier 1: Identity & Scope Header */}
                  <div style={{ padding: '1.25rem 1.25rem 0.85rem', display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                    <img 
                      src={rep.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
                      alt={rep.name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <span className={`badge ${
                          isDomestic ? 'badge-domestic' : isExport ? 'badge-export' : 'badge-both'
                        }`}>
                          {isDomestic && '🇮🇳 Domestic Trade'}
                          {isExport && '🌍 GCC / Export'}
                          {!isDomestic && !isExport && '🔄 Domestic & Export'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 800, marginBottom: '0.15rem' }}>
                        {rep.name}
                      </h3>
                      
                      <p style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                        {rep.title || 'Cochin Wood Sales Specialist'}
                      </p>

                      {rep.territory && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.725rem', color: '#64748b', marginTop: '0.3rem' }}>
                          <MapPin size={12} color="#64748b" />
                          <span>{rep.territory}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tier 2: Languages Spoken */}
                  <div style={{ padding: '0 1.25rem 0.85rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Globe size={12} />
                      <span>Languages Spoken:</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {rep.languages && rep.languages.length > 0 ? (
                        rep.languages.map(lang => {
                          const isHighlighted = selectedLanguages.includes(lang);
                          return (
                            <span 
                              key={lang} 
                              className="badge"
                              style={{ 
                                backgroundColor: isHighlighted ? '#fef3c7' : '#f1f5f9',
                                color: isHighlighted ? '#92400e' : '#334155',
                                border: isHighlighted ? '1px solid #fde68a' : '1px solid #e2e8f0',
                                fontWeight: isHighlighted ? 700 : 500,
                                fontSize: '0.72rem'
                              }}
                            >
                              {lang}
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>English</span>
                      )}
                    </div>
                  </div>

                  {/* Anti-Scraping Phone Number & Verified Badge Display */}
                  <div style={{ margin: '0 1.25rem 1rem', padding: '0.75rem 0.9rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Phone size={13} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Verified Sales Line</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                            {isPhoneRevealed ? rep.phone : maskedPhone}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => toggleRevealPhone(rep.id)}
                          title={isPhoneRevealed ? 'Mask number' : 'Click to reveal full number'}
                          style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.45rem', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.68rem' }}
                        >
                          {isPhoneRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                          <span>{isPhoneRevealed ? 'Hide' : 'Reveal'}</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(rep.phone, `phone-${rep.id}`)}
                          title="Copy phone number"
                          style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.45rem', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.68rem' }}
                        >
                          {copiedId === `phone-${rep.id}` ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                          <span>{copiedId === `phone-${rep.id}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tier 3: Action Matrix (Hero WhatsApp + Secondary Grid) */}
                  <div style={{ marginTop: 'auto', padding: '0.85rem 1.25rem', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    
                    {/* Hero CTA: WhatsApp Direct */}
                    <a
                      href={generateWhatsAppLink(rep)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTrackLead('whatsapp_chat', rep)}
                      className="btn btn-whatsapp"
                      style={{ width: '100%', padding: '0.65rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}
                    >
                      <MessageSquare size={16} />
                      <span>Chat on WhatsApp ({rep.whatsapp || rep.phone})</span>
                    </a>

                    {/* Secondary Action Grid: Call, vCard, Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.9fr', gap: '0.4rem' }}>
                      <a
                        href={`tel:${phoneClean}`}
                        onClick={() => handleTrackLead('phone_dial', rep)}
                        className="btn btn-phone"
                        style={{ padding: '0.45rem 0.5rem', fontSize: '0.75rem', textDecoration: 'none' }}
                      >
                        <Phone size={13} />
                        <span>Call Direct</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadVCard(rep)}
                        className="btn btn-vcard"
                        title="Download .vcf contact file for iPhone / Android contacts"
                        style={{ padding: '0.45rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Download size={13} />
                        <span>Save Contact</span>
                      </button>

                      <a
                        href={`mailto:${rep.email}?subject=${encodeURIComponent(`Quotation Inquiry - Cochin Wood Industries`)}`}
                        onClick={() => handleTrackLead('email_inquiry', rep)}
                        className="btn btn-email"
                        style={{ padding: '0.45rem 0.5rem', fontSize: '0.75rem', textDecoration: 'none' }}
                      >
                        <Mail size={13} />
                        <span>Email</span>
                      </a>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 5. WEBSITE FOOTER WITH DIRECT NUMBERS SUMMARY */}
      <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', padding: '2.5rem 1.25rem 2rem', marginTop: 'auto', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* Column 1: Company */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#b45309', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  CW
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem' }}>Cochin Wood Industries</h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Premium Timber, Commercial & Marine Plywood, Hardwood logs, and Decorative Wood Veneers. Factory and Head Office in Cochin, Kerala. Exporting globally.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                🌐 Customer Portal: <strong>cochinwood.in</strong> | 🏢 Staff Management: <strong>app.cochinwood.in</strong>
              </div>
            </div>

            {/* Column 2: Domestic Sales Direct Lines */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem' }}>
                🇮🇳 Domestic Sales Desk (Kerala & Mangalore)
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.8rem' }}>
                {publicSalesTeam.filter(u => u.dealing === 'Domestic' || u.dealing === 'Both').map(rep => (
                  <div key={rep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.35rem', borderBottom: '1px solid #1e293b' }}>
                    <span style={{ color: '#e2e8f0' }}>{rep.name} ({rep.territory || 'Domestic'}):</span>
                    <a href={`tel:${(rep.phone || '').replace(/\s+/g, '')}`} style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 700 }}>
                      {rep.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: International Export Direct Lines */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem' }}>
                🌍 Export Trade Desk (Gulf / Middle East)
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.8rem' }}>
                {publicSalesTeam.filter(u => u.dealing === 'Export' || u.dealing === 'Both').map(rep => (
                  <div key={rep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.35rem', borderBottom: '1px solid #1e293b' }}>
                    <span style={{ color: '#e2e8f0' }}>{rep.name} ({rep.territory || 'GCC/Global'}):</span>
                    <a href={`tel:${(rep.phone || '').replace(/\s+/g, '')}`} style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700 }}>
                      {rep.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span>&copy; {new Date().getFullYear()} Cochin Wood Industries (cochinwood.in). Verified sales contact numbers for timber and plywood procurement.</span>
            <button onClick={onNavigateToApp} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}>
              Staff Login (app.cochinwood.in)
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
