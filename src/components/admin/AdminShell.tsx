"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
    ADMIN_AUTH_EVENT,
    getAdminAuth,
    setAdminAuth,
} from "@/components/admin/auth";

const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/tours", label: "Tours" },
    { href: "/admin/destinations", label: "Destinations" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/users", label: "Users" },
];

type AdminShellProps = {
    children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isAuthed = useSyncExternalStore(
        (onStoreChange) => {
            if (typeof window === "undefined") return () => undefined;

            const handler = () => onStoreChange();
            window.addEventListener("storage", handler);
            window.addEventListener(ADMIN_AUTH_EVENT, handler);

            return () => {
                window.removeEventListener("storage", handler);
                window.removeEventListener(ADMIN_AUTH_EVENT, handler);
            };
        },
        () => getAdminAuth(),
        () => false,
    );

    useEffect(() => {
        if (!pathname) return;

        if (!isAuthed && pathname !== "/admin/login") {
            router.replace("/admin/login");
            return;
        }

        if (isAuthed && pathname === "/admin/login") {
            router.replace("/admin");
        }
    }, [isAuthed, pathname, router]);

    const isLoginPage = pathname === "/admin/login";

    const handleLogout = () => {
        setAdminAuth(false);
        router.replace("/admin/login");
    };

    const activePath = useMemo(() => pathname ?? "", [pathname]);

    if (isLoginPage) {
        return <div className="min-h-screen p-6">{children}</div>;
    }

    if (isAuthed === null || isAuthed === false) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-sm text-muted-foreground">
                    Checking admin session...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden w-72 flex-col border-r bg-card md:flex">
                    <div className="flex items-center justify-between px-6 py-5">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                STOUR CMS
                            </p>
                            <p className="text-sm font-semibold tracking-tight">
                                Admin Panel
                            </p>
                        </div>
                        <Badge variant="secondary">v1</Badge>
                    </div>

                    <Separator />

                    <ScrollArea className="flex-1 px-3 py-4">
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive =
                                    activePath === item.href ||
                                    activePath.startsWith(`${item.href}/`);

                                return (
                                    <Button
                                        key={item.href}
                                        asChild
                                        variant={
                                            isActive ? "secondary" : "ghost"
                                        }
                                        className={cn(
                                            "w-full justify-start",
                                            isActive && "font-semibold",
                                        )}
                                    >
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <Separator />

                    <div className="px-6 py-4">
                        <p className="text-xs text-muted-foreground">
                            Admin console workspace
                        </p>
                    </div>
                </aside>

                {/* Main */}
                <div className="flex flex-1 flex-col">
                    <header className="flex items-center justify-between border-b bg-card px-6 py-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Administration
                            </p>
                            <h1 className="text-base font-semibold tracking-tight">
                                CMS Workspace
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline">Signed in</Badge>
                            <Button variant="outline" onClick={handleLogout}>
                                Log out
                            </Button>
                        </div>
                    </header>

                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
