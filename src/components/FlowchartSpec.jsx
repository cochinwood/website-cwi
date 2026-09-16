import React, { useState } from 'react';
import { 
  GitBranch, 
  Copy, 
  Check, 
  Database, 
  Code2, 
  RefreshCw, 
  Contact2, 
  FileCode,
  Layers
} from 'lucide-react';

const STEP_DETAILS = [
  {
    step: 1,
    title: 'Admin Opens User Creation / Edit Form',
    actor: 'Internal App UI (app.cochinwood.in)',
    tag: 'App UI Layer',
    badgeColor: { bg: '#e0e7ff', text: '#4338ca' },
    summary: 'Admin opens modal, enters name, email, designation, and selects role from dropdown.',
    trigger: 'Admin clicks "+ Add Sales Manager" or "Edit"',
    samplePayload: {
      action: 'INITIALIZE_FORM',
      actor: 'edwin@cochinwood.in (SuperAdmin)',
      inputs: {
        name: 'Basil John',
        email: 'basil@cochinwood.in',
        designation: 'Senior Sales Executive - South India',
        department: 'Sales & Distribution',
        role: 'Sales'
      }
    },
    stateChange: 'Role changed to "Sales" -> triggers conditional sales fields and mandatory validation rules.'
  },
  {
    step: 2,
    title: 'Conditional Sales Validation Matrix',
    actor: 'Form State & Validation Hook',
    tag: 'Validation Engine',
    badgeColor: { bg: '#fef3c7', text: '#b45309' },
    summary: 'When role is Sales, Dealing, Languages, and Phone & WhatsApp are strictly required before form can submit.',
    trigger: 'Role selection == "Sales"',
    samplePayload: {
      validationEngine: 'Active',
      rules: {
        dealing: { required: true, allowed: ['Domestic', 'Export', 'Both'], status: 'VALID (Both)' },
        languages: { required: true, minItems: 1, current: ['Malayalam', 'Tamil', 'English'], status: 'VALID (3 items)' },
        phone: { required: true, pattern: '^\\+[1-9]\\d{7,14}$', current: '+919846011223', status: 'VALID (E.164)' },
        whatsapp: { required: true, pattern: '^\\+[1-9]\\d{7,14}$', current: '+919846011223', status: 'VALID (E.164)' }
      },
      canSubmit: true
    },
    stateChange: 'Form unlocks "Save & Synchronize" button. Live customer preview renders card in real-time.'
  },
  {
    step: 3,
    title: 'Database Persistence & Edge Sync',
    actor: 'PostgreSQL DB & API Layer',
    tag: 'Backend API',
    badgeColor: { bg: '#ede9fe', text: '#6d28d9' },
    summary: 'Record is saved with CHECK constraints. Edge cache invalidation webhook fires to purge CDN cache.',
    trigger: 'Admin clicks "Save & Synchronize"',
    samplePayload: {
      dbTransaction: 'COMMIT',
      sqlMutation: 'UPDATE cwi_team_members SET dealing = $1, languages = $2, phone = $3, show_on_website = true WHERE id = $4',
      webhookDispatched: {
        event: 'TEAM_MEMBER_UPDATED',
        timestamp: new Date().toISOString(),
        tags: ['sales-directory', 'public-reps'],
        purgePaths: ['/contact', '/api/public/sales-team']
      }
    },
    stateChange: 'Edge cache revalidated. Local state updates instant zero-latency UI preview across split view.'
  },
  {
    step: 4,
    title: 'Public Directory Live Customer Reachability',
    actor: 'Customer Website (cochinwood.in)',
    tag: 'Customer Experience',
    badgeColor: { bg: '#dcfce7', text: '#15803d' },
    summary: 'Buyers filter by Domestic/Export and preferred language; click direct call, WhatsApp, or vCard download.',
    trigger: 'Buyer visits cochinwood.in/contact or directory tab',
    samplePayload: {
      activeRepsAvailable: 5,
      filtersApplied: { dealing: 'Domestic', language: 'Malayalam' },
      directActions: {
        whatsappLink: 'https://wa.me/919846011223?text=Hi%20Basil,%20I%20saw%20your%20profile%20on%20cochinwood.in',
        telLink: 'tel:+919846011223',
        vCardDownload: 'Basil_John_CochinWood.vcf'
      }
    },
    stateChange: 'Zero barrier to procurement contact. Immediate lead delivery to sales rep WhatsApp and mobile.'
  }
];

