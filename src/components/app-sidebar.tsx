"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    FileTextIcon,
    FolderIcon,
    LayoutDashboardIcon,
    MapPinIcon,
    PlaneIcon,
    Settings2Icon,
    StarIcon,
    TagIcon,
    UsersIcon,
} from "lucide-react";

const data = {
    user: {
        name: "Admin",
        email: "admin@stour.vn",
        avatar: "",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: <LayoutDashboardIcon />,
        },
        {
            title: "Posts",
            url: "/admin/posts",
            icon: <FileTextIcon />,
        },
        {
            title: "Reviews",
            url: "/admin/reviews",
            icon: <StarIcon />,
        },
        {
            title: "Tours",
            url: "/admin/tours",
            icon: <FolderIcon />,
        },
        {
            title: "Destinations",
            url: "/admin/destinations",
            icon: <MapPinIcon />,
        },
        {
            title: "Categories",
            url: "/admin/categories",
            icon: <TagIcon />,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: <UsersIcon />,
        },
        {
            title: "Settings",
            url: "/admin/settings",
            icon: <Settings2Icon />,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link href="/admin">
                                <PlaneIcon className="size-5! text-sidebar-primary" />
                                <span className="text-xl font-semibold text-sidebar-primary">
                                    Happy Smile CMS
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
