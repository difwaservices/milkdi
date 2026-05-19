"use client"

import { useState, useEffect } from "react"
import {
    ShoppingCart,
    Package,
    CheckCircle,
    XCircle,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    ExternalLink,
    Activity,
    Users,
} from "lucide-react"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"
import Link from "next/link"
import { cn } from "@/lib/utils"
import useAdminStore from "@/data/store/useAdminStore"

const statCards = [
    {
        key: "totalOrders",
        title: "Total Orders",
        icon: ShoppingCart,
        href: "/admin/orders",
        colorClass: "text-primary",
        bgClass: "bg-primary-soft",
        borderClass: "border-primary-light",
        trend: "up",
    },
    {
        key: "newOrders",
        title: "New (24 h)",
        icon: Package,
        href: "/admin/orders",
        colorClass: "text-status-info",
        bgClass: "bg-status-info-bg",
        borderClass: "border-status-info-border",
        trend: "up",
    },
    {
        key: "completedOrders",
        title: "Completed",
        icon: CheckCircle,
        href: "/admin/orders",
        colorClass: "text-status-success",
        bgClass: "bg-status-success-bg",
        borderClass: "border-status-success-border",
        trend: "up",
    },
    {
        key: "canceledOrders",
        title: "Canceled",
        icon: XCircle,
        href: "/admin/orders",
        colorClass: "text-status-danger",
        bgClass: "bg-status-danger-bg",
        borderClass: "border-status-danger-border",
        trend: "down",
    },
]

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white rounded-xl border border-green-100 shadow-lg px-4 py-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
            <p className="text-base font-bold text-primary">
                {payload[0].value} orders
            </p>
        </div>
    )
}

export default function Dashboard() {
    const [mounted, setMounted] = useState(false)
    const { stats: statsData, loadingStats: loading, fetchDashboardStats } = useAdminStore()

    useEffect(() => {
        setMounted(true)
        fetchDashboardStats()
    }, [fetchDashboardStats])

    if (!mounted || (loading && !statsData) || !statsData) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-xl w-1/3" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
                </div>
                <div className="h-80 bg-gray-100 rounded-2xl" />
            </div>
        )
    }

    const counts: Record<string, number> = {
        totalOrders: statsData.stats.totalOrders,
        newOrders: statsData.stats.newOrders,
        completedOrders: statsData.stats.completedOrders,
        canceledOrders: statsData.stats.canceledOrders,
    }

    return (
        <div className="space-y-6 text-foreground">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Platform Overview</h1>
                    <p className="text-sm mt-0.5 text-text-muted">
                        Welcome back, Admin — here&apos;s what&apos;s happening with Milkdi today.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-soft border border-primary-light text-primary-dark">
                    <Activity size={14} />
                    Live Dashboard
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {statCards.map(card => {
                    const value = counts[card.key] ?? 0
                    const Icon = card.icon
                    return (
                        <Link
                            key={card.key}
                            href={card.href}
                            className={cn("group relative bg-white rounded-2xl p-5 flex flex-col gap-4 overflow-hidden hover:shadow-md transition-all border", card.borderClass)}
                        >
                            {/* Subtle background blob */}
                            <div className={cn("absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-30 transition-transform group-hover:scale-125", card.bgClass)} />

                            <div className="relative flex items-center justify-between">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.bgClass, card.colorClass)}>
                                    <Icon size={20} />
                                </div>
                                <MoreHorizontal size={16} className="text-gray-300" />
                            </div>

                            <div className="relative">
                                <p className="text-xs font-medium mb-1 text-text-muted">{card.title}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-text-title">
                                        {value.toLocaleString()}
                                    </span>
                                    {card.trend === "up"
                                        ? <ArrowUpRight size={16} className={cn("mb-1", card.colorClass)} />
                                        : <ArrowDownRight size={16} className="mb-1 text-status-danger" />
                                    }
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">

                {/* Area chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6"
                    style={{ border: "1px solid #F3F4F6" }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold">Order Activity</h3>
                            <p className="text-xs mt-0.5 text-text-muted-light">Last 7 days — platform-wide</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-soft text-primary-dark">
                            <TrendingUp size={13} />
                            7 days
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={statsData.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#15803D" stopOpacity={0.18} />
                                        <stop offset="100%" stopColor="#15803D" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
                                    dy={8}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#15803D"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#greenGrad)"
                                    dot={{ fill: "#15803D", r: 3, strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: "#15803D", strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent retailers */}
                <div className="bg-white rounded-2xl p-5 md:p-6 flex flex-col"
                    style={{ border: "1px solid #F3F4F6" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold">New Retailers</h3>
                        <Users size={16} className="text-text-muted-light" />
                    </div>

                    <div className="flex-1 space-y-3">
                        {statsData.recentShops.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-soft">
                                    <Users size={22} className="text-primary" />
                                </div>
                                <p className="text-xs font-medium text-text-muted-light">No recent registrations</p>
                            </div>
                        ) : (
                            statsData.recentShops.map((shop: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-green-50/50 transition-colors">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold bg-primary-soft text-primary-dark">
                                        {(shop.businessDetails?.businessName || shop.name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold truncate text-text-title">
                                            {shop.businessDetails?.businessName || shop.name}
                                        </p>
                                        <p className="text-[10px] mt-0.5 text-text-muted-light">
                                            {new Date(shop.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#10B981" }} />
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        href="/admin/retailers"
                        className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all hover:gap-2.5 bg-primary-soft text-primary-dark border border-primary-light"
                    >
                        View all retailers
                        <ExternalLink size={12} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