const CODE_SNIPPETS = [
  {
    id: 'sql',
    name: 'PostgreSQL Schema & Constraints',
    icon: Database,
    lang: 'SQL',
    code: `-- Cochin Wood Industries: Production Staff & Sales Sync Schema
CREATE TYPE sales_dealing_type AS ENUM ('Domestic', 'Export', 'Both');
CREATE TYPE user_status_type AS ENUM ('Active', 'Inactive', 'On Leave');

CREATE TABLE cwi_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    designation VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status user_status_type NOT NULL DEFAULT 'Active',
    show_on_website BOOLEAN NOT NULL DEFAULT true,
    
    -- Mandatory when role == 'Sales'
    dealing sales_dealing_type,
    languages TEXT[] DEFAULT '{}',
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    avatar_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Strict database constraint: enforces mandatory sales details at DB layer
    CONSTRAINT chk_sales_mandatory_fields CHECK (
        role != 'Sales' OR (
            dealing IS NOT NULL AND 
            cardinality(languages) >= 1 AND 
            phone IS NOT NULL AND phone ~ '^\\+[1-9][0-9]{7,14}$' AND
            whatsapp IS NOT NULL AND whatsapp ~ '^\\+[1-9][0-9]{7,14}$'
        )
    )
);

CREATE INDEX idx_public_sales_reps 
ON cwi_team_members (status, show_on_website, role)
WHERE role = 'Sales' AND status = 'Active' AND show_on_website = true;`
  },
  {
    id: 'api',
    name: 'Next.js / Express API Route',
    icon: Code2,
    lang: 'TypeScript',
    code: `// app/api/public/sales-team/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 60; // Edge cached, purged via webhook

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealing = searchParams.get('dealing'); // 'Domestic' | 'Export'
  const language = searchParams.get('language');

  let query = db.from('cwi_team_members')
    .select('id, name, designation, dealing, languages, phone, whatsapp, avatar_url')
    .eq('role', 'Sales')
    .eq('status', 'Active')
    .eq('show_on_website', true);

  if (dealing && dealing !== 'All') {
    query = query.or(\`dealing.eq.\${dealing},dealing.eq.Both\`);
  }
  if (language && language !== 'All') {
    query = query.contains('languages', [language]);
  }

  const { data: salesTeam, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ 
    success: true, 
    count: salesTeam.length,
    data: salesTeam 
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': 'https://cochinwood.in'
    }
  });
}`
  },
  {
    id: 'webhook',
    name: 'Webhook & Cloudflare Cache Purge',
    icon: RefreshCw,
    lang: 'TypeScript',
    code: `// app/api/webhooks/staff-updated/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-cwi-internal-key');
  if (apiKey !== process.env.INTERNAL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { event, userId } = body;

  // 1. Next.js on-demand page revalidation
  revalidatePath('/contact');
  revalidateTag('sales-directory');

  // 2. Cloudflare Edge Cache Purge (Instant Global Invalidation)
  if (process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN) {
    await fetch(\`https://api.cloudflare.com/client/v4/zones/\${process.env.CLOUDFLARE_ZONE_ID}/purge_cache\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.CLOUDFLARE_API_TOKEN}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urls: [
          'https://cochinwood.in/contact',
          'https://cochinwood.in/api/public/sales-team'
        ]
      })
    });
  }

  return NextResponse.json({ revalidated: true, event, timestamp: Date.now() });
}`
  },
  {
    id: 'vcard',
    name: 'vCard 3.0 Generation Specification',
    icon: Contact2,
    lang: 'TypeScript',
    code: `// utils/vCardGenerator.ts (RFC 2426 compliant)
export function generateVCard(user: {
  name: string;
  designation: string;
  phone: string;
  whatsapp?: string;
  email: string;
  dealing?: string;
}): string {
  const cleanPhone = user.phone.replace(/[^+\\d]/g, '');
  const cleanWa = user.whatsapp ? user.whatsapp.replace(/[^+\\d]/g, '') : cleanPhone;
  const nameParts = user.name.trim().split(' ');
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const firstName = nameParts[0] || '';

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    \`FN;CHARSET=UTF-8:\${user.name}\`,
    \`N;CHARSET=UTF-8:\${lastName};\${firstName};;;\`,
    'ORG:Cochin Wood Industries',
    \`TITLE:\${user.designation}\${user.dealing ? \` (\${user.dealing} Division)\` : ''}\`,
    \`TEL;TYPE=CELL,VOICE,PREF:\${cleanPhone}\`,
    \`TEL;TYPE=WHATSAPP:\${cleanWa}\`,
    \`EMAIL;TYPE=WORK,INTERNET:\${user.email}\`,
    'URL:https://cochinwood.in',
    'ADR;TYPE=WORK:;;Industrial Growth Centre, Valayanchirangara;Perumbavoor;Kerala;683556;India',
    'NOTE;CHARSET=UTF-8:Cochin Wood Industries - Plywood, Veneers & Commercial Timber Solutions',
    'END:VCARD'
  ].join('\\r\\n');
}`
  }
];

