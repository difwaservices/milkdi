"use client"

import { useState, useEffect, Suspense, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
    Search,
    MoreVertical,
    Eye,
    Download,
    CheckCircle,
    Package,
    RefreshCw,
    ChevronRight,
    Lock,
    Clock,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import retailerService from "@/data/services/retailerService"
import useOrderStore from "@/data/store/useOrderStore"
import OrderDetailsModal from "@/components/shared/OrderDetailsModal"

const statusStyles: any = {
    "New": "bg-primary-light text-primary border-primary-100",
    "Pending": "bg-warning-50 text-warning border-warning-100",
    "Accepted": "bg-blue-50 text-blue-600 border-blue-100",
    "Rider Assigned": "bg-blue-50 text-blue-600 border-blue-100",
    "Rider Accepted": "bg-indigo-50 text-indigo-600 border-indigo-100",
    "Processing": "bg-blue-50 text-blue-600 border-blue-100",
    "Preparing": "bg-indigo-50 text-indigo-600 border-indigo-100",
    "Shipped": "bg-blue-50 text-blue-600 border-blue-100",
    "Out for Delivery": "bg-orange-50 text-orange-600 border-orange-100",
    "Delivered": "bg-blue-50 text-blue-600 border-blue-100",
    "Completed": "bg-blue-50 text-blue-600 border-blue-100",
    "Cancelled": "bg-red-50 text-red-100 border-red-100",
}

function OrdersContent() {
    const searchParams = useSearchParams()
    const [mounted, setMounted] = useState(false)
    const [riders, setRiders] = useState<any[]>([])

    const {
        orders,
        loading,
        fetchOrders,
        currentPage,
        totalPages,
        stats: storeStats
    } = useOrderStore();

    // Auto-process logic
    const [autoProcessEnabled, setAutoProcessEnabled] = useState(false)
    const autoProcessInterval = useRef<NodeJS.Timeout | null>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [orderTypeFilter, setOrderTypeFilter] = useState<"All" | "Subscription" | "One-time">("All")
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Completed">("All")
    const [viewingOrder, setViewingOrder] = useState<any>(null)

    const moreMenuRef = useRef<HTMLDivElement>(null)
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [persistedStats, setPersistedStats] = useState<any>({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        avgOrderValue: "0"
    })

    useEffect(() => {
        setMounted(true)
        fetchOrders(currentPage, null, false, statusFilter)
    }, [fetchOrders, currentPage, statusFilter])

    useEffect(() => {
        // Capture stats whenever they update to keep the top cards accurate
        if (storeStats) {
            setPersistedStats({ ...storeStats })
        }
    }, [storeStats])

    const fetchRiders = useCallback(async () => {
        try {
            const res = await retailerService.getRiders()
            if (res.success) {
                setRiders(res.data || [])
            }
        } catch (error) {
            console.error("Failed to fetch riders", error)
        }
    }, [])

    const autoProcessOrders = async () => {
        try {
            const res = await retailerService.bulkProcessOrders();
            if (res.success && res.processed > 0) {
                console.log(`🤖 Auto-processed ${res.processed} orders`);
                fetchOrders(currentPage, null, true);
                fetchRiders();
                toast.info(`🤖 Auto-processed ${res.processed} orders`);
            }
        } catch (error) {
            console.error("Auto-process error:", error);
        }
    };

    useEffect(() => {
        fetchRiders()
    }, [fetchRiders])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setShowMoreMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (autoProcessEnabled) {
            autoProcessOrders();
            autoProcessInterval.current = setInterval(autoProcessOrders, 30000);
        } else {
            if (autoProcessInterval.current) {
                clearInterval(autoProcessInterval.current);
            }
        }
        return () => {
            if (autoProcessInterval.current) {
                clearInterval(autoProcessInterval.current);
            }
        };
    }, [autoProcessEnabled]);



    if (!mounted) {
        return <div className="space-y-6 animate-pulse p-4">
            <div className="h-12 bg-background-soft rounded-xl w-1/4" />
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-background-soft rounded-2xl" />)}
            </div>
            <div className="h-96 bg-background-soft rounded-2xl" />
        </div>
    }

    const orderStats = persistedStats || storeStats || {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        avgOrderValue: "0"
    }

    const statCards = [
        { title: "Total Shop Orders", value: (persistedStats?.totalOrders || storeStats?.totalOrders || 0).toLocaleString(), color: "bg-primary-light text-primary", filterValue: "All" },
        { title: "Pending Orders", value: (persistedStats?.pendingOrders || storeStats?.pendingOrders || 0).toLocaleString(), color: "bg-warning-50 text-warning", filterValue: "Pending" },
        { title: "Completed", value: (persistedStats?.completedOrders || storeStats?.completedOrders || 0).toLocaleString(), color: "bg-blue-50 text-blue-600", filterValue: "Completed" },
        { title: "Avg. Order Value", value: `₹${persistedStats?.avgOrderValue || storeStats?.avgOrderValue || 0}`, color: "bg-blue-50 text-blue-600", filterValue: null },
    ]

    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = orderTypeFilter === "All" || order.orderType === orderTypeFilter

        let matchesStatus = true
        if (statusFilter === "Pending") {
            matchesStatus = ['Pending', 'Accepted', 'Processing', 'Preparing', 'Shipped', 'Out for Delivery', 'Rider Assigned', 'Rider Accepted'].includes(order.status)
        } else if (statusFilter === "Completed") {
            matchesStatus = ['Delivered', 'Completed'].includes(order.status)
        }

        return matchesSearch && matchesType && matchesStatus
    })

    const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
        try {
            const res = await retailerService.updateOrderStatus(orderId, nextStatus)
            if (res.success) {
                toast.success(`Order marked as ${nextStatus}`)
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update status")
        }
    }

    const handleAssignRiderSelection = async (orderId: string, riderId: string) => {
        try {
            const res = await retailerService.assignRider(orderId, riderId)
            if (res.success) {
                toast.success("Rider assigned successfully")
            }
        } catch (error) {
            console.error("Failed to assign rider", error)
        }
    }

    const handleExport = () => {
        const exportData = orders.map((o: any) => ({
            "Order ID": o.id,
            "Type": o.orderType,
            "Product": o.product,
            "Total": `₹${o.price}`,
            "Status": o.status
        }))
        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Orders")
        XLSX.writeFile(wb, "Shop_Orders.xlsx")
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Shop Orders</h1>
                    <p className="text-xs sm:text-sm text-text-muted">Manage and fulfill your customer orders.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <button
                        onClick={() => setAutoProcessEnabled(!autoProcessEnabled)}
                        className={cn(
                            "relative flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg shrink-0",
                            autoProcessEnabled
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 text-white/90 shadow-gray-500/20"
                        )}
                    >
                        <RefreshCw size={16} className={cn(autoProcessEnabled && "animate-spin", "shrink-0")} />
                        <span className="hidden sm:inline">{autoProcessEnabled ? "⚡ AUTO-PROCESS ACTIVE" : "🔘 AUTO-PROCESS OFF"}</span>
                        <span className="sm:hidden">{autoProcessEnabled ? "⚡ AUTO ACTIVE" : "🔘 AUTO OFF"}</span>
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-primary text-white hover:bg-primary transition-all text-xs sm:text-sm font-medium shrink-0"
                    >
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            if (stat.filterValue) {
                                setStatusFilter(stat.filterValue as any);
                                // Only force fetch if we don't have the data or it's a specific status
                                if (stat.filterValue !== "All" || !persistedStats) {
                                    fetchOrders(1, null, true, stat.filterValue as any);
                                }
                            }
                        }}
                        className={cn(
                            "bg-white p-4 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md",
                            statusFilter === stat.filterValue ? "border-primary ring-1 ring-primary" : "border-border-custom"
                        )}
                    >
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-muted mb-1 sm:mb-2 line-clamp-1">{stat.title}</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-text">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-border-custom overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 border-b border-border-custom flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-1 bg-background-soft rounded-lg p-1 overflow-x-auto w-full sm:w-auto shrink-0 whitespace-nowrap">
                        {(["All", "Subscription", "One-time"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setOrderTypeFilter(tab)}
                                className={cn(
                                    "text-xs font-bold px-3 py-1.5 rounded-md transition-all shrink-0",
                                    orderTypeFilter === tab ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-primary"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-1.5 rounded-lg bg-background-soft border-transparent text-sm outline-none w-full focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-primary/5 text-xs font-bold text-primary uppercase tracking-wider border-b border-border-custom">
                                <th className="px-6 py-4 whitespace-nowrap">Order ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">Type</th>
                                <th className="px-6 py-4 whitespace-nowrap">Product Details</th>
                                <th className="px-6 py-4 whitespace-nowrap">Delivery Slot</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 whitespace-nowrap text-right">Total</th>
                                <th className="px-6 py-4 whitespace-nowrap">Payment</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap">Rider</th>
                                <th className="px-6 py-4 whitespace-nowrap text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom text-sm">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        <td colSpan={10} className="px-6 py-6"><div className="h-4 bg-background-soft rounded w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={10} className="px-6 py-12 text-center text-text-muted">No orders found</td></tr>
                            ) : (
                                filteredOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-background-soft/50 transition-colors cursor-pointer group" onClick={() => setViewingOrder(order)}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-primary group-hover:underline truncate max-w-[100px]">
                                                    {order.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-semibold uppercase whitespace-nowrap w-fit border shadow-sm",
                                                order.orderType === "Subscription" ? "bg-primary text-white border-primary" : "bg-blue-600 text-white border-blue-600"
                                            )}>
                                                {order.orderType === "Subscription" ? "SUB" : "ONE-OFF"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium truncate max-w-[180px]">
                                            {order.product}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.deliverySlot ? (
                                                <div className="text-xs text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full flex items-center gap-1.5 border border-orange-200 shadow-sm animate-pulse whitespace-nowrap">
                                                    <Clock size={12} /> {order.deliverySlot}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-text-muted font-bold opacity-30 italic">No Slot</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-medium text-text-muted whitespace-nowrap">{order.date}</td>
                                        <td className="px-6 py-4 font-semibold text-primary text-right whitespace-nowrap">₹{order.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", order.payment === "Paid" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning")}>
                                                {order.payment}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-blue-600">
                                            <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                disabled={['Out for Delivery', 'Delivered', 'Completed', 'Cancelled'].includes(order.status)}
                                                value={order.rider?.id || ""}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleAssignRiderSelection(order.id, e.target.value);
                                                }}
                                                className={cn(
                                                    "text-[10px] bg-background-soft border-transparent rounded p-1.5 outline-none font-bold uppercase transition-all w-32",
                                                    ['Out for Delivery', 'Delivered', 'Completed', 'Cancelled'].includes(order.status)
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer hover:border-primary/20"
                                                )}
                                            >
                                                <option value="">{order.rider?.name || "Assign R"}</option>
                                                {riders.map((rider: any) => (
                                                    <option key={rider.user?._id || (rider.user as any)} value={rider.user?._id || (rider.user as any)}>{rider.user?.name || "Rider"}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                {order.status === "Pending" ? (
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(order.id, "Accepted");
                                                    }} className="p-2 hover:bg-emerald-50 text-text-muted hover:text-emerald-600 rounded-lg transition-all" title="Accept">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                ) : !['Completed', 'Delivered', 'Cancelled'].includes(order.status) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(order.id, "Completed");
                                                        }}
                                                        className="p-2 hover:bg-blue-50 text-text-muted hover:text-blue-600 rounded-lg transition-all"
                                                        title="Mark Completed"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Cards Grid */}
                <div className="block md:hidden p-4 bg-background-soft/30 min-h-[300px]">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-border-custom animate-pulse p-4" />)}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-12 text-center text-text-muted bg-white rounded-2xl border border-border-custom p-6">
                            No orders found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredOrders.map((order: any) => (
                                <div 
                                    key={order.id}
                                    onClick={() => setViewingOrder(order)}
                                    className="bg-white rounded-2xl border border-border-custom shadow-sm p-4 flex flex-col justify-between gap-3 relative hover:shadow-md transition-all duration-300 cursor-pointer group animate-in fade-in zoom-in-95"
                                >
                                    {/* Top Row: Order ID & Type */}
                                    <div className="flex items-center justify-between gap-2 border-b border-border-custom/50 pb-2.5">
                                        <span className="text-xs font-semibold text-primary group-hover:underline truncate max-w-[150px]">
                                            {order.id}
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-semibold uppercase shadow-sm",
                                            order.orderType === "Subscription" ? "bg-primary text-white" : "bg-blue-600 text-white"
                                        )}>
                                            {order.orderType === "Subscription" ? "SUB" : "ONE-OFF"}
                                        </span>
                                    </div>

                                    {/* Middle Section: Details */}
                                    <div className="space-y-1.5">
                                        <p className="text-sm font-bold text-text line-clamp-2 leading-snug">
                                            {order.product}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                            <span className="text-[10px] font-medium text-text-muted">
                                                {order.date}
                                            </span>
                                            {order.deliverySlot ? (
                                                <div className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-orange-200">
                                                    <Clock size={10} /> {order.deliverySlot}
                                                </div>
                                            ) : (
                                                <span className="text-[9px] text-text-muted italic opacity-50">No Slot</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price & Status Row */}
                                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-custom/40 bg-background-soft/10 -mx-4 px-4 py-2">
                                        <div>
                                            <span className="text-[9px] text-text-muted font-bold block uppercase tracking-tighter">Total</span>
                                            <span className="text-base font-bold text-primary">₹{order.price}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", order.payment === "Paid" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning")}>
                                                {order.payment}
                                            </span>
                                            <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full font-semibold text-blue-600 text-[10px]">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom Action / Rider Row */}
                                    <div 
                                        className="flex items-center justify-between gap-2 pt-2 border-t border-border-custom bg-background-soft/30 -mx-4 -mb-4 p-3 rounded-b-2xl mt-0.5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <select
                                            disabled={['Out for Delivery', 'Delivered', 'Completed', 'Cancelled'].includes(order.status)}
                                            value={order.rider?.id || ""}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleAssignRiderSelection(order.id, e.target.value);
                                            }}
                                            className={cn(
                                                "text-[10px] bg-white border border-border-custom rounded-lg px-2 py-1.5 outline-none font-bold uppercase transition-all flex-1 shadow-sm",
                                                ['Out for Delivery', 'Delivered', 'Completed', 'Cancelled'].includes(order.status)
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer hover:border-primary text-primary"
                                            )}
                                        >
                                            <option value="">{order.rider?.name || "Assign Rider"}</option>
                                            {riders.map((rider: any) => (
                                                <option key={rider.user?._id || (rider.user as any)} value={rider.user?._id || (rider.user as any)}>
                                                    {rider.user?.name || "Rider"}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {order.status === "Pending" ? (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(order.id, "Accepted");
                                                    }} 
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-xs font-bold border border-emerald-200/50 shadow-sm"
                                                >
                                                    <CheckCircle size={13} /> Accept
                                                </button>
                                            ) : !['Completed', 'Delivered', 'Cancelled'].includes(order.status) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(order.id, "Completed");
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-bold border border-blue-200/50 shadow-sm"
                                                >
                                                    <CheckCircle size={13} /> Finish
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-border-custom flex items-center justify-between bg-white">
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                            Page <span className="text-primary">{currentPage}</span> of <span className="text-primary">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchOrders(currentPage - 1, null, true, statusFilter)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-xl border border-border-custom hover:bg-background-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-5 h-5 rotate-180" />
                            </button>
                            
                            {/* Smart Pagination */}
                            {(() => {
                                const pages = [];
                                const maxVisible = 5;
                                
                                if (totalPages <= maxVisible) {
                                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                                } else {
                                    pages.push(1);
                                    if (currentPage > 3) pages.push('...');
                                    
                                    const start = Math.max(2, currentPage - 1);
                                    const end = Math.min(totalPages - 1, currentPage + 1);
                                    
                                    for (let i = start; i <= end; i++) {
                                        if (!pages.includes(i)) pages.push(i);
                                    }
                                    
                                    if (currentPage < totalPages - 2) pages.push('...');
                                    if (!pages.includes(totalPages)) pages.push(totalPages);
                                }
                                
                                return pages.map((p, i) => (
                                    p === '...' ? (
                                        <span key={`sep-${i}`} className="px-2 text-text-muted font-bold">...</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => fetchOrders(Number(p), null, true, statusFilter)}
                                            className={cn(
                                                "w-9 h-9 rounded-xl text-xs font-semibold transition-all",
                                                currentPage === p
                                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                    : "hover:bg-background-soft text-text-muted"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    )
                                ));
                            })()}

                            <button
                                onClick={() => fetchOrders(currentPage + 1, null, true, statusFilter)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-xl border border-border-custom hover:bg-background-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>



            {viewingOrder && (
                <OrderDetailsModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
            )}
        </div>
    )
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center animate-pulse text-text-muted">Loading orders relay...</div>}>
            <OrdersContent />
        </Suspense>
    )
}
