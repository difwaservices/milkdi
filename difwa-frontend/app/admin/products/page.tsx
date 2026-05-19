"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Package, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"

export default function ProductsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await adminService.getProducts({ page, search, limit: 20 })
            if (res.success) setData(res)
        } catch {
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }, [page, search])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    const products = data?.data || []
    const pagination = data?.pagination || {}
    const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 10).length
    const outOfStock = products.filter((p: any) => p.stock === 0).length

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: "Out of Stock", cls: "bg-red-50 text-red-500" }
        if (stock <= 10) return { label: "Low Stock", cls: "bg-warning-50 text-warning" }
        return { label: "In Stock", cls: "bg-primary-light text-primary" }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
                <p className="text-sm text-text-secondary">View-only — manage products from Retailer panel</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Products", value: pagination.total ?? "—", icon: Package, cls: "bg-primary-light text-primary" },
                    { label: "In Stock", value: products.filter((p: any) => p.stock > 0).length, icon: TrendingUp, cls: "bg-blue-50 text-blue-600" },
                    { label: "Low / Out of Stock", value: `${lowStock} / ${outOfStock}`, icon: AlertCircle, cls: "bg-red-50 text-red-600" },
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
                            placeholder="Search products..."
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
                                <th className="px-5 py-3">Product</th>
                                <th className="px-5 py-3">Retailer</th>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Price</th>
                                <th className="px-5 py-3">Stock</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom">
                            {loading ? (
                                [...Array(8)].map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-4 bg-background-soft rounded animate-pulse" /></td></tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-text-secondary">No products found</td></tr>
                            ) : products.map((p: any, i: number) => {
                                const stock = getStockStatus(p.stock ?? 0)
                                return (
                                    <tr key={p._id} className="hover:bg-background-soft/50 transition-colors">
                                        <td className="px-5 py-3 text-text-secondary font-medium">{(page - 1) * 20 + i + 1}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.images?.[0] ? (
                                                    <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover border" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-background-soft flex items-center justify-center">
                                                        <Package size={14} className="text-text-secondary" />
                                                    </div>
                                                )}
                                                <span className="font-semibold text-text-primary">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-text-secondary">{p.retailer?.businessDetails?.businessName || p.retailer?.name || "—"}</td>
                                        <td className="px-5 py-3 text-text-secondary">{p.category?.name || "—"}</td>
                                        <td className="px-5 py-3 font-bold">₹{p.price}</td>
                                        <td className="px-5 py-3 font-bold">{p.stock ?? 0}</td>
                                        <td className="px-5 py-3">
                                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase", stock.cls)}>{stock.label}</span>
                                        </td>
                                    </tr>
                                )
                            })}
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
