"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ADMIN_AUTH_EVENT, getAdminAuth } from "@/components/admin/auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const SIDEBAR_STYLE: CSSProperties = {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
} as CSSProperties;

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const isAuthed = useSyncExternalStore(
        (onStoreChange) => {
            if (typeof window === "undefined") return () => undefined;
            window.addEventListener("storage", onStoreChange);
            window.addEventListener(ADMIN_AUTH_EVENT, onStoreChange);
            return () => {
                window.removeEventListener("storage", onStoreChange);
                window.removeEventListener(ADMIN_AUTH_EVENT, onStoreChange);
            };
        },
        () => getAdminAuth(),
        () => false,
    );

    useEffect(() => {
        // Intentional: Set mounted state after hydration to prevent hydration mismatches
        // eslint-disable-next-line
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !pathname) return;
        if (!isAuthed && pathname !== "/admin/login") {
            router.replace("/admin/login");
        }
        if (isAuthed && pathname === "/admin/login") {
            router.replace("/admin");
        }
    }, [isAuthed, pathname, router, isMounted]);

    const isLoginPage = pathname === "/admin/login";
    const isLoading = !isMounted || (!isAuthed && !isLoginPage);
    const showShell = isMounted && isAuthed && !isLoginPage;

    return (
        <html lang="vi" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem="false"
                    disableTransitionOnChange
                >
                    {isLoading ? (
                        <div className="flex min-h-screen items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Checking admin session...
                            </p>
                        </div>
                    ) : showShell ? (
                        <TooltipProvider>
                            <SidebarProvider style={SIDEBAR_STYLE}>
                                <AppSidebar variant="inset" />
                                <SidebarInset className="m-0! rounded-none! shadow-none!">
                                    <div className="flex min-h-screen flex-col">
                                        <SiteHeader />
                                        <main className="flex flex-1 flex-col p-4">
                                            <div className="@container/main flex flex-1 flex-col gap-2">
                                                <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                                                    {children}
                                                </div>
                                            </div>
                                        </main>
                                    </div>
                                </SidebarInset>
                            </SidebarProvider>
                        </TooltipProvider>
                    ) : (
                        <div className="min-h-screen bg-background">
                            {children}
                        </div>
                    )}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