export default function FlowchartSpec() {
  const [selectedStep, setSelectedStep] = useState(1);
  const [activeSnippetTab, setActiveSnippetTab] = useState('sql');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const promptText = `Feature: Mandatory Sales Role Details & Real-Time Website Sync

1. In App (Admin):
   - When User Role == 'Sales', mandatorily collect:
     a) Dealing: Domestic, Export, or Both (Enum)
     b) Languages: Multi-select dropdown of all languages (Array)
     c) Direct Contact: Phone Number & WhatsApp (E.164)
   - Block submission if any of these are missing when Role == 'Sales'.

2. Public Website Sync:
   - Synchronize active sales managers to the public website directory in real-time.
   - Adding, editing, deactivating, or removing a sales manager in the app immediately updates the public contact directory.
   - Customers can filter by Dealing (Domestic/Export) and Language.
   - One-click direct customer contact actions: WhatsApp, Direct Call, and Email.`;

  const copySnippet = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const activeStepObj = STEP_DETAILS.find(s => s.step === selectedStep) || STEP_DETAILS[0];
  const activeSnippetObj = CODE_SNIPPETS.find(s => s.id === activeSnippetTab) || CODE_SNIPPETS[0];

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <GitBranch size={14} />
          <span>System Architecture & Lifecycle Flow</span>
        </div>
        <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800 }}>
          How Sales Role Collection & Real-Time Sync Works
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: '0.5rem auto 0' }}>
          Interactive step inspector, state machine triggers, and production-ready code specifications for Cochin Wood Industries.
        </p>
      </div>

      {/* Interactive Step Inspector Section */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#2563eb" />
              Interactive Execution Lifecycle Inspector
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              Click on any step below to inspect its data contract, validation triggers, and runtime payloads.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
            Active Step: {selectedStep} of 4
          </span>
        </div>

        {/* 4 Interactive Step Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {STEP_DETAILS.map((st) => {
            const isSelected = selectedStep === st.step;
            return (
              <button
                key={st.step}
                onClick={() => setSelectedStep(st.step)}
                style={{
                  textAlign: 'left',
                  padding: '1.1rem',
                  borderRadius: '0.75rem',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                  boxShadow: isSelected ? '0 4px 14px rgba(37,99,235,0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '8px', 
                    backgroundColor: isSelected ? '#2563eb' : '#cbd5e1', 
                    color: '#ffffff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '0.85rem' 
                  }}>
                    {st.step}
                  </div>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '9999px', 
                    backgroundColor: st.badgeColor.bg, 
                    color: st.badgeColor.text 
                  }}>
                    {st.tag}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.875rem', color: isSelected ? '#1e3a8a' : '#0f172a', fontWeight: 700, marginBottom: '0.35rem', lineHeight: 1.3 }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {st.actor}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Inspector Panel */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '0.85rem', padding: '1.5rem', color: '#f8fafc', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                {activeStepObj.step}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{activeStepObj.title}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Actor: <strong style={{ color: '#38bdf8' }}>{activeStepObj.actor}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trigger Condition</span>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.4rem', margin: 0 }}>
                {activeStepObj.trigger}
              </p>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>State Machine Transition</span>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.4rem', margin: 0 }}>
                {activeStepObj.stateChange}
              </p>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inspector Payload (JSON Contract)</span>
            <pre style={{ backgroundColor: '#020617', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#a5f3fc', overflowX: 'auto', lineHeight: 1.5, fontFamily: 'monospace', border: '1px solid #1e293b' }}>
              {JSON.stringify(activeStepObj.samplePayload, null, 2)}
            </pre>
          </div>
        </div>

      </div>

      {/* Tabbed Production Code Snippets Section */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode size={18} color="#059669" />
              Production Code Specifications & Handover Snippets
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              Plug-and-play backend schema, API routes, cache invalidation webhooks, and vCard generators.
            </p>
          </div>

          <button
            onClick={() => copySnippet(activeSnippetObj.code)}
            className="btn"
            style={{ 
              backgroundColor: copiedSnippet ? '#059669' : '#f1f5f9', 
              color: copiedSnippet ? '#ffffff' : '#0f172a', 
              fontSize: '0.8rem', 
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedSnippet ? 'Copied Snippet!' : `Copy ${activeSnippetObj.lang} Code`}</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
          {CODE_SNIPPETS.map(sn => {
            const Icon = sn.icon;
            const isActive = activeSnippetTab === sn.id;
            return (
              <button
                key={sn.id}
                onClick={() => setActiveSnippetTab(sn.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} color={isActive ? '#38bdf8' : '#94a3b8'} />
                <span>{sn.name}</span>
              </button>
            );
          })}
        </div>

        {/* Snippet Display */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '0.6rem 1rem', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{activeSnippetObj.name} ({activeSnippetObj.lang})</span>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>Ready for Production</span>
          </div>
          <pre style={{ 
            backgroundColor: '#0f172a', 
            padding: '1.25rem', 
            borderBottomLeftRadius: '0.5rem', 
            borderBottomRightRadius: '0.5rem', 
            fontSize: '0.8rem', 
            color: '#e2e8f0', 
            overflowX: 'auto', 
            lineHeight: 1.6, 
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            margin: 0
          }}>
            {activeSnippetObj.code}
          </pre>
        </div>
      </div>

      {/* Improved Prompt Box */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>Full Implementation Prompt for Engineering Team</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Comprehensive copy-paste specification for Jira, GitHub issues, or PR descriptions</p>
          </div>
          <button
            onClick={copyPrompt}
            className="btn"
            style={{ backgroundColor: copiedPrompt ? '#059669' : '#334155', color: '#ffffff', fontSize: '0.8rem', border: '1px solid #475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {copiedPrompt ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedPrompt ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
          </button>
        </div>

        <pre style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1', overflowX: 'auto', lineHeight: 1.5, fontFamily: 'monospace', margin: 0 }}>
          {promptText}
        </pre>
      </div>

    </div>
  );
}

