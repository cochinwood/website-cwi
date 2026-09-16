import React, { useState, useEffect, useRef } from 'react';
import { 
  X, AlertCircle, Check, Globe2, Phone, MessageSquare, 
  User, ChevronDown, Upload, Eye, Edit3
} from 'lucide-react';
import { LANGUAGES, DEALING_TYPES, USER_ROLES, REGIONAL_PRESETS, COUNTRY_CODES } from '../data/languages';

export default function UserModal({ isOpen, onClose, onSave, initialData }) {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'preview'
  const [countryCode, setCountryCode] = useState('+91');
  const [rawPhone, setRawPhone] = useState('');
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('+91');
  const [rawWhatsapp, setRawWhatsapp] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    whatsapp: '',
    role: 'Sales',
    dealing: '',
    languages: [],
    territory: '',
    avatar: '',
    status: 'Active',
    showOnWebsite: true
  });

  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [langSearch, setLangSearch] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (initialData !== prevInitialData || isOpen !== prevIsOpen) {
    setPrevInitialData(initialData);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (initialData) {
        const phoneMatch = (initialData.phone || '').match(/^(\+\d{1,4})\s*(.*)$/);
        const waMatch = (initialData.whatsapp || '').match(/^(\+\d{1,4})\s*(.*)$/);

        setCountryCode(phoneMatch ? phoneMatch[1] : '+91');
        setRawPhone(phoneMatch ? phoneMatch[2] : (initialData.phone || ''));
        setWhatsappCountryCode(waMatch ? waMatch[1] : (phoneMatch ? phoneMatch[1] : '+91'));
        setRawWhatsapp(waMatch ? waMatch[2] : (initialData.whatsapp || initialData.phone || ''));

        setFormData({
          name: initialData.name || '',
          title: initialData.title || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          whatsapp: initialData.whatsapp || initialData.phone || '',
          role: initialData.role || 'Sales',
          dealing: initialData.dealing || '',
          languages: initialData.languages || [],
          territory: initialData.territory || '',
          avatar: initialData.avatar || '',
          status: initialData.status || 'Active',
          showOnWebsite: initialData.showOnWebsite !== undefined ? initialData.showOnWebsite : true
        });
      } else {
        setCountryCode('+91');
        setRawPhone('');
        setWhatsappCountryCode('+91');
        setRawWhatsapp('');

        setFormData({
          name: '',
          title: 'Sales Specialist',
          email: '',
          phone: '',
          whatsapp: '',
          role: 'Sales',
          dealing: '',
          languages: ['English'],
          territory: '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
          status: 'Active',
          showOnWebsite: true
        });
      }
      setIsDirty(false);
      setErrors({});
      setActiveTab('form');
    }
  }

  // Click outside listener for language dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const isSalesRole = formData.role === 'Sales';

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleSafeClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const toggleLanguage = (langName) => {
    markDirty();
    setFormData(prev => {
      const exists = prev.languages.includes(langName);
      const updated = exists 
        ? prev.languages.filter(l => l !== langName)
        : [...prev.languages, langName];
      return { ...prev, languages: updated };
    });
    if (errors.languages) {
      setErrors(prev => ({ ...prev, languages: null }));
    }
  };

  const removeLanguage = (langName, e) => {
    e.stopPropagation();
    markDirty();
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== langName)
    }));
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        markDirty();
        setFormData(prev => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredLanguages = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.native.toLowerCase().includes(langSearch.toLowerCase())
  );

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (isSalesRole) {
      if (!formData.dealing) {
        newErrors.dealing = 'MANDATORY: Select Dealing scope (Domestic, Export, or Both).';
      }
      if (!formData.languages || formData.languages.length === 0) {
        newErrors.languages = 'MANDATORY: At least one spoken language is required.';
      }

      const cleanPhoneDigits = rawPhone.replace(/\D/g, '');
      if (!cleanPhoneDigits || cleanPhoneDigits.length < 7) {
        newErrors.phone = 'Valid phone number is required for customer direct dial';
      }

      const cleanWaDigits = rawWhatsapp.replace(/\D/g, '');
      if (!cleanWaDigits || cleanWaDigits.length < 7) {
        newErrors.whatsapp = 'Valid WhatsApp number is required for direct customer messaging';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Build formatted international phone & whatsapp numbers
      const formattedPhone = rawPhone.trim() ? `${countryCode} ${rawPhone.trim()}` : '';
      const formattedWhatsapp = rawWhatsapp.trim() ? `${whatsappCountryCode} ${rawWhatsapp.trim()}` : formattedPhone;

      onSave({
        ...formData,
        phone: formattedPhone,
        whatsapp: formattedWhatsapp,
        id: initialData ? initialData.id : `usr-${Date.now()}`
      });
      onClose();
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleSafeClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}
      >
        
        {/* Modal Header with View Switcher */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                {initialData ? `Edit ${initialData.name}` : 'Add New Staff Member'}
              </h3>
              {isDirty && (
                <span style={{ fontSize: '0.65rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                  Unsaved Changes
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Configure internal role permissions & public website directory appearance
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* View Mode Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'form' ? '#ffffff' : 'transparent',
                  color: activeTab === 'form' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'form' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Edit3 size={13} />
                <span>Form</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'preview' ? '#ffffff' : 'transparent',
                  color: activeTab === 'preview' ? '#059669' : '#64748b',
                  boxShadow: activeTab === 'preview' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Eye size={13} />
                <span>Live Card Preview</span>
              </button>
            </div>

            <button 
              onClick={handleSafeClose}
              title="Close modal"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: '#64748b', borderRadius: '0.375rem', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Either Form Tab or Live Preview Tab */}
        {activeTab === 'preview' ? (
          <div style={{ padding: '2rem 1.5rem', overflowY: 'auto', backgroundColor: '#f8fafc', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                Previewing how this manager will appear to customers on cochinwood.in
              </span>
            </div>

            {/* Rendered Preview Card */}
            <div style={{ maxWidth: '420px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 1.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <img 
                  src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
                  alt={formData.name || 'Sales Representative'}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                />
                <div>
                  <span className={`badge ${
                    formData.dealing === 'Domestic' ? 'badge-domestic' :
                    formData.dealing === 'Export' ? 'badge-export' : 'badge-both'
                  }`} style={{ marginBottom: '0.3rem' }}>
                    {formData.dealing === 'Domestic' ? '🇮🇳 Domestic Deals' :
                     formData.dealing === 'Export' ? '🌍 Export Desk' : '🔄 Domestic & Export'}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>
                    {formData.name || 'Representative Name'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                    {formData.title || 'Cochin Wood Sales Specialist'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    📍 {formData.territory || 'Kerala / GCC Trade Desk'}
                  </p>
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Spoken Languages:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {formData.languages.map(l => (
                    <span key={l} className="badge badge-lang">{l}</span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155' }}>
                <div>📞 Phone: <strong>{countryCode} {rawPhone || '98450 12345'}</strong></div>
                <div style={{ color: '#166534', marginTop: '2px' }}>💬 WhatsApp: <strong>{whatsappCountryCode} {rawWhatsapp || rawPhone || '98450 12345'}</strong></div>
              </div>

              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" className="btn btn-whatsapp" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-phone" style={{ fontSize: '0.75rem' }}>
                    <Phone size={13} />
                    <span>Call Direct</span>
                  </button>
                  <button type="button" className="btn btn-vcard" style={{ fontSize: '0.75rem' }}>
                    <span>📥 Save vCard</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveTab('form')}
              >
                Return to Editing Form
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            
            {/* Basic Identity & Avatar Row */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} /> Basic Identity & Photo
              </h4>
              
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                {/* Photo uploader with preview */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ position: 'relative', width: '68px', height: '68px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #cbd5e1', backgroundColor: '#f1f5f9' }}>
                    <img 
                      src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#475569' }}
                  >
                    <Upload size={11} />
                    <span>Upload</span>
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={handleImageFileUpload}
                  />
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Full Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Suresh Kumar"
                      value={formData.name}
                      onChange={(e) => {
                        markDirty();
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: null });
                      }}
                    />
                    {errors.name && <p className="form-error-msg"><AlertCircle size={13} /> {errors.name}</p>}
                  </div>

                  <div>
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input 
                      type="email" 
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="suresh@cochinwood.in"
                      value={formData.email}
                      onChange={(e) => {
                        markDirty();
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                    />
                    {errors.email && <p className="form-error-msg"><AlertCircle size={13} /> {errors.email}</p>}
                  </div>

                  <div>
                    <label className="form-label">Designation / Title</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Regional Sales Manager"
                      value={formData.title}
                      onChange={(e) => {
                        markDirty();
                        setFormData({ ...formData, title: e.target.value });
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label">User Role <span className="required">*</span></label>
                    <select 
                      className="form-input"
                      value={formData.role}
                      onChange={(e) => {
                        markDirty();
                        const newRole = e.target.value;
                        setFormData({ 
                          ...formData, 
                          role: newRole,
                          showOnWebsite: newRole === 'Sales' ? true : false
                        });
                        setErrors({});
                      }}
                      style={{ fontWeight: 600 }}
                    >
                      {USER_ROLES.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* MANDATORY SALES SECTION */}
            {isSalesRole && (
              <div style={{ padding: '1.25rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      MANDATORY FOR SALES
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af' }}>
                      Customer Contact & Trade Scope Specifications
                    </span>
                  </div>
                </div>

                {/* 1. DEALING TYPE */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#1e3a8a', fontWeight: 700 }}>
                    Dealing Scope <span className="required">*</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#475569', marginLeft: '6px' }}>
                      (Select Domestic, Export, or Both)
                    </span>
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {DEALING_TYPES.map(type => {
                      const isSelected = formData.dealing === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => {
                            markDirty();
                            setFormData({ ...formData, dealing: type.id });
                            if (errors.dealing) setErrors({ ...errors, dealing: null });
                          }}
                          style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                            backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 2px 6px rgba(37,99,235,0.15)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#1d4ed8' : '#334155' }}>
                              {type.label}
                            </span>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: isSelected ? '5px solid #2563eb' : '1px solid #94a3b8', backgroundColor: '#fff' }} />
                          </div>
                          <p style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.3 }}>
                            {type.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {errors.dealing && <p className="form-error-msg" style={{ marginTop: '0.4rem' }}><AlertCircle size={13} /> {errors.dealing}</p>}
                </div>

                {/* 2. REGIONAL LANGUAGE QUICK-PICK PRESETS + SEARCHABLE DROPDOWN */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ color: '#1e3a8a', fontWeight: 700, margin: 0 }}>
                      Languages Spoken <span className="required">*</span>
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                      {formData.languages.length} selected
                    </span>
                  </div>

                  {/* Regional Quick Presets */}
                  <div style={{ marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                      ⚡ 1-Click Regional Trade Presets (South India & GCC):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {REGIONAL_PRESETS.map(p => {
                        const isSelected = formData.languages.includes(p.name);
                        return (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => toggleLanguage(p.name)}
                            className={`preset-chip ${isSelected ? 'selected' : ''}`}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{p.name}</span>
                            <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({p.native})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem', minHeight: '30px' }}>
                    {formData.languages.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        No languages selected yet. Click presets above or search below.
                      </span>
                    ) : (
                      formData.languages.map(lang => (
                        <span
                          key={lang}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: '#ffffff',
                            color: '#1e40af',
                            border: '1px solid #93c5fd',
                            borderRadius: '9999px',
                            padding: '0.2rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          <Globe2 size={11} />
                          {lang}
                          <button
                            type="button"
                            onClick={(e) => removeLanguage(lang, e)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', padding: 0 }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Full Searchable Dropdown */}
                  <div style={{ position: 'relative' }} ref={langDropdownRef}>
                    <div
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.8rem',
                        backgroundColor: '#ffffff',
                        border: errors.languages ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                        More languages (Search 30+ 8th Schedule & International)...
                      </span>
                      <ChevronDown size={15} color="#64748b" />
                    </div>

                    {isLangDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                        zIndex: 30,
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ padding: '0.4rem', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, backgroundColor: '#ffffff' }}>
                          <input
                            type="text"
                            placeholder="Type to search language..."
                            value={langSearch}
                            onChange={(e) => setLangSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.35rem 0.55rem', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                        <div style={{ padding: '0.25rem' }}>
                          {filteredLanguages.map(l => {
                            const isSelected = formData.languages.includes(l.name);
                            return (
                              <div
                                key={l.code}
                                onClick={() => toggleLanguage(l.name)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.4rem 0.7rem',
                                  borderRadius: '0.375rem',
                                  cursor: 'pointer',
                                  backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                  color: isSelected ? '#1d4ed8' : '#334155',
                                  fontSize: '0.8rem',
                                  fontWeight: isSelected ? 600 : 400
                                }}
                              >
                                <span>{l.name} <span style={{ color: '#94a3b8', fontSize: '0.725rem' }}>({l.native})</span></span>
                                {isSelected && <Check size={14} color="#2563eb" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.languages && <p className="form-error-msg" style={{ marginTop: '0.4rem' }}><AlertCircle size={13} /> {errors.languages}</p>}
                </div>

                {/* 3. E.164 PHONE & WHATSAPP WITH COUNTRY SELECTOR */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                  
                  {/* Phone */}
                  <div>
                    <label className="form-label" style={{ color: '#1e3a8a' }}>
                      Direct Phone <span className="required">*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          markDirty();
                          setCountryCode(e.target.value);
                          if (!rawWhatsapp) setWhatsappCountryCode(e.target.value);
                        }}
                        style={{ width: '90px', padding: '0.5rem 0.3rem', fontSize: '0.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 600 }}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="98450 12345"
                        value={rawPhone}
                        onChange={(e) => {
                          markDirty();
                          const val = e.target.value;
                          setRawPhone(val);
                          if (!rawWhatsapp) setRawWhatsapp(val);
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                      />
                    </div>
                    {errors.phone && <p className="form-error-msg"><AlertCircle size={13} /> {errors.phone}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="form-label" style={{ color: '#1e3a8a' }}>
                      Direct WhatsApp Number <span className="required">*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <select
                        value={whatsappCountryCode}
                        onChange={(e) => {
                          markDirty();
                          setWhatsappCountryCode(e.target.value);
                        }}
                        style={{ width: '90px', padding: '0.5rem 0.3rem', fontSize: '0.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 600 }}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        className={`form-input ${errors.whatsapp ? 'error' : ''}`}
                        placeholder="98450 12345"
                        value={rawWhatsapp}
                        onChange={(e) => {
                          markDirty();
                          setRawWhatsapp(e.target.value);
                          if (errors.whatsapp) setErrors({ ...errors, whatsapp: null });
                        }}
                      />
                    </div>
                    {errors.whatsapp && <p className="form-error-msg"><AlertCircle size={13} /> {errors.whatsapp}</p>}
                  </div>

                </div>

                {/* Territory & Public Visibility */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <label className="form-label" style={{ color: '#1e3a8a' }}>
                      Assigned Region / Territory
                    </label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Kerala (Kochi/Calicut), Mangalore, GCC"
                      value={formData.territory}
                      onChange={(e) => {
                        markDirty();
                        setFormData({ ...formData, territory: e.target.value });
                      }}
                    />
                  </div>

                  <div style={{ paddingTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600, color: '#1e3a8a' }}>
                      <input 
                        type="checkbox"
                        checked={formData.showOnWebsite}
                        onChange={(e) => {
                          markDirty();
                          setFormData({ ...formData, showOnWebsite: e.target.checked });
                        }}
                        style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <span>Show in cochinwood.in Directory</span>
                    </label>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '1.5rem' }}>
                      Enables buyers to reach them directly
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Profile Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Staff Status</span>
                <p style={{ fontSize: '0.725rem', color: '#64748b' }}>Inactive users are automatically hidden from the customer website</p>
              </div>
              <select
                value={formData.status}
                onChange={(e) => {
                  markDirty();
                  setFormData({ ...formData, status: e.target.value });
                }}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Modal Actions Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.8rem' }}
                onClick={() => setActiveTab('preview')}
              >
                <Eye size={14} />
                <span>Preview Card</span>
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleSafeClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#78350f', borderColor: '#78350f' }}>
                  {initialData ? 'Save Changes & Sync' : 'Create & Sync Live'}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

