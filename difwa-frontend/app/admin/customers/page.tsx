"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Search, ChevronLeft, ChevronRight, UserPlus, Wallet, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"

export default function CustomersPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await adminService.getUsers(page, 20, search)
            if (res.success) setData(res)
        } catch {
            toast.error("Failed to load customers")
        } finally {
            setLoading(false)
        }
    }, [page, search])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const users = data?.data || []
    const pagination = data?.pagination || {}
    const verified = users.filter((u: any) => u.isVerified).length
    const withWallet = users.filter((u: any) => (u.walletBalance ?? 0) > 0).length

    const formatDate = (d: string) => {
        if (!d) return "—"
        return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">App Users</h1>
                <p className="text-sm text-text-secondary">Read-only — customer accounts</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Users", value: pagination.total ?? "—", icon: Users, cls: "bg-primary-light text-primary" },
                    { label: "Verified", value: verified, icon: CheckCircle, cls: "bg-blue-50 text-blue-600" },
                    { label: "Wallet Active", value: withWallet, icon: Wallet, cls: "bg-green-50 text-green-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white p-5 rounded-2xl border border-border-custom flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", s.cls)}><s.icon size={22} /></div>
                        <div>
                            <p className="text-xs font-semibold text-text-secondary">{s.label}</p>
                            <h3 className="text-2xl font-bold">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-border-custom overflow-hidden">
                <div className="p-4 border-b border-border-custom flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={15} />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search by name or phone..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-background-soft rounded-xl outline-none"
                        />
                    </div>
                    <span className="text-sm text-text-secondary">{pagination.total ?? 0} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-primary/5 text-xs font-bold text-primary uppercase tracking-wider border-b border-border-custom">
                                <th className="px-5 py-3">#</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Phone</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Wallet</th>
                                <th className="px-5 py-3">Verified</th>
                                <th className="px-5 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom">
                            {loading ? (
                                [...Array(8)].map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-4 bg-background-soft rounded animate-pulse" /></td></tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-text-secondary">No users found</td></tr>
                            ) : users.map((u: any, i: number) => (
                                <tr key={u._id} className="hover:bg-background-soft/50 transition-colors">
                                    <td className="px-5 py-3 text-text-secondary font-medium">{(page - 1) * 20 + i + 1}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                                                <span className="text-primary font-bold text-xs">
                                                    {(u.fullName || u.name || "?")[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-text-primary">{u.fullName || u.name || "—"}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-text-secondary">{u.phoneNumber || u.phone || "—"}</td>
                                    <td className="px-5 py-3 text-text-secondary">{u.email || "—"}</td>
                                    <td className="px-5 py-3 font-bold">₹{(u.walletBalance ?? 0).toFixed(2)}</td>
                                    <td className="px-5 py-3">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                                            u.isVerified ? "bg-primary-light text-primary" : "bg-red-50 text-red-500"
                                        )}>
                                            {u.isVerified ? "Verified" : "Unverified"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-text-secondary">{formatDate(u.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination.pages > 1 && (
                    <div className="p-4 border-t border-border-custom flex items-center justify-between">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-background-soft disabled:opacity-40">
                            <ChevronLeft size={15} /> Previous
                        </button>
                        <span className="text-sm text-text-secondary">Page {page} of {pagination.pages}</span>
                        <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                            className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-background-soft disabled:opacity-40">
                            Next <ChevronRight size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
