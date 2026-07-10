import * as React from "react";
import { Outlet } from "react-router-dom";
import {
  AppSidebar,
  MobileNav,
  SidebarBrand,
} from "components/layout/AppSidebar";
import { AccountMenu } from "components/layout/AccountMenu";
import { ThemeToggle } from "components/layout/ThemeToggle";
import { OnboardingDialog } from "components/OnboardingDialog";
import { useAuth } from "context/AuthContext";
import { APP_NAME } from "lib/app";

export function DashboardLayout() {
  const { user, completeOnboarding } = useAuth();
  const [onboardingPending, setOnboardingPending] = React.useState(false);

  async function handleCompleteOnboarding() {
    setOnboardingPending(true);
    await completeOnboarding();
    setOnboardingPending(false);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex shrink-0 border-b-2 border-primary bg-background">
        <div className="hidden h-14 w-64 shrink-0 items-center border-r px-4 lg:flex">
          <SidebarBrand />
        </div>
        <div className="flex h-14 min-w-0 flex-1 items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <MobileNav />
            <div className="flex flex-col lg:hidden">
              <span className="text-sm font-bold text-primary">{APP_NAME}</span>
              <span className="text-[11px] text-muted-foreground">Finanzas personales</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <AccountMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <OnboardingDialog
        open={Boolean(user && !user.onboardingCompleted)}
        pending={onboardingPending}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}
