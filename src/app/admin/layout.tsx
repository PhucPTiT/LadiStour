import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

type AdminLayoutProps = {
    children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <html lang="vi">
            <body>
                <AdminShell>{children}</AdminShell>
            </body>
        </html>
    );
}
