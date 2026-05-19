"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, ShoppingCart, Users, Layers, ArrowLeftRight,
    List, Star, UserCog, ShieldCheck, Wallet, BellRing, CalendarCheck,
    Percent, Truck, BarChart3, MessageSquare, HelpCircle, Crown,
    Package, Store, UserCheck, X, ChevronLeft, ChevronRight, Droplets
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import useAuthStore from "@/data/store/useAuthStore"

const adminMenu = [
    {
        title: "Main",
        items: [
            { name: "Dashboard",          icon: LayoutDashboard, href: "/admin/dashboard",         id: "DASHBOARD_VIEW" },
            { name: "Retailers",          icon: Users,           href: "/admin/retailers",          id: "RETAILERS_VIEW" },
            { name: "Shops",              icon: Store,           href: "/admin/shops",              id: "RETAILERS_VIEW" },
            { name: "App Users",          icon: UserCheck,       href: "/admin/users",              id: "APP_USERS_VIEW" },
            { name: "Products",           icon: Package,         href: "/admin/products",           id: "RETAILERS_VIEW" },
            { name: "Orders",             icon: ShoppingCart,    href: "/admin/orders",             id: "ORDERS_VIEW" },
            { name: "Categories",         icon: Layers,          href: "/admin/categories",         id: "CATEGORIES_VIEW" },
        ]
    },
    {
        title: "Finance",
        items: [
            { name: "Payouts",            icon: Wallet,          href: "/admin/payouts",            id: "PAYOUTS_VIEW" },
            { name: "Commission",         icon: Percent,         href: "/admin/commission",         id: "COMMISSION_EDIT" },
            { name: "Delivery Charges",   icon: Truck,           href: "/admin/delivery-charges",   id: "COMMISSION_EDIT" },
            { name: "Platform Income",    icon: BarChart3,       href: "/admin/platform-income",    id: "COMMISSION_EDIT" },
            { name: "Transactions",       icon: ArrowLeftRight,  href: "/admin/transactions",       id: "PAYOUTS_VIEW" },
        ]
    },
    {
        title: "Engage",
        items: [
            { name: "Communication",      icon: BellRing,        href: "/admin/communication",      id: "COMMUNICATION_SEND" },
            { name: "Help Requests",      icon: MessageSquare,   href: "/admin/support-requests",   id: "COMMUNICATION_SEND" },
            { name: "Subscriptions",      icon: Crown,           href: "/admin/subscriptions",      id: "ALL" },
            { name: "FAQs",               icon: HelpCircle,      href: "/admin/faqs",               id: "ALL" },
        ]
    },
    {
        title: "Control",
        items: [
            { name: "Roles",              icon: UserCog,         href: "/admin/roles",              id: "ROLES_EDIT" },
            { name: "Authority",          icon: ShieldCheck,     href: "/admin/authority",          id: "AUTHORITY_EDIT" },
            { name: "Profile",            icon: UserCog,         href: "/admin/profile",            id: "ALL" },
        ]
    }
]

const retailerMenu = [
    {
        title: "Store",
        items: [
            { name: "Dashboard",    icon: LayoutDashboard, href: "/retailer/dashboard" },
            { name: "Orders",       icon: ShoppingCart,    href: "/retailer/orders" },
            { name: "Products",     icon: List,            href: "/retailer/products" },
            { name: "Riders",       icon: Users,           href: "/retailer/riders" },
            { name: "Prep List",    icon: CalendarCheck,   href: "/retailer/prep-list" },
            { name: "Smart Tank",   icon: Droplets,        href: "/retailer/smart-tank" },
            { name: "Reviews",      icon: Star,            href: "/retailer/reviews" },
        ]
    },
    {
        title: "Business",
        items: [
            { name: "Revenue",      icon: ArrowLeftRight,  href: "/retailer/revenue" },
            { name: "Customers",    icon: Users,           href: "/retailer/customers" },
            { name: "Settings",     icon: UserCog,         href: "/retailer/settings" },
        ]
    }
]

interface SidebarProps {
    mobileOpen?: boolean
    onClose?: () => void
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mounted, setMounted]     = useState(false)
    const { user }                  = useAuthStore()
    const [role, setRole]           = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        if (user) {
            setRole(user.role)
            localStorage.setItem("role", user.role)
        } else {
            setRole(localStorage.getItem("role") || "admin")
        }
    }, [user])

    if (!mounted) {
        return <aside className="hidden md:block w-56 border-r border-border bg-white h-screen sticky top-0" />
    }

    const filterMenuItems = (menu: typeof adminMenu) => {
        if (role !== "admin") return menu
        const perms = user?.permissions?.length ? user.permissions : (user?.roleId?.permissions || [])
        const always = ["DASHBOARD_VIEW", "COMMISSION_EDIT"]
        return menu.map(g => ({
            ...g,
            items: g.items.filter((item: any) => {
                if (!item.id) return true
                if (always.includes(item.id)) return true
                if (perms.includes("ALL") || perms.includes(item.id)) return true
                if (item.id === "ROLES_EDIT" && perms.includes("AUTHORITY_EDIT")) return true
                return false
            })
        })).filter(g => g.items.length > 0)
    }

    const menuGroups = role === "retailer" ? retailerMenu : filterMenuItems(adminMenu)
    const dashHref   = role === "retailer" ? "/retailer/dashboard" : "/admin/dashboard"

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "flex flex-col bg-white border-r border-border h-screen transition-all duration-200",
                // Mobile: fixed overlay
                "fixed inset-y-0 left-0 z-50",
                mobileOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
                // Desktop: sticky in flow
                "md:relative md:translate-x-0 md:shadow-none md:inset-auto md:sticky md:top-0",
                collapsed ? "md:w-[60px]" : "md:w-56"
            )}>

                {/* Logo */}
                <div className="h-[64px] flex items-center justify-between px-4 border-b border-border shrink-0">
                    <Link href={dashHref} className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C9 2 5 4 5 9v10a2 2 0 002 2h10a2 2 0 002-2V9c0-5-4-7-7-7z" fill="white" opacity=".9"/>
                                <ellipse cx="12" cy="9" rx="4" ry="2" fill="white" opacity=".5"/>
                            </svg>
                        </div>
                        {!collapsed && (
                            <span className="text-[15px] font-bold tracking-tight text-text-title truncate">Milkdi</span>
                        )}
                    </Link>
                    <button onClick={onClose} className="md:hidden p-1 rounded-md hover:bg-background text-text-muted">
                        <X size={16} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
                    {menuGroups.map((group, gi) => (
                        <div key={gi} className="mb-5">
                            {!collapsed && (
                                <p className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                                    {group.title}
                                </p>
                            )}
                            <div className="space-y-0.5 px-2">
                                {group.items.map((item: any) => {
                                    const active = pathname === item.href || pathname.startsWith(item.href + "/")
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed ? item.name : undefined}
                                            className={cn(
                                                "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors",
                                                active
                                                    ? "bg-primary-soft text-primary font-semibold"
                                                    : "text-text-muted hover:bg-background hover:text-text-title"
                                            )}
                                        >
                                            <item.icon size={16} className="shrink-0" />
                                            {!collapsed && <span className="truncate">{item.name}</span>}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Collapse toggle — desktop only */}
                <div className="hidden md:flex items-center justify-end px-3 py-3 border-t border-border">
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className="p-1.5 rounded-md hover:bg-background text-text-muted transition-colors"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>
            </aside>
        </>
    )
}
