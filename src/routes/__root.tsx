import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { AppSidebar } from "@/components/chrome/AppSidebar";
import { NotificationPanel } from "@/components/chrome/NotificationPanel";
import { UserProfileMenu, applyTheme, applyUiStyle, type UiElementStyle } from "@/components/chrome/UserProfileMenu";
import { ZioLogo } from "@/components/zio/ZioLogo";
import { AskZioTopBarButton } from "@/components/zio/AskZioCTA";
import { ZioPanel } from "@/components/zio/ZioPanel";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardProvider } from "@/dashboard/store";
import { ZioProvider, useZio } from "@/zio/ZioContext";
import { cn } from "@/lib/utils";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Trakzee 2.0" },
        {
          name: "description",
          content: "Fleet & Telematics Intelligence Dashboard",
        },
        { name: "author", content: "Trakzee" },
        { property: "og:title", content: "Trakzee 2.0" },
        {
          property: "og:description",
          content: "Fleet & Telematics Intelligence Dashboard",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <DashboardProvider>
          <ZioProvider>
            <AppLayout />
            <Toaster position="bottom-right" />
          </ZioProvider>
        </DashboardProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("trakzee-active-theme-id");
      if (savedTheme) applyTheme(savedTheme);
      const savedUi = localStorage.getItem("trakzee-ui-style") as UiElementStyle;
      if (savedUi) applyUiStyle(savedUi);
    } catch {}
  }, []);
  const { isOpen, mode, openZio } = useZio();
  const location = useRouterState({ select: (s) => s.location });
  const isZioStandaloneRoute = location.pathname.startsWith("/zio");

  const isSidebar = isOpen && mode === "sidebar" && !isZioStandaloneRoute;
  const isFloating = isOpen && mode === "floating" && !isZioStandaloneRoute;
  const isFullscreen = isOpen && mode === "fullscreen" && !isZioStandaloneRoute;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-nav text-foreground">
      <AppSidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-nav">
        <TopBar />
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden relative bg-[#F1F5F9] dark:bg-slate-950 rounded-tl-2xl">
          {/* Main Workspace Screen: smoothly resizes when Sidebar mode is open */}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-tl-2xl">
            <Outlet />
          </main>

          {/* Dedicated Sidebar Mode: matching top, bottom, right margin with the rest of the workspace */}
          {isSidebar && (
            <aside className="w-[390px] xl:w-[420px] p-3 bg-[#F0F0F0] dark:bg-slate-900/50 flex flex-col shrink-0 min-h-0 transition-all duration-300 ease-out animate-in slide-in-from-right z-30">
              <ZioPanel mode="sidebar" className="h-full w-full flex-1" />
            </aside>
          )}

          {/* Fullscreen Zio Mode: Smoothly covers the main workspace area matching reference screenshot */}
          {isFullscreen && (
            <div className="fixed top-[45px] bottom-0 left-0 sm:left-14 right-0 z-50 p-3 bg-background/80 backdrop-blur-xs animate-in fade-in zoom-in-[0.98] duration-300 ease-out flex flex-col">
              <ZioPanel mode="fullscreen" className="h-full w-full flex-1" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Mode Zio Panel */}
      {isFloating && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
          <ZioPanel mode="floating" />
        </div>
      )}
    </div>
  );
}

function TopBar() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="flex h-[45px] shrink-0 items-center gap-3 bg-nav px-3.5 text-nav-foreground">
      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nav-muted" />
        <input
          aria-label="Search"
          placeholder="Search"
          className="h-[30px] w-full rounded-md border border-white/15 bg-white/10 pl-8 pr-2.5 text-xs text-nav-foreground placeholder:text-nav-muted hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0089FF]/60 focus:border-[#0089FF] transition-all"
        />
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        {/* Zio CTA in Header (Ahead of Notifications) */}
        <AskZioTopBarButton />

        {/* Divider 1 */}
        <div className="h-4.5 w-px bg-white/20" />

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotifOpen(true)}
          className="relative rounded-md p-1.5 text-nav-foreground/90 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 rounded-full bg-danger px-1 text-[8.5px] font-semibold text-white leading-tight">
            16
          </span>
        </button>

        {/* Divider 2 */}
        <div className="h-4.5 w-px bg-white/20" />

        {/* User Profile Menu */}
        <UserProfileMenu />
      </div>
      <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </header>
  );
}
