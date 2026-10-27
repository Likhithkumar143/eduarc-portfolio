# EduArc Connect Portfolio

Official web platform and portfolio for **EduArc** — a comprehensive education and career guidance platform empowering schools, colleges, and students.

## Features

- **Marketing Website**: High-performance, accessible, responsive pages following Apple-inspired minimalist design principles.
- **Dynamic Site Content**: Brochure facts, content copy, and contact details centrally managed and dynamic via database override with graceful fallback.
- **Partner Inquiries Portal**: Student and institution partnership inquiry submission with anti-bot honeypot and validation.
- **Reception Desk (`/reception`)**: Dedicated staff desk with password authentication to manage and update incoming inquiries and counselling statuses.
- **Admin Dashboard (`/admin`)**: Secure, password-protected administrative dashboard with encrypted session management to configure brochure content and reception access.
- **Security Protections**: Timing-safe PBKDF2 password derivation, server-side session validation, CSRF middleware protection, security HTTP headers, and robots.txt bot management.

## Tech Stack

- **Framework**: TanStack Start / TanStack Router / Nitro
- **UI & Styling**: React 19, Tailwind CSS v4, Radix UI primitives, Lucide React icons
- **State & Data**: TanStack Query
- **Database & Auth**: Supabase PostgreSQL (Row Level Security protected) / Drizzle ORM
- **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (>= 20.x)
- npm or bun

### Environment Configuration

Copy the example environment file and configure your credentials:

```sh
cp .env.example .env
```

Set the following variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (kept server-only)
- `SESSION_SECRET`: Random 32+ character key for session cookie encryption
- `ADMIN_INITIAL_PASSWORD`: Initial bootstrap password for the `/admin` portal

### Installation

```sh
npm install
```

### Running Locally

```sh
npm run dev
```

The application will be running at `http://localhost:3000`.

### Building for Production

```sh
npm run build
npm run preview
```

### Running Tests and Lint

```sh
npm test
npm run lint
npm run format
```
