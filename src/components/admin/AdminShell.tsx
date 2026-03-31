"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
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
            if (typeof window === "undefined") {
                return () => undefined;
            }

            const handler = () => onStoreChange();
            window.addEventListener("storage", handler);
            window.addEventListener(ADMIN_AUTH_EVENT, handler);

            return () => {
                window.removeEventListener("storage", handler);
                window.removeEventListener(ADMIN_AUTH_EVENT, handler);
            };
        },
        () => getAdminAuth(),
        () => false
    );

    useEffect(() => {
        if (!pathname) {
            return;
        }

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
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-amber-50 p-6">
                {children}
            </div>
        );
    }

    if (isAuthed === null || isAuthed === false) {
        return (
            <div className="min-h-screen bg-neutral-50 px-6 py-10 text-sm text-neutral-500">
                Checking admin session...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <div className="mx-auto flex min-h-screen">
                <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white px-4 py-6 md:flex">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        STOUR CMS
                    </div>
                    <div className="mt-6 flex flex-1 flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive =
                                activePath === item.href ||
                                activePath.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-medium transition",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "text-neutral-600 hover:bg-neutral-100",
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="mt-auto text-xs text-neutral-400">
                        Admin console v1
                    </div>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                                Administration
                            </p>
                            <h1 className="text-lg font-semibold text-neutral-900">
                                CMS Workspace
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-neutral-500">
                                Signed in
                            </span>
                            <Button variant="outline" onClick={handleLogout}>
                                Log out
                            </Button>
                        </div>
                    </header>
                    <main className="flex-1 px-6 py-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
