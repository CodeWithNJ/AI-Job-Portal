import { Outlet } from "react-router";
import AppHeader from "./AppHeader";

/**
 * Shell for authenticated screens: shared header plus the standard page
 * container. Pages render their own content only — the background, width, and
 * vertical rhythm are owned here so they stay identical across every route.
 */
const AppLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <AppHeader />
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
