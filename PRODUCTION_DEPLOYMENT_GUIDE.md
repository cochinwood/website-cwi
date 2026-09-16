# Production Deployment Guide: app.cochinwood.in ⟷ cochinwood.in

This guide details how **app.cochinwood.in** (internal staff management) and **cochinwood.in** (public customer website) connect to ensure that whenever you add or remove sales staff in `app.cochinwood.in`, their contact numbers immediately appear or disappear on `cochinwood.in`.

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------------+
|                                    PRODUCTION ARCHITECTURE                              |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   [ Staff Admin Portal ]                      [ Public Customer Website ]               |
|   https://app.cochinwood.in                   https://cochinwood.in                     |
|            |                                              ^                             |
|            | 1. Admin adds/removes staff                  | 3. Customer fetches reps    |
|            |    - Role: Sales (Mandatory)                 |    - Domestic (Kerala/Mang) |
|            |    - Dealing: Domestic/Export/Both           |    - Export (Gulf/Global)   |
|            |    - Languages: Multiselect                  |    - Click to WhatsApp/Call |
|            v                                              |                             |
|   +---------------------------------------------------------------+                     |
|   |         Central Backend API / Database (cochinwood.in)        |                     |
|   |                  PostgreSQL / MySQL / Supabase                |                     |
|   |                                                               |                     |
|   |  Table: `users`                                               |                     |
|   |  - id: UUID                                                   |                     |
|   |  - name: String                                               |                     |
|   |  - email: String (@cochinwood.in)                             |                     |
|   |  - phone: String (e.g. +91 98450 12345)                       |                     |
|   |  - whatsapp: String                                           |                     |
|   |  - role: 'Sales'                                              |                     |
|   |  - dealing: 'Domestic' | 'Export' | 'Both'                    |                     |
|   |  - languages: Array ['Malayalam', 'Kannada', 'Arabic'...]     |                     |
|   |  - show_on_website: Boolean (default: true)                   |                     |
|   |  - status: 'Active' | 'Inactive'                              |                     |
|   +---------------------------------------------------------------+                     |
|            |                                                                            |
|            +---> 2. Emits Webhook / Cache Invalidation to cochinwood.in                 |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Option A: Shared Database (Recommended if monolithic or Next.js)

Both subdomains connect to the same PostgreSQL or MySQL instance:

### SQL Table Schema:
```sql
CREATE TABLE sales_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Sales', 'Operations', 'Admin')),
    dealing VARCHAR(50) CHECK (dealing IN ('Domestic', 'Export', 'Both')),
    languages TEXT[] NOT NULL DEFAULT '{}', -- Array of spoken languages
    territory VARCHAR(255),
    avatar_url TEXT,
    show_on_website BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraint: If role is 'Sales', dealing, languages, and phone are MANDATORY
ALTER TABLE sales_staff 
ADD CONSTRAINT enforce_sales_mandatory_fields 
CHECK (
    (role != 'Sales') OR 
    (dealing IS NOT NULL AND array_length(languages, 1) > 0 AND phone IS NOT NULL AND whatsapp IS NOT NULL)
);
```

---

## 3. Option B: REST API Endpoint with CORS (if independent codebases)

`app.cochinwood.in` serves the public endpoint consumed by `cochinwood.in`:

### Node.js / Express Example:
```javascript
// On app.cochinwood.in (Backend Server)
import express from 'express';
import cors from 'cors';

const app = express();

// Allow cochinwood.in to access the sales directory
app.use(cors({
  origin: ['https://cochinwood.in', 'https://www.cochinwood.in']
}));

// Public endpoint called by cochinwood.in frontend
app.get('/api/public/sales-team', async (req, res) => {
  const { dealing, language } = req.query;

  let query = `
    SELECT id, name, email, phone, whatsapp, dealing, languages, territory, avatar_url
    FROM sales_staff
    WHERE role = 'Sales' 
      AND status = 'Active' 
      AND show_on_website = TRUE
  `;
  
  const params = [];
  if (dealing && dealing !== 'All') {
    query += ` AND (dealing = $1 OR dealing = 'Both')`;
    params.push(dealing);
  }

  const result = await db.query(query, params);
  res.json({ success: true, data: result.rows });
});
```

---

## 4. Frontend Code for `cochinwood.in`:

Inside your `cochinwood.in` page (e.g. `cochinwood.in/sales-team` or `cochinwood.in/contact`):
```javascript
// Fetching active sales staff dynamically from app.cochinwood.in
async function getCochinWoodSalesReps() {
  const response = await fetch('https://app.cochinwood.in/api/public/sales-team', {
    next: { revalidate: 60 } // or ISR revalidation
  });
  const { data } = await response.json();
  return data;
}
```

Whenever staff is added or deleted in `app.cochinwood.in`, `app.cochinwood.in` calls:
```javascript
// On-demand revalidation trigger
await fetch('https://cochinwood.in/api/revalidate?tag=sales-team&secret=SECRET_KEY');
```
This ensures the change shows up on `cochinwood.in` in milliseconds!
