"use client"

import {
    Search, Bell, LogOut, ShoppingCart, ShieldAlert,
    Truck, Banknote, User as UserIcon, History, Menu, X, Clock
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import useAuthStore from "@/data/store/useAuthStore"
import useNotificationStore from "@/data/store/useNotificationStore"
import retailerService from "@/data/services/retailerService"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"

interface TopbarProps {
    onMenuClick?: () => void
}

function getNotifIcon(type: string) {
    switch (type) {
        case "Order":     return <ShoppingCart size={14} className="text-primary" />
        case "Rider":     return <Truck        size={14} className="text-blue-500" />
        case "Inventory": return <ShieldAlert  size={14} className="text-amber-500" />
        case "Payout":    return <Banknote     size={14} className="text-emerald-500" />
        default:          return <Bell         size={14} className="text-text-muted" />
    }
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return "just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const { user } = useAuthStore()
    const isAdmin  = user?.role === "admin"
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore()

    const [showNotif,         setShowNotif]         = useState(false)
    const [showUser,          setShowUser]           = useState(false)
    const [searchQuery,       setSearchQuery]        = useState("")
    const [searchResults,     setSearchResults]      = useState<any[]>([])
    const [searchLoading,     setSearchLoading]      = useState(false)
    const [showSearchResults, setShowSearchResults]  = useState(false)

    const notifRef  = useRef<HTMLDivElement>(null)
    const userRef   = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const router    = useRouter()

    useEffect(() => {
        if (user?._id) fetchNotifications()
    }, [user?._id, fetchNotifications])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current  && !notifRef.current.contains(e.target  as Node)) setShowNotif(false)
            if (userRef.current   && !userRef.current.contains(e.target   as Node)) setShowUser(false)
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => {
        const t = setTimeout(() => {
            if (searchQuery.length >= 2) doSearch()
            else { setSearchResults([]); setShowSearchResults(false) }
        }, 400)
        return () => clearTimeout(t)
    }, [searchQuery])

    const doSearch = async () => {
        setSearchLoading(true)
        setShowSearchResults(true)
        try {
            if (isAdmin) {
                const res = await adminService.globalSearch(searchQuery)
                if (res.success) setSearchResults(res.results)
            } else {
                const res = await retailerService.searchAnything(searchQuery)
                if (res.success) {
                    const unified: any[] = []
                    res.data.orders.forEach((o: any)    => unified.push({ title: o.orderId,  subtitle: o.customer,  category: "Order",    url: `/retailer/orders?id=${o.id}` }))
                    res.data.customers.forEach((c: any) => unified.push({ title: c.name,     subtitle: c.phone,     category: "Customer", url: `/retailer/customers?q=${c.name}` }))
                    res.data.products.forEach((p: any)  => unified.push({ title: p.name,     subtitle: `₹${p.price}`, category: "Product", url: `/retailer/products?q=${p.name}` }))
                    setSearchResults(unified)
                }
            }
        } catch { /* silent */ } finally { setSearchLoading(false) }
    }

    const handleNotifClick = async (n: any) => {
        if (!n.isRead) await markAsRead(n._id)
        const base  = isAdmin ? "/admin" : "/retailer"
        const lower = (n.title + n.message).toLowerCase()
        if (lower.includes("new order"))                       router.push(`${base}/orders?filter=Pending`)
        else if (lower.includes("delivered") || lower.includes("completed")) router.push(`${base}/orders?filter=Completed`)
        else if (n.type === "Inventory")                       router.push(`${base}/products`)
        else if (n.type === "Payout")                          router.push(isAdmin ? "/admin/payouts" : "/retailer/revenue")
        else                                                   router.push(`${base}/dashboard`)
        setShowNotif(false)
    }

    const handleLogout = () => {
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        localStorage.removeItem("role")
        window.location.href = "/login"
    }

    const initial   = (user?.name || "U")[0].toUpperCase()
    const roleName  = user?.roleId?.name || (user?.role === "admin" ? "Admin" : "Retailer") || "User"

    return (
        <header className="h-[64px] bg-white border-b border-border sticky top-0 z-40 flex items-center gap-3 px-4 md:px-6">

            {/* Hamburger — mobile only */}
            <button onClick={onMenuClick} className="md:hidden p-1.5 rounded-md text-text-muted hover:bg-background transition-colors" aria-label="Open menu">
                <Menu size={18} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    placeholder={isAdmin ? "Search users, shops, orders…" : "Search orders, products…"}
                    className="w-full pl-9 pr-8 py-2 rounded-md bg-background border border-transparent focus:border-border focus:bg-white text-sm outline-none transition-colors placeholder:text-text-muted"
                />
                {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setShowSearchResults(false) }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-title">
                        <X size={13} />
                    </button>
                )}

                {showSearchResults && (
                    <div className="absolute top-full left-0 mt-1.5 w-full min-w-[320px] bg-white rounded-lg border border-border shadow-md z-50 overflow-hidden">
                        {searchLoading ? (
                            <div className="p-6 text-center text-sm text-text-muted">Searching…</div>
                        ) : searchResults.length === 0 ? (
                            <div className="p-6 text-center text-sm text-text-muted">No results for &quot;{searchQuery}&quot;</div>
                        ) : (
                            <ul className="py-1 max-h-72 overflow-y-auto">
                                {searchResults.map((r: any, i: number) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => { router.push(r.url); setShowSearchResults(false); setSearchQuery("") }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-background transition-colors"
                                        >
                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted w-16 shrink-0">{r.category}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-text-title truncate">{r.title}</p>
                                                {r.subtitle && <p className="text-xs text-text-muted truncate">{r.subtitle}</p>}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1 ml-auto shrink-0">

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setShowNotif(v => !v); setShowUser(false) }}
                        className={cn("relative p-2 rounded-md transition-colors", showNotif ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-background")}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div className="absolute right-0 mt-1.5 w-[320px] bg-white rounded-lg border border-border shadow-md z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <p className="text-sm font-semibold text-text-title">Notifications</p>
                                {unreadCount > 0 && (
                                    <button onClick={async () => { await markAllAsRead(); toast.success("Marked all as read") }} className="text-xs text-primary hover:underline">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <ul className="max-h-80 overflow-y-auto divide-y divide-border">
                                {notifications.length === 0 ? (
                                    <li className="p-8 text-center text-sm text-text-muted">No notifications</li>
                                ) : notifications.map((n: any) => (
                                    <li key={n._id}>
                                        <button
                                            onClick={() => handleNotifClick(n)}
                                            className={cn("w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-background transition-colors", !n.isRead && "bg-primary-soft/40")}
                                        >
                                            <div className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                                                {getNotifIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn("text-xs font-semibold truncate", n.isRead ? "text-text-body" : "text-text-title")}>{n.title}</p>
                                                <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{n.message}</p>
                                                <p className="text-[10px] text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
                                            </div>
                                            {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* User menu */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => { setShowUser(v => !v); setShowNotif(false) }}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-background transition-colors"
                    >
                        <div className="w-7 h-7 rounded-full bg-primary-soft border border-primary-light flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {initial}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-semibold text-text-title leading-tight">{user?.name || "User"}</p>
                            <p className="text-[10px] text-text-muted leading-tight">{roleName}</p>
                        </div>
                    </button>

                    {showUser && (
                        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg border border-border shadow-md z-50 py-1">
                            <div className="px-4 py-3 border-b border-border">
                                <p className="text-sm font-semibold text-text-title">{user?.name || "User"}</p>
                                <p className="text-xs text-text-muted">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={14} />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
