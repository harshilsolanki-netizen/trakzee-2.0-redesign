# TanStack Start TypeScript Application

A modern, high-performance, full-stack React 19 application built with TanStack Start, TanStack Router, TanStack Query, Tailwind CSS v4, and Radix UI.

## Features Included

- **Full-Stack Framework**: [TanStack Start](https://tanstack.com/start) with Nitro server engine and SSR support.
- **Type-Safe Routing**: [TanStack Router](https://tanstack.com/router) with automatic route tree generation and search params validation.
- **Server State Management**: [TanStack Query](https://tanstack.com/query) (`@tanstack/react-query`) for seamless caching and data fetching.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with `@tailwindcss/vite` and design system CSS tokens.
- **UI Components**: Accessible components built with [Radix UI](https://www.radix-ui.com), `class-variance-authority`, `clsx`, and `tailwind-merge`.
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) schema validation via `@hookform/resolvers/zod`.
- **Interactive Visualizations**: [Recharts](https://recharts.org) responsive Area and Bar charts.
- **Notifications**: [Sonner](https://sonner.emilkowal.ski) rich toast alerts.
- **Command Palette**: [cmdk](https://cmdk.paco.me) `Cmd+K` / `Ctrl+K` quick action search modal.
- **Authentication Inputs**: [input-otp](https://input-otp.vercel.app) 2FA code slots.
- **Code Quality**: ESLint 9 Flat Config with TypeScript-ESLint, Prettier, and React Hooks rules.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

### 4. Lint and Format

```bash
npm run lint
npm run format
```

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/             # Radix UI primitives & design system components
│   ├── lib/
│   │   └── utils.ts        # Helper functions (cn)
│   ├── routes/
│   │   ├── __root.tsx      # Root layout shell, navigation & providers
│   │   ├── index.tsx       # Live analytics & metrics dashboard
│   │   └── components.tsx  # Interactive UI component test suite
│   ├── router.tsx          # TanStack Router instance factory
│   ├── routeTree.gen.ts    # Generated type-safe route tree
│   └── index.css           # Tailwind v4 styles and color themes
├── eslint.config.js        # ESLint flat config
├── vite.config.ts          # Vite configuration with Lovable preset
├── tsconfig.json           # TypeScript project references
├── tsconfig.app.json       # Frontend TS configuration
└── package.json            # Project dependencies and npm scripts
```
