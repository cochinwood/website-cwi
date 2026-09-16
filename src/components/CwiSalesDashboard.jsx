import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Mail, 
  Users2, 
  Building2, 
  Contact2, 
  FileSpreadsheet, 
  ShoppingCart, 
  Package, 
  Factory, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  PhoneCall, 
  RefreshCw, 
  X, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  Truck,
  Warehouse
} from 'lucide-react';

export default function CwiSalesDashboard({ users: _users, onNavigateToTeamDirectory, onNavigateToPublicSite }) {
  // Global Period Filter
  const [period, setPeriod] = useState('This month'); // 'This month' | 'Last month' | 'All time'
  
  // Active Persona / Role Switcher (Simulates Edwin David vs Rep)
  const [currentPersona, setCurrentPersona] = useState('Edwin David'); // 'Edwin David' | 'Gyanaranjan Parida' | 'Zareen Ahmed'
  
  // Notification Toggle State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Expandable accordions
  const [expandPiTeam, setExpandPiTeam] = useState(false);
  const [expandAssignedLeads, setExpandAssignedLeads] = useState(false);
  
  // Interactive Modals / Drawers
  const [activeDrawer, setActiveDrawer] = useState(null); 
  // 'pi-rescue' | 'lead-distributor' | 'callback-triage' | 'my-work' | 'messages-triage' | 'email-triage' | 'accounts-overview' | 'orders-pipeline' | 'products-catalog' | 'factories-status'

  const [piFilterDays, setPiFilterDays] = useState('all'); // 'all' | 'over30' | '14to30' | 'under14'
  const [callbackFilterRep, setCallbackFilterRep] = useState('All');

  // Dynamic Live State (allows testing actual resolutions)
  const [unassignedLeadsCount, setUnassignedLeadsCount] = useState(2668);
  const [distributionSuccessToast, setDistributionSuccessToast] = useState(null);
  const [rebalancedToast, setRebalancedToast] = useState(null);
  const [messagesBadgeCount, setMessagesBadgeCount] = useState(515);

  // Overdue callbacks breakdown state
  const [callbacksState, setCallbacksState] = useState([
    { id: 'cb-1', customer: 'Kannur Veneers & Panels', contact: 'M. P. Hameed', phone: '+91 94471 22334', rep: 'Gyanaranjan Parida', promisedDate: '12 Sep 2026', delayDays: 4, value: '₹ 8,40,000', note: 'Awaiting revised discount for 18mm Marine Plywood batch' },
    { id: 'cb-2', customer: 'Malabar Timber Traders', contact: 'K. V. Suresh', phone: '+91 98450 66778', rep: 'Gyanaranjan Parida', promisedDate: '13 Sep 2026', delayDays: 3, value: '₹ 14,20,000', note: 'Requested teak logs moisture test certificate' },
    { id: 'cb-3', customer: 'Ernakulam Modulars', contact: 'Deepak Jacob', phone: '+91 97451 99882', rep: 'Gyanaranjan Parida', promisedDate: '14 Sep 2026', delayDays: 2, value: '₹ 6,10,000', note: 'Follow up on sample board delivery confirmation' },
    { id: 'cb-4', customer: 'Calicut Plywood Mart', contact: 'Riyaz Ali', phone: '+91 94460 33441', rep: 'Sibi Sanichan', promisedDate: '11 Sep 2026', delayDays: 5, value: '₹ 11,50,000', note: 'Needs GST invoice breakdown for bulk consignment' },
    { id: 'cb-5', customer: 'Gulf Timber LLC (Sharjah)', contact: 'Tariq Al-Hashemi', phone: '+971 55 443 2190', rep: 'Zareen Ahmed', promisedDate: '15 Sep 2026', delayDays: 1, value: '$48,000', note: 'Inquiring on container shipment port arrival date' },
    { id: 'cb-6', customer: 'Bangalore Commercial Ply', contact: 'G. Sundaram', phone: '+91 98800 11223', rep: 'Basil John', promisedDate: '14 Sep 2026', delayDays: 2, value: '₹ 9,80,000', note: 'Reconfirming factory lead time for 2,000 flush doors' },
  ]);

  // Tasks State
  const [tasksState, setTasksState] = useState([
    { id: 'tsk-1', title: 'Approve 4% export volume rebate for Al-Futtaim Dubai', rep: 'Edwin David', due: '14 Sep 2026', priority: 'High', completed: false },
    { id: 'tsk-2', title: 'Verify GST credit notes for Kochi timber yards (August)', rep: 'Edwin David', due: '13 Sep 2026', priority: 'Urgent', completed: false },
    { id: 'tsk-3', title: 'Sign off Perumbavoor mill FSC lumber certification', rep: 'Priya Nambiar', due: '12 Sep 2026', priority: 'Medium', completed: false },
    { id: 'tsk-4', title: 'Dispatch sample swatches for teak veneer to Bangalore', rep: 'Gyanaranjan Parida', due: '15 Sep 2026', priority: 'Medium', completed: false },
    { id: 'tsk-5', title: 'Review credit limit extension for Thrissur Interiors', rep: 'Edwin David', due: '14 Sep 2026', priority: 'High', completed: false },
    { id: 'tsk-6', title: 'Audit missing transporter E-Way bills for Kannur dispatch', rep: 'Sibi Sanichan', due: '15 Sep 2026', priority: 'Medium', completed: false }
  ]);

  // Sample Stalled PIs
  const [piListState, setPiListState] = useState([
    { id: 'PI-2026-881', client: 'Al-Rayyan Timber & Decor (Doha, Qatar)', amount: '$64,200', type: 'Export', ageDays: 52, rep: 'Zareen Ahmed', status: 'Pending LC Opening', tier: 'over30', contact: '+974 4455 6677' },
    { id: 'PI-2026-842', client: 'Malabar Heritage Resorts (Wayanad)', amount: '₹ 38,50,000', type: 'Domestic', ageDays: 46, rep: 'Rahul Menon', status: 'Architect Specification Delay', tier: 'over30', contact: '+91 98450 11223' },
    { id: 'PI-2026-819', client: 'Kochi Waterfront Builders (Marine Drive)', amount: '₹ 72,00,000', type: 'Domestic', ageDays: 38, rep: 'Gyanaranjan Parida', status: 'Awaiting Advance Cheque', tier: 'over30', contact: '+91 94470 55441' },
    { id: 'PI-2026-790', client: 'Euro-Nordic Wood GmbH (Hamburg)', amount: '$128,500', type: 'Export', ageDays: 34, rep: 'Elena Rostova', status: 'Fumigation Certificate Review', tier: 'over30', contact: '+49 40 123456' },
    { id: 'PI-2026-904', client: 'Kozhikode Interior Designers Asscn', amount: '₹ 22,10,000', type: 'Domestic', ageDays: 24, rep: 'Sibi Sanichan', status: 'Credit Term Negotiation', tier: '14to30', contact: '+91 98460 77889' },
    { id: 'PI-2026-918', client: 'Mangalore Port Plywood Depot', amount: '₹ 18,40,000', type: 'Domestic', ageDays: 19, rep: 'Rahul Menon', status: 'PO Generation Pending', tier: '14to30', contact: '+91 94480 33221' },
    { id: 'PI-2026-955', client: 'Apex Commercial Infra (Bangalore)', amount: '₹ 45,00,000', type: 'Domestic', ageDays: 8, rep: 'Vikramaditya Rao', status: 'Fresh Quote Sent', tier: 'under14', contact: '+91 98201 44556' },
    { id: 'PI-2026-962', client: 'Sultanate Trading Co. (Muscat)', amount: '$54,000', type: 'Export', ageDays: 5, rep: 'Zareen Ahmed', status: 'Under Review by Buyer', tier: 'under14', contact: '+968 24 123456' }
  ]);

  // Dynamic KPI data based on period
  const periodKpiData = {
    'This month': {
      pisIssued: 86,
      dateLabel: 'PIS ISSUED · SEP 2026',
      growth: '+14% MoM',
      avgTurnaround: '3.8 Days',
      target: '100 PIs (86%)',
      amountText: '₹ 9,97,68,781.00 + $478,717.00',
      dealsLabel: 'OFFERED ON PIS · 59 GST + 27 EXPORT',
      pipelineValue: '~₹ 13.98 Cr',
      domesticText: '₹ 9.97 Cr (59 Deals)',
      exportText: '$478,717 USD (27 Deals)',
      weightedCloses: '~₹ 6.45 Cr'
    },
    'Last month': {
      pisIssued: 74,
      dateLabel: 'PIS ISSUED · AUG 2026',
      growth: '+9% MoM',
      avgTurnaround: '4.2 Days',
      target: '80 PIs (92%)',
      amountText: '₹ 8,42,15,400.00 + $410,500.00',
      dealsLabel: 'OFFERED ON PIS · 52 GST + 22 EXPORT',
      pipelineValue: '~₹ 11.85 Cr',
      domesticText: '₹ 8.42 Cr (52 Deals)',
      exportText: '$410,500 USD (22 Deals)',
      weightedCloses: '~₹ 5.90 Cr'
    },
    'All time': {
      pisIssued: '1,420',
      dateLabel: 'TOTAL PIS ISSUED (SINCE 2024)',
      growth: '+38% YoY',
      avgTurnaround: '4.0 Days',
      target: '1,500 PIs (94%)',
      amountText: '₹ 164,80,00,000.00 + $7,920,000.00',
      dealsLabel: 'CUMULATIVE VALUE OFFERED',
      pipelineValue: '~₹ 230.8 Cr',
      domesticText: '₹ 164.8 Cr (980 Deals)',
      exportText: '$7,920,000 USD (440 Deals)',
      weightedCloses: '~₹ 182.4 Cr'
    }
  };

  const currentKpi = periodKpiData[period] || periodKpiData['This month'];

  // Lead auto-distribution simulation
  const handleAutoDistributeLeads = (batchSize) => {
    const allocated = Math.min(batchSize, unassignedLeadsCount);
    setUnassignedLeadsCount(prev => Math.max(0, prev - allocated));
    setDistributionSuccessToast(`⚡ Successfully routed ${allocated.toLocaleString()} leads across 5 active sales reps based on spoken languages & territory rules!`);
    setTimeout(() => setDistributionSuccessToast(null), 5000);
    setActiveDrawer(null);
  };

  // Rebalance Gyanaranjan Parida's callbacks
  const handleRebalanceCallbacks = () => {
    setCallbacksState(prev => prev.map((cb, idx) => {
      if (cb.rep === 'Gyanaranjan Parida' && idx % 2 === 0) {
        return { ...cb, rep: 'Basil John', note: 'Auto-rebalanced by Edwin David to clear team backlog' };
      }
      return cb;
    }));
    setRebalancedToast('✅ Rebalanced 15 overdue callbacks from Gyanaranjan Parida to Basil John & Robin Paulose!');
    setTimeout(() => setRebalancedToast(null), 5000);
  };

  // Quick WhatsApp Nudge for Stalled PI
  const handleSendPiNudge = (piId, client, phone) => {
    alert(`Triggered automated WhatsApp proforma reminder to ${client} (${phone}):\n"Greetings from Cochin Wood Industries. Your proforma invoice #${piId} is reserved in our production allocation. Kindly confirm to prevent batch reassignment."`);
  };

  const filteredPis = piListState.filter(pi => {
    if (piFilterDays === 'over30') return pi.tier === 'over30';
    if (piFilterDays === '14to30') return pi.tier === '14to30';
    if (piFilterDays === 'under14') return pi.tier === 'under14';
    return true;
  });

  const filteredCallbacks = callbacksState.filter(cb => {
    if (callbackFilterRep === 'All') return true;
    return cb.rep === callbackFilterRep;
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', backgroundColor: '#fcfdfc', color: '#1e293b' }}>
      
      {/* Toast Alerts */}
      {distributionSuccessToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#064e3b',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          border: '1px solid #059669'
        }} className="animate-fade-in">
          <Sparkles size={18} color="#34d399" />
          <span>{distributionSuccessToast}</span>
          <button onClick={() => setDistributionSuccessToast(null)} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {rebalancedToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#1e3a8a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          border: '1px solid #3b82f6'
        }} className="animate-fade-in">
          <CheckCircle2 size={18} color="#60a5fa" />
          <span>{rebalancedToast}</span>
          <button onClick={() => setRebalancedToast(null)} style={{ background: 'none', border: 'none', color: '#bfdbfe', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* LEFT SIDEBAR - Authentic Cochin Wood Industries ERP Nav */}
      <aside style={{
        width: '230px',
        backgroundColor: '#063b2f',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderRight: '1px solid #042f26'
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#042f26', color: '#10b981', fontWeight: 800, fontSize: '0.8rem' }}>
              CW
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Cochin Wood</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a7f3d0' }}>Industries</div>
              <div style={{ fontSize: '0.625rem', color: '#6ee7b7', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>SALES & ORDERS</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.6rem 0.75rem', 
                borderRadius: '0.375rem', 
                backgroundColor: 'rgba(255,255,255,0.12)', 
                color: '#ffffff', 
                fontWeight: 600, 
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <LayoutDashboard size={16} color="#34d399" />
              <span>Dashboard</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('my-work')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.6rem 0.75rem', 
                borderRadius: '0.375rem', 
                color: '#cbd5e1', 
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <CheckSquare size={16} />
              <span>My work</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>6</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('messages-triage')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.6rem 0.75rem', 
                borderRadius: '0.375rem', 
                color: '#cbd5e1', 
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MessageSquare size={16} />
              <span>Messages</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#e06d44', color: '#ffffff', fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: 700 }}>
                {messagesBadgeCount}
              </span>
            </div>

            <div 
              onClick={() => setActiveDrawer('email-triage')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Mail size={16} />
              <span>Email</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>4</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('lead-distributor')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Users2 size={16} />
              <span>Leads</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#b45309', color: '#fff', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>
                {unassignedLeadsCount.toLocaleString()}
              </span>
            </div>

            <div 
              onClick={() => setActiveDrawer('accounts-overview')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Building2 size={16} />
              <span>Accounts</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#10b981', color: '#fff', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>B2B</span>
            </div>

            <div 
              onClick={onNavigateToTeamDirectory}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Contact2 size={16} />
              <span>Contacts & Team</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('pi-rescue')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FileSpreadsheet size={16} />
              <span>Proforma Invoice</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#047857', color: '#fff', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>168</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('orders-pipeline')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ShoppingCart size={16} />
              <span>Orders</span>
              <span style={{ marginLeft: 'auto', backgroundColor: '#6366f1', color: '#fff', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>28</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('products-catalog')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Package size={16} />
              <span>Products</span>
            </div>

            <div 
              onClick={() => setActiveDrawer('factories-status')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.375rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Factory size={16} />
              <span>Factories</span>
              <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            </div>
          </nav>
        </div>

        {/* User Card */}
        <div style={{ padding: '0.75rem 0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#042c22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              E
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentPersona}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>edwin.david@cochinwood.in</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
            <button 
              onClick={() => alert('Simulated sign out')}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: 0 }}
            >
              <LogOut size={12} />
              <span>Sign out</span>
            </button>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: notificationsEnabled ? '#34d399' : '#94a3b8', padding: 0 }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: notificationsEnabled ? '#10b981' : '#94a3b8' }}></span>
              <span>{notificationsEnabled ? 'Notifications on' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN COCKPIT VIEW */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>Dashboard</h1>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '2px' }}>Who issued what, and what it came to</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {onNavigateToPublicSite && (
              <button 
                onClick={onNavigateToPublicSite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#059669',
                  cursor: 'pointer'
                }}
              >
                <span>cochinwood.in Directory</span>
                <ExternalLink size={13} />
              </button>
            )}

            {/* Persona Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Viewing As:</span>
              <select 
                value={currentPersona}
                onChange={(e) => setCurrentPersona(e.target.value)}
                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Edwin David">Edwin David (Head of Sales & Ops)</option>
                <option value="Gyanaranjan Parida">Gyanaranjan Parida (Domestic Sales Rep)</option>
                <option value="Zareen Ahmed">Zareen Ahmed (Export Director)</option>
              </select>
            </div>

            {/* Time Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '0.25rem' }}>Cards below the desks</span>
              <button 
                onClick={() => setPeriod('This month')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: period === 'This month' ? '#064e3b' : 'transparent',
                  color: period === 'This month' ? '#ffffff' : '#64748b'
                }}
              >
                This month
              </button>
              <button 
                onClick={() => setPeriod('Last month')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: period === 'Last month' ? '#064e3b' : '#ffffff',
                  color: period === 'Last month' ? '#ffffff' : '#64748b'
                }}
              >
                Last month
              </button>
              <button 
                onClick={() => setPeriod('All time')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: period === 'All time' ? '#064e3b' : '#ffffff',
                  color: period === 'All time' ? '#ffffff' : '#64748b'
                }}
              >
                All time
              </button>
            </div>
          </div>
        </div>

        {/* TOP KPI CARDS - Dynamic based on selected period */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(400px, 2fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          
          {/* Card 1: PIs Issued */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.625rem', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{currentKpi.pisIssued}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                  {currentKpi.dateLabel}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                <TrendingUp size={14} />
                <span>{currentKpi.growth}</span>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Avg Turnaround: <strong>{currentKpi.avgTurnaround}</strong></span>
              <span>Target: <strong>{currentKpi.target}</strong></span>
            </div>
          </div>

          {/* Card 2: Total Offered Amount */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.625rem', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  {currentKpi.amountText}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                  {currentKpi.dealsLabel}
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, backgroundColor: '#eff6ff', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                Pipeline: {currentKpi.pipelineValue}
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Domestic (GST): <strong>{currentKpi.domesticText}</strong></span>
              <span>Export (GCC/Global): <strong>{currentKpi.exportText}</strong></span>
              <span style={{ color: '#059669', fontWeight: 600 }}>Weighted Closes: {currentKpi.weightedCloses}</span>
            </div>
          </div>

        </div>

        {/* SECTION: THIS MORNING THE WORK THAT IS WAITING */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 700, color: '#064e3b', fontSize: '1.15rem' }}>This morning</span>
            <span style={{ color: '#475569', fontSize: '1rem', marginLeft: '0.4rem' }}>the work that is waiting, and where it gets done</span>
          </div>

          {/* ITEM 1: 168 PIs awaiting order or closure */}
          <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '320px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  168 PIs awaiting an order or closure
                </h3>

                {/* Progress Bar with 3 brackets */}
                <div style={{ width: '100%', maxWidth: '620px', height: '14px', borderRadius: '2px', overflow: 'hidden', display: 'flex', backgroundColor: '#e2e8f0' }}>
                  <div 
                    title="Over 30 days: 45 PIs (₹3.2+ Cr at severe risk)"
                    onClick={() => { setPiFilterDays('over30'); setActiveDrawer('pi-rescue'); }}
                    style={{ width: '26.8%', backgroundColor: '#993d18', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                  />
                  <div 
                    title="14-30 days: 48 PIs"
                    onClick={() => { setPiFilterDays('14to30'); setActiveDrawer('pi-rescue'); }}
                    style={{ width: '28.5%', backgroundColor: '#c26e1a', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                  />
                  <div 
                    title="Under 14 days: 75 PIs"
                    onClick={() => { setPiFilterDays('under14'); setActiveDrawer('pi-rescue'); }}
                    style={{ width: '44.7%', backgroundColor: '#89b88e', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                  />
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.6rem', fontSize: '0.8rem', color: '#475569', flexWrap: 'wrap' }}>
                  <span 
                    onClick={() => { setPiFilterDays('over30'); setActiveDrawer('pi-rescue'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#993d18', display: 'inline-block' }}></span>
                    <span>over 30 days <strong style={{ color: '#0f172a' }}>45</strong></span>
                  </span>

                  <span 
                    onClick={() => { setPiFilterDays('14to30'); setActiveDrawer('pi-rescue'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#c26e1a', display: 'inline-block' }}></span>
                    <span>14–30 days <strong style={{ color: '#0f172a' }}>48</strong></span>
                  </span>

                  <span 
                    onClick={() => { setPiFilterDays('under14'); setActiveDrawer('pi-rescue'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#89b88e', display: 'inline-block' }}></span>
                    <span>under 14 <strong style={{ color: '#0f172a' }}>75</strong></span>
                  </span>

                  <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>oldest 60 days</span>
                </div>

                {/* Toggle: By team member */}
                <button 
                  onClick={() => setExpandPiTeam(!expandPiTeam)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginTop: '0.6rem',
                    padding: 0
                  }}
                >
                  {expandPiTeam ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span style={{ textDecoration: 'underline' }}>By team member</span>
                </button>

                {/* Expanded Team breakdown */}
                {expandPiTeam && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', maxWidth: '620px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Pending PIs by Sales Rep:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.75rem' }}>
                      <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                        <div>Rahul Menon</div>
                        <strong style={{ color: '#993d18' }}>38 PIs</strong> (12 &gt;30d)
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                        <div>Zareen Ahmed</div>
                        <strong style={{ color: '#c26e1a' }}>27 PIs</strong> (9 &gt;30d)
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                        <div>Gyanaranjan P.</div>
                        <strong style={{ color: '#993d18' }}>41 PIs</strong> (14 &gt;30d)
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                        <div>Sibi Sanichan</div>
                        <strong style={{ color: '#c26e1a' }}>29 PIs</strong> (7 &gt;30d)
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                        <div>Vikram / Elena</div>
                        <strong style={{ color: '#059669' }}>33 PIs</strong> (3 &gt;30d)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ alignSelf: 'center' }}>
                <button 
                  onClick={() => { setPiFilterDays('all'); setActiveDrawer('pi-rescue'); }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #059669',
                    color: '#059669',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ecfdf5'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <span>Open the PI list</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* ITEM 2: 2,668 unassigned leads with no call recorded */}
          <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {unassignedLeadsCount.toLocaleString()} unassigned leads with no call recorded
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={14} />
                  <span>oldest arrived 14 Jun 2024 (Over 2 years unattended!)</span>
                </div>

                {/* Toggle: Assigned leads with no call recorded */}
                <button 
                  onClick={() => setExpandAssignedLeads(!expandAssignedLeads)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginTop: '0.6rem',
                    padding: 0
                  }}
                >
                  {expandAssignedLeads ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span style={{ textDecoration: 'underline' }}>Assigned leads with no call recorded (412 leads)</span>
                </button>

                {expandAssignedLeads && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '0.5rem', border: '1px solid #ffedd5', fontSize: '0.78rem', color: '#9a3412', maxWidth: '620px' }}>
                    ⚠️ 412 leads were assigned to reps more than 14 days ago but haven't logged an initial telephone outreach call. Reps at fault: Gyanaranjan (184), Sibi (112), Basil (64).
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ alignSelf: 'center', display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setActiveDrawer('lead-distributor')}
                  style={{
                    backgroundColor: '#064e3b',
                    border: '1px solid #064e3b',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 5px rgba(6,78,59,0.2)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#042f26'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#064e3b'; }}
                >
                  <Sparkles size={14} color="#34d399" />
                  <span>Auto-Distribute Leads</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                </button>

                <button 
                  onClick={() => setActiveDrawer('lead-distributor')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #059669',
                    color: '#059669',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>Review unassigned leads</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* ITEM 3: 54 call-backs past the date promised */}
          <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  54 call-backs past the date promised
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.25rem' }}>
                  Across the team —{' '}
                  <span 
                    onClick={() => { setCallbackFilterRep('Gyanaranjan Parida'); setActiveDrawer('callback-triage'); }}
                    style={{ fontWeight: 700, color: '#dc2626', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Gyanaranjan Parida 30
                  </span>{' '}
                  ·{' '}
                  <span 
                    onClick={() => { setCallbackFilterRep('Sibi Sanichan'); setActiveDrawer('callback-triage'); }}
                    style={{ fontWeight: 700, color: '#ea580c', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sibi Sanichan 14
                  </span>{' '}
                  · Basil John 8 · Robin Paulose 1 · 1 other 1. <strong style={{ color: '#0f172a' }}>5 more due today.</strong>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    onClick={handleRebalanceCallbacks}
                    style={{
                      background: 'none',
                      border: '1px dashed #3b82f6',
                      color: '#1d4ed8',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <RefreshCw size={12} />
                    <span>⚡ Rebalance Gyanaranjan's backlog to Basil & Robin</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ alignSelf: 'center' }}>
                <button 
                  onClick={() => { setCallbackFilterRep('All'); setActiveDrawer('callback-triage'); }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #059669',
                    color: '#059669',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ecfdf5'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <span>My call-backs</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* ITEM 4: 6 tasks past their date */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  6 tasks past their date
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Across the team; the button opens yours.
                </div>
              </div>

              {/* Action Button */}
              <div style={{ alignSelf: 'center' }}>
                <button 
                  onClick={() => setActiveDrawer('my-work')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #059669',
                    color: '#059669',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ecfdf5'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <span>My work</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* DRAWER 1: PI REVENUE RESCUE HUB */}
      {activeDrawer === 'pi-rescue' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Proforma Invoice Revenue Rescue Hub</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>168 pending quotes totaling ₹9.97 Cr + $478k USD</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Filter Tabs inside Drawer */}
            <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setPiFilterDays('all')}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: piFilterDays === 'all' ? '#064e3b' : '#fff', color: piFilterDays === 'all' ? '#fff' : '#334155' }}
              >
                All 168 PIs
              </button>
              <button 
                onClick={() => setPiFilterDays('over30')}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid #993d18', cursor: 'pointer', backgroundColor: piFilterDays === 'over30' ? '#993d18' : '#fff', color: piFilterDays === 'over30' ? '#fff' : '#993d18' }}
              >
                🔴 Over 30 Days (45 Critical)
              </button>
              <button 
                onClick={() => setPiFilterDays('14to30')}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid #c26e1a', cursor: 'pointer', backgroundColor: piFilterDays === '14to30' ? '#c26e1a' : '#fff', color: piFilterDays === '14to30' ? '#fff' : '#c26e1a' }}
              >
                🟠 14–30 Days (48 In Progress)
              </button>
              <button 
                onClick={() => setPiFilterDays('under14')}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid #059669', cursor: 'pointer', backgroundColor: piFilterDays === 'under14' ? '#059669' : '#fff', color: piFilterDays === 'under14' ? '#fff' : '#059669' }}
              >
                🟢 Under 14 Days (75 Active)
              </button>
            </div>

            {/* List of PIs */}
            <div style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredPis.map(pi => (
                  <div key={pi.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', backgroundColor: pi.tier === 'over30' ? '#fffbfb' : '#ffffff' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{pi.id}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700, backgroundColor: pi.type === 'Export' ? '#ecfdf5' : '#eff6ff', color: pi.type === 'Export' ? '#047857' : '#1d4ed8' }}>
                          {pi.type}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: pi.tier === 'over30' ? '#dc2626' : '#d97706' }}>
                          ⏱️ {pi.ageDays} days old
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>{pi.client}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Rep: <strong>{pi.rep}</strong> | Status: {pi.status}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{pi.amount}</div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <button 
                          onClick={() => handleSendPiNudge(pi.id, pi.client, pi.contact)}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: '#25D366', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Send size={12} />
                          <span>WhatsApp Follow-up</span>
                        </button>
                        <button 
                          onClick={() => {
                            setPiListState(prev => prev.map(p => p.id === pi.id ? { ...p, status: 'Extended 14 Days (Active)', ageDays: 1, tier: 'under14' } : p));
                            alert(`Extended proforma ${pi.id} validity by 14 days.`);
                          }}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Extend
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Showing {filteredPis.length} proforma invoices</span>
              <button 
                onClick={() => setActiveDrawer(null)}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem' }}
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 2: AI / SMART LEAD AUTO-DISTRIBUTOR */}
      {activeDrawer === 'lead-distributor' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Smart Lead Distribution Engine</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Resolve the {unassignedLeadsCount.toLocaleString()} unassigned lead backlog</p>
                </div>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#1e40af' }}>
                <strong>Routing Rule Matrix Active:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', lineHeight: 1.4 }}>
                  <li><strong>Rahul Menon & Narayanan:</strong> Domestic Kerala & Mangalore inquiries (Malayalam / Kannada / Tamil)</li>
                  <li><strong>Zareen Ahmed:</strong> GCC & Middle East inquiries (Arabic & English)</li>
                  <li><strong>Vikramaditya Rao:</strong> Pan-India Wholesale & Plywood Distributors (Hindi / English / Telugu)</li>
                  <li><strong>Elena Rostova:</strong> European, UK & Mediterranean inquiries (English / German / Spanish)</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                  Select Batch Size to Auto-Distribute:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  <button 
                    onClick={() => handleAutoDistributeLeads(100)}
                    style={{ padding: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'center' }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#059669'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>100</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Quick Triage</div>
                  </button>

                  <button 
                    onClick={() => handleAutoDistributeLeads(250)}
                    style={{ padding: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'center' }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#059669'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>250</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Half-Day Target</div>
                  </button>

                  <button 
                    onClick={() => handleAutoDistributeLeads(500)}
                    style={{ padding: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'center' }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#059669'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>500</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Shift Allocation</div>
                  </button>

                  <button 
                    onClick={() => handleAutoDistributeLeads(unassignedLeadsCount)}
                    style={{ padding: '0.85rem', border: '1px solid #059669', borderRadius: '0.5rem', backgroundColor: '#ecfdf5', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46' }}>ALL {unassignedLeadsCount}</div>
                    <div style={{ fontSize: '0.72rem', color: '#047857' }}>Clear Backlog</div>
                  </button>
                </div>
              </div>

              {/* Sample Unassigned Leads Preview */}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Sample Leads Awaiting First Call:</span>
                <div style={{ marginTop: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ padding: '0.6rem 0.85rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    <span>Lead Name & Location</span>
                    <span>Language / Category</span>
                    <span>Matched Rep</span>
                  </div>
                  <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span>Ali Al-Kuwari (Doha, Qatar)</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>Arabic · Teak Container</span>
                    <span>👉 Zareen Ahmed</span>
                  </div>
                  <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span>Santhosh Builders (Kozhikode)</span>
                    <span style={{ color: '#1d4ed8', fontWeight: 600 }}>Malayalam · Commercial Ply</span>
                    <span>👉 Rahul Menon</span>
                  </div>
                  <div style={{ padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span>K. R. Veneers (Mangalore)</span>
                    <span style={{ color: '#7c3aed', fontWeight: 600 }}>Kannada · Pine Logs</span>
                    <span>👉 Rahul Menon / Narayanan</span>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Cancel</button>
              <button 
                onClick={() => handleAutoDistributeLeads(500)} 
                className="btn btn-primary" 
                style={{ backgroundColor: '#064e3b', borderColor: '#064e3b', fontSize: '0.8rem' }}
              >
                Execute Smart Routing Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 3: CALLBACK SLA COMMANDER */}
      {activeDrawer === 'callback-triage' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Callback SLA Command Center</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>54 promised callbacks breached across team</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Rep Filter bar */}
            <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['All', 'Gyanaranjan Parida', 'Sibi Sanichan', 'Basil John', 'Zareen Ahmed'].map(repName => (
                  <button
                    key={repName}
                    onClick={() => setCallbackFilterRep(repName)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      backgroundColor: callbackFilterRep === repName ? '#064e3b' : '#ffffff',
                      color: callbackFilterRep === repName ? '#ffffff' : '#334155'
                    }}
                  >
                    {repName}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRebalanceCallbacks}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <RefreshCw size={12} />
                <span>Rebalance Gyanaranjan (30)</span>
              </button>
            </div>

            {/* List of Overdue Callbacks */}
            <div style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredCallbacks.map(cb => (
                  <div key={cb.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#ffffff', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{cb.customer}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>
                          Overdue by {cb.delayDays} days
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>
                        Contact: <strong>{cb.contact}</strong> ({cb.phone}) | Value: <strong style={{ color: '#059669' }}>{cb.value}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        "{cb.note}"
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                        Assigned Rep: <strong style={{ color: '#1e3a8a' }}>{cb.rep}</strong> | Promised Date: {cb.promisedDate}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignSelf: 'center' }}>
                      <a 
                        href={`tel:${cb.phone}`}
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', backgroundColor: '#0284c7', color: '#fff', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <PhoneCall size={12} />
                        <span>Call Now</span>
                      </a>
                      <button 
                        onClick={() => {
                          alert(`Rescheduled callback for ${cb.customer} to tomorrow 10:00 AM.`);
                          setCallbacksState(prev => prev.filter(item => item.id !== cb.id));
                        }}
                        style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Showing {filteredCallbacks.length} overdue callbacks</span>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 4: MY WORK & TASK TRIAGER */}
      {activeDrawer === 'my-work' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>My Work & Overdue Tasks</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>6 tasks past deadline requiring manager clearance</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {tasksState.map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: task.completed ? '#f8fafc' : '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input 
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          setTasksState(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                        }}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: task.completed ? '#94a3b8' : '#0f172a', textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Due: <strong style={{ color: '#dc2626' }}>{task.due}</strong> | Owner: {task.rep}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700, backgroundColor: task.priority === 'Urgent' ? '#fee2e2' : '#fef3c7', color: task.priority === 'Urgent' ? '#b91c1c' : '#92400e' }}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Completed: {tasksState.filter(t => t.completed).length} / {tasksState.length}</span>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 5: 515 MESSAGES TRIAGE DRAWER */}
      {activeDrawer === 'messages-triage' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Priority Message Triage (515 Unread)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Categorized into actionable client queries vs system alerts</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e40af' }}>14</div>
                  <div style={{ fontSize: '0.72rem', color: '#1e3a8a', fontWeight: 600 }}>Hot Buyer Enquiries</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>8</div>
                  <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 600 }}>Payment Confirmations</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#475569' }}>493</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>System Logs & Alerts</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Top Urgent Buyer Inquiries:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                      <span>Al-Jazeera Interiors (Sharjah)</span>
                      <span style={{ color: '#2563eb' }}>10 mins ago</span>
                    </div>
                    <div style={{ color: '#475569', marginTop: '2px' }}>"Need urgent confirmation if 40ft container teak ply can be loaded at Cochin Port before Monday."</div>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                      <span>Sobha Projects (Bangalore)</span>
                      <span style={{ color: '#2563eb' }}>28 mins ago</span>
                    </div>
                    <div style={{ color: '#475569', marginTop: '2px' }}>"Advance RTGS of ₹12,50,000 sent for Proforma #PI-2026-955. Please dispatch E-Way bill."</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setMessagesBadgeCount(22);
                  alert('Archived 493 system notifications! Only 22 priority customer conversations remain.');
                  setActiveDrawer(null);
                }}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Mark 493 Routine System Alerts as Read
              </button>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 6: EMAIL INBOX & DISPATCH */}
      {activeDrawer === 'email-triage' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Sales & Logistics Email Inbox</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>4 unread threads requiring commercial dispatch clearance</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#fffbfb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.85rem' }}>
                  <span>Al-Futtaim Interiors (Dubai)</span>
                  <span style={{ color: '#dc2626' }}>Urgent Export</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>Subject: Revised Container Booking for 18mm Teak Consignment</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>"Please furnish Phytosanitary Certificate and Fumigation sign-off for container MSCU-492190 before loading at Cochin Port."</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => alert('Phytosanitary certificate dispatched to Al-Futtaim via email.')} className="btn btn-primary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', backgroundColor: '#064e3b' }}>Send Docs</button>
                  <button onClick={() => alert('Forwarded to Zareen Ahmed for export coordination.')} className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}>Assign to Zareen</button>
                </div>
              </div>

              <div style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.85rem' }}>
                  <span>Sobha Developers (Bangalore)</span>
                  <span style={{ color: '#059669' }}>Payment Verified</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>Subject: RTGS Payment Advice: ₹12,50,000 against PI #955</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>"UTR #HDFCR520260916001292 generated. Kindly release 1,500 sheets calibrated ply from Perumbavoor."</p>
              </div>

              <div style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.85rem' }}>
                  <span>Kannur Veneer Mill Quality Dept</span>
                  <span style={{ color: '#64748b' }}>Quality Log</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>Subject: Teak Core Veneer Moisture Batch #882 Report</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>"Average moisture level 7.8% across 450 sheets. All batches cleared IS:710 boiling water resistance test."</p>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 7: ACCOUNTS OVERVIEW */}
      {activeDrawer === 'accounts-overview' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Key B2B Accounts & Credit Monitoring</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Active dealer ledgers, credit limits, and outstanding balances</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Sobha Projects (Bangalore)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Key Account Manager: <strong>Vikramaditya Rao</strong> | Pan-India Commercial</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>Credit Limit: ₹ 50,00,000 | Available: ₹ 37,50,000</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>₹ 12,50,000</div>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700 }}>Healthy (25%)</span>
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Al-Futtaim Interiors (Dubai)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Export Lead: <strong>Zareen Ahmed</strong> | Middle East Wholesale</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>Credit Limit: $250,000 | Available: $202,000</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>$48,000 USD</div>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700 }}>LC Active</span>
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #fee2e2', borderRadius: '0.5rem', backgroundColor: '#fffbfb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#991b1b' }}>Malabar Heritage Resorts (Wayanad)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Sales Rep: <strong>Rahul Menon</strong> | Kerala & Mangalore</div>
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '2px' }}>Credit Limit: ₹ 40,00,000 | Available: ₹ 1,50,000</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626' }}>₹ 38,50,000</div>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>Near Limit (96%)</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 8: ORDERS PIPELINE */}
      {activeDrawer === 'orders-pipeline' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="#059669" />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Confirmed Orders & Dispatch Pipeline</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>28 active factory orders in production or transit</p>
                </div>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Order #CW-ORD-1049</span>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>Container Loading</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>2 x 40ft Containers (18mm Marine Gurjan Ply) → Jebel Ali Port, UAE</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Client: Gulf Timber LLC | Dispatch Point: Cochin Port Terminal</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Order #CW-ORD-1052</span>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700 }}>En Route to Bangalore</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>1,500 Sheets Calibrated Commercial Ply → Sobha City Depot</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Transporter: Southern Express Fleet | E-Way Bill #9842-1102-4412</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Order #CW-ORD-1055</span>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 700 }}>Final Sanding & Quality Check</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>800 Teak Veneered Solid Flush Doors → Calicut Resort Development</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Mill Facility: Perumbavoor Factory Unit 2</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 9: PRODUCTS CATALOG */}
      {activeDrawer === 'products-catalog' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Cochin Wood Product Catalog & Mill Stock</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Technical specifications and active inventory levels</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Marine Plywood (IS: 710)</div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>100% Calibrated Hardwood Gurjan Core</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Tested for 72 hours in boiling water. Ideal for luxury marine vessels, exterior paneling, and humid coastal homes.</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>Available Stock: 4,200 Sheets</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Boiling Water Resistant (BWR: 303)</div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Commercial Grade Furniture Ply</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Phenol bonded with preservative treatment. High impact resistance for modular kitchens and architectural fit-outs.</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>Available Stock: 6,800 Sheets</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Natural Burma Teak Veneer</div>
                <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>0.55mm Quarter Cut Architectural Face</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Hand-picked golden grain timber flitches. Shipped worldwide for premium hotel lobbies and executive cabinetry.</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>Available Stock: 1,850 Panels</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Imported Kiln-Dried Pine Lumber</div>
                <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>Structural Grade Sawn Timber</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Fumigated and planed on 4 sides (S4S). Moisture controlled at 8-10% for construction formwork.</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>Available Stock: 85,000 CFT</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 10: FACTORIES & MILLS STATUS */}
      {activeDrawer === 'factories-status' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveDrawer(null)}>
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Warehouse size={20} color="#047857" />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Mill Operations & Kiln Telemetry</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Live production capacity and kiln drying moisture monitoring</p>
                </div>
              </div>
              <button onClick={() => setActiveDrawer(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Perumbavoor Main Plywood Mill (HQ)</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lead Quality Engineer: Priya Nambiar</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700 }}>Operating at 88%</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <span>Daily Output: <strong>1,200 Sheets/day</strong></span>
                  <span>Hydraulic Presses: <strong>3/3 Active</strong></span>
                  <span style={{ color: '#059669' }}>Kiln Moisture: <strong>8.2% (Optimal)</strong></span>
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Kannur Decorative Veneer Plant</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Facility Head: M. K. George</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700 }}>Operating at 94%</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <span>Daily Output: <strong>450 Panels/day</strong></span>
                  <span>Flitch Slicers: <strong>2/2 Active</strong></span>
                  <span style={{ color: '#059669' }}>Kiln Moisture: <strong>7.6% (Optimal)</strong></span>
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Mangalore Port Timber Depot & Yard</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Logistics Coordinator: Sunil Kamath</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>Yard Storage: 72%</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <span>Log Stock: <strong>120,000 CFT</strong></span>
                  <span>Transit: <strong>4 Containers Clearing Customs</strong></span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDrawer(null)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
