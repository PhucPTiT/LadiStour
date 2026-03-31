import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sections = [
    { href: "/admin/posts", title: "Posts", description: "Create news and blog content." },
    { href: "/admin/reviews", title: "Reviews", description: "Approve and edit reviews." },
    { href: "/admin/tours", title: "Tours", description: "Manage tour catalog entries." },
    {
        href: "/admin/destinations",
        title: "Destinations",
        description: "Update destinations and highlights.",
    },
    { href: "/admin/settings", title: "Settings", description: "Global contact and about data." },
    {
        href: "/admin/categories",
        title: "Categories",
        description: "Maintain blog and tour categories.",
    },
    { href: "/admin/users", title: "Users", description: "Manage admin accounts." },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Overview
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Admin Dashboard
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                    Choose a module to start editing CMS data. Forms currently
                    log submitted values for API mocking.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sections.map((section) => (
                    <Card
                        key={section.href}
                        className="border-neutral-200 bg-white"
                    >
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-lg">
                                {section.title}
                            </CardTitle>
                            <p className="text-sm text-neutral-500">
                                {section.description}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={section.href}>Open</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
