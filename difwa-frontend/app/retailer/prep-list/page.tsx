"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import {
    Table as TableIcon,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Search,
    Printer,
    PauseCircle,
    Package
} from "lucide-react"
import { cn } from "@/lib/utils"
import useRetailerStore from "@/data/store/useRetailerStore"
import useAuthStore from "@/data/store/useAuthStore"
import useSocketStore from "@/data/store/useSocketStore"

interface PrepRow {
    id: string;
    orderId: string;
    customerName: string;
    phoneNumber: string;
    productName: string;
    category: string;
    quantity: number;
    price: number;
    deliverySlot: string;
    status: string;
    isPaused: boolean;
}

export default function DailyPrepListPage() {
    const {
        prepList,
        loadingPrepList: isLoading,
        fetchPrepList
    } = useRetailerStore()

    const { user } = useAuthStore()
    const { socket } = useSocketStore()
    const retailerSlots = user?.businessDetails?.deliverySlots || []

    const [selectedSlot, setSelectedSlot] = useState<string>("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [isTomorrow, setIsTomorrow] = useState(false)

    // Use an ISO string (primitive) so useMemo doesn't create a new object
    // reference on every render — which would cause infinite effect loops.
    // NOTE: Do NOT call setHours(0,0,0,0) here — that causes a UTC timezone
    // mismatch (midnight IST = 6:30 PM previous day in UTC). Let the backend normalize.
    const targetDateISO = useMemo(() => {
        const d = new Date()
        if (isTomorrow) d.setDate(d.getDate() + 1)
        return d.toISOString()
    }, [isTomorrow])

    // Keep a stable ref to fetchPrepList so the socket handler
    // never needs it as a dependency (avoids infinite re-subscriptions).
    const fetchRef = useRef(fetchPrepList)
    useEffect(() => { fetchRef.current = fetchPrepList }, [fetchPrepList])

    const targetDateRef = useRef(targetDateISO)
    useEffect(() => { targetDateRef.current = targetDateISO }, [targetDateISO])

    // Track first-ever load so subsequent fetches (e.g. date switch)
    // never blow away the entire page with the skeleton.
    const isInitialLoad = useRef(true)

    // Initial fetch — only re-runs when the date string actually changes.
    useEffect(() => {
        fetchRef.current(targetDateISO, true).then?.(() => {
            isInitialLoad.current = false
        })
        // Also mark as done after a timeout in case .then is not available
        const t = setTimeout(() => { isInitialLoad.current = false }, 3000)
        return () => clearTimeout(t)
    }, [targetDateISO])

    // Realtime socket listener — subscribes ONCE per socket connection.
    // Uses refs so it always reads the latest date/fetch without re-subscribing.
    useEffect(() => {
        if (!socket) return;

        let debounceTimer: ReturnType<typeof setTimeout>;

        const handleOrderUpdate = () => {
            // Debounce: if many events arrive together, only fetch once.
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                fetchRef.current(targetDateRef.current, true);
            }, 1500);
        }

        socket.on('orderUpdate', handleOrderUpdate);

        return () => {
            socket.off('orderUpdate', handleOrderUpdate);
            clearTimeout(debounceTimer);
        }
    }, [socket]) // ← ONLY re-subscribe when socket instance changes

    // Extract dynamic slots from data if user profile slots are missing
    const availableSlots = useMemo(() => {
        const slots = new Set<string>(["All"])
        if (retailerSlots.length > 0) {
            retailerSlots.forEach((s: string) => slots.add(s))
        }
        prepList.active?.forEach((item: PrepRow) => slots.add(item.deliverySlot))

        // Sort slots logically
        const slotOrder = [
            "All",
            "6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM", "11 AM-12 PM",
            "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM", "5-6 PM",
            "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM"
        ];

        return Array.from(slots).sort((a, b) => {
            const getIndex = (val: string) => {
                const idx = slotOrder.indexOf(val);
                return idx === -1 ? 999 : idx;
            };
            return getIndex(a) - getIndex(b);
        })
    }, [retailerSlots, prepList.active])

    // Filtering Logic
    const filteredActive = useMemo(() => {
        return (prepList.active || []).filter((item: PrepRow) => {
            const matchesSlot = selectedSlot === "All" || item.deliverySlot === selectedSlot
            const matchesSearch = item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.productName.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSlot && matchesSearch
        })
    }, [prepList.active, selectedSlot, searchQuery])

    const filteredPausedFilter = useMemo(() => {
        return (prepList.paused || []).filter((item: PrepRow) => {
            const matchesSlot = selectedSlot === "All" || item.deliverySlot === selectedSlot
            return matchesSlot
        })
    }, [prepList.paused, selectedSlot])

    // Only show full-page skeleton on the very first load.
    // After that, the table handles its own loading state inline.
    if (isInitialLoad.current && isLoading) {
        return (
            <div className="space-y-8 animate-pulse p-4">
                <div className="h-12 bg-background-soft rounded-2xl w-1/4" />
                <div className="h-24 bg-background-soft rounded-xl" />
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-background-soft rounded-xl" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 border-b border-border-custom">
                <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <TableIcon className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-foreground uppercase">Prep List</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted font-medium ml-1">Daily production & delivery schedule for subscriptions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setIsTomorrow(!isTomorrow)}
                        className={cn(
                            "px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0",
                            isTomorrow
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-foreground border-border-custom hover:bg-gray-50"
                        )}
                    >
                        <span>{isTomorrow ? "Viewing Tomorrow" : "View Tomorrow"}</span>
                    </button>
                    <div className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2 sm:gap-3 text-sm font-semibold text-primary min-w-[max-content] shrink-0">
                        <Calendar size={14} className="sm:w-4 sm:h-4 shrink-0" />
                        <span>{new Date(targetDateISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* Shift Tabs (Delivery Slots) */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-background-soft rounded-2xl w-full max-w-full overflow-x-auto whitespace-nowrap">
                {availableSlots.map(slot => (
                    <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                            "px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0",
                            selectedSlot === slot
                                ? "bg-white text-primary shadow-sm ring-1 ring-border-custom"
                                : "text-text-muted hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            {/* Search and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3">
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary sm:w-[18px] sm:h-[18px]" />
                        <input
                            type="text"
                            placeholder="Search by customer name or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 rounded-2xl sm:rounded-xl border border-border-custom focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-xs sm:text-sm"
                        />
                    </div>
                </div>
                <div className="bg-white rounded-2xl sm:rounded-xl border border-border-custom p-4 flex items-center justify-between px-6 shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-text-muted leading-none mb-1">Total Items</p>
                        <h4 className="text-lg sm:text-xl font-bold text-primary">{filteredActive.length}</h4>
                    </div>
                    <Package className="text-primary/20 w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
                </div>
            </div>

            {/* TABLES AREA */}
            <div className={cn("relative transition-all duration-300", isLoading && !isInitialLoad.current && "opacity-80")}>
                {/* Loader Overlay */}
                {isLoading && !isInitialLoad.current && (
                    <div className="absolute inset-0 z-20 bg-white/30 backdrop-blur-[1px] flex items-start justify-center pt-32 animate-in fade-in duration-300">
                        <div className="flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-xl shadow-md border border-border-custom ring-4 ring-primary/5">
                            <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-xs font-medium text-primary">Updating List</p>
                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-60">Fetching latest changes...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN ACTIVE TABLE */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-2">
                        <CheckCircle2 size={18} className="text-blue-500" />
                        <h3 className="text-sm font-semibold text-foreground">
                            {isTomorrow ? "Scheduled for Tomorrow" : "Scheduled Deliveries"}
                        </h3>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl border border-border-custom overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-background-soft/50 border-b border-border-custom">
                                        <th className="px-6 py-4 text-xs font-medium text-text-muted">Customer Details</th>
                                        <th className="px-6 py-4 text-xs font-medium text-text-muted">Product Item</th>
                                        <th className="px-6 py-4 text-xs font-medium text-text-muted text-center">Qty</th>
                                        <th className="px-6 py-4 text-xs font-medium text-text-muted">Shift Slot</th>
                                        <th className="px-6 py-4 text-xs font-medium text-text-muted text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom/40">
                                    {filteredActive.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-text-muted font-medium italic">
                                                No active deliveries found for this slot.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredActive.map((item: PrepRow) => (
                                            <tr key={item.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.customerName}</span>
                                                        <span className="text-[11px] font-bold text-text-muted">{item.phoneNumber}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                                                        <span className="text-sm font-bold text-foreground uppercase tracking-tight">{item.productName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-background-soft font-bold text-sm text-primary">
                                                        {item.quantity}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-text-muted">
                                                        {item.deliverySlot}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className={cn(
                                                            "text-xs font-medium",
                                                            (item.status === 'Delivered' || item.status === 'Completed') ? "text-emerald-600" :
                                                                item.status === 'Predicted' ? "text-purple-600" : "text-blue-600"
                                                        )}>
                                                            {item.status || "Pending"}
                                                        </span>
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            (item.status === 'Delivered' || item.status === 'Completed') ? "bg-emerald-500" :
                                                                item.status === 'Predicted' ? "bg-purple-500 animate-pulse" : "bg-blue-500 animate-pulse"
                                                        )} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card Layout View */}
                    <div className="block md:hidden space-y-3">
                        {filteredActive.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-border-custom p-8 text-center text-text-muted font-medium italic">
                                No active deliveries found for this slot.
                            </div>
                        ) : (
                            filteredActive.map((item: PrepRow) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-border-custom p-4 shadow-sm flex flex-col gap-3.5 relative hover:shadow-md transition-all">
                                    {/* Top Row: Customer & Slot */}
                                    <div className="flex items-start justify-between gap-2 border-b border-border-custom/50 pb-2.5">
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-sm text-foreground truncate">{item.customerName}</h4>
                                            <p className="text-[11px] font-bold text-text-muted">{item.phoneNumber}</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-medium text-text-muted shrink-0">
                                            {item.deliverySlot}
                                        </span>
                                    </div>

                                    {/* Middle Row: Product Name */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 shrink-0" />
                                        <span className="text-xs font-bold text-foreground uppercase tracking-tight leading-snug">{item.productName}</span>
                                    </div>

                                    {/* Bottom Row: Qty & Status */}
                                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-custom/40 bg-background-soft/10 -mx-4 px-4 py-2 rounded-b-2xl">
                                        <div className="flex items-center gap-1.5 font-semibold text-xs text-primary">
                                            <span className="text-[9px] text-text-muted uppercase tracking-tighter block font-bold">Qty:</span>
                                            <span className="bg-background-soft px-2 py-0.5 rounded">{item.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn(
                                                "text-[10px] font-semibold",
                                                (item.status === 'Delivered' || item.status === 'Completed') ? "text-emerald-600" :
                                                    item.status === 'Predicted' ? "text-purple-600" : "text-blue-600"
                                            )}>
                                                {item.status || "Pending"}
                                            </span>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                (item.status === 'Delivered' || item.status === 'Completed') ? "bg-emerald-500" :
                                                    item.status === 'Predicted' ? "bg-purple-500 animate-pulse" : "bg-blue-500 animate-pulse"
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* VACATION / PAUSED TABLE */}
                {filteredPausedFilter.length > 0 && (
                    <div className="space-y-4 pt-10">
                        <div className="flex items-center gap-2 ml-2">
                            <PauseCircle size={18} className="text-red-400" />
                            <h3 className="text-sm font-semibold text-text-muted">Paused / Vacation Orders</h3>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-xl border border-border-custom overflow-hidden shadow-sm opacity-60">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse grayscale">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-border-custom">
                                            <th className="px-6 py-4 text-xs font-medium text-text-muted">Customer</th>
                                            <th className="px-6 py-4 text-xs font-medium text-text-muted">Product</th>
                                            <th className="px-6 py-4 text-xs font-medium text-text-muted text-center">Qty</th>
                                            <th className="px-6 py-4 text-xs font-medium text-text-muted text-right">Pause Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-custom/40">
                                        {filteredPausedFilter.map((item: PrepRow) => (
                                            <tr key={item.id} className="bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-text-muted line-through">{item.customerName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-text-muted">{item.productName}</td>
                                                <td className="px-6 py-4 text-center font-bold text-text-muted">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-semibold">
                                                        Scheduled Pause
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card Layout View */}
                        <div className="block md:hidden space-y-3 opacity-60 grayscale">
                            {filteredPausedFilter.map((item: PrepRow) => (
                                <div key={item.id} className="bg-gray-50/50 rounded-2xl border border-border-custom p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-2 border-b border-border-custom/40 pb-2">
                                        <span className="font-bold text-xs text-text-muted line-through truncate">{item.customerName}</span>
                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-semibold shrink-0">
                                            Scheduled Pause
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 pt-1 text-xs text-text-muted font-medium">
                                        <span className="truncate">{item.productName}</span>
                                        <span className="font-bold shrink-0">Qty: {item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
