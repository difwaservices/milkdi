"use client"

import { useState, useEffect } from "react"
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package,
    TrendingUp,
    AlertCircle,
    Loader2,
    RefreshCw,
    Download,
    MoreVertical
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { useRef } from "react"
import { toast } from "sonner"
import useProductStore from "@/data/store/useProductStore"

function RetailerProductsContent() {
    const [mounted, setMounted] = useState(false)
    const { 
        products, 
        loading, 
        fetchProducts, 
        deleteProduct,
        searchQuery,
        setSearchQuery 
    } = useProductStore()
    
    const [activeTab, setActiveTab] = useState("All Products")
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const moreMenuRef = useRef<HTMLDivElement>(null)

    const searchParams = useSearchParams()

    useEffect(() => {
        setMounted(true)
        fetchProducts()
        
        const q = searchParams.get("q") || searchParams.get("query")
        if (q) {
            setSearchQuery(q)
        }
    }, [searchParams, fetchProducts, setSearchQuery])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setShowMoreMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await deleteProduct(id)
            toast.success("Product deleted")
        } catch (error) {
            console.error("Delete failed:", error)
            toast.error("Failed to delete product")
        }
    }

    if (!mounted || loading) {
        return <div className="space-y-6 animate-pulse p-4">
            <div className="h-12 bg-background-soft rounded-xl w-1/4" />
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-background-soft rounded-2xl" />)}
            </div>
            <div className="h-96 bg-background-soft rounded-2xl" />
        </div>
    }

    const filteredProducts = products.filter((p: any) => {
        const matchesSearch = (p.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
        const matchesTab = activeTab === "All Products" || p.status === activeTab
        return matchesSearch && matchesTab
    })

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">My Products</h1>
                    <p className="text-xs sm:text-sm text-text-muted">Manage your shop&apos;s inventory and listings.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <Link href="/retailer/products/add" className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-all text-xs sm:text-sm font-bold shadow-md shadow-primary/20 shrink-0">
                        <Plus size={16} className="shrink-0" />
                        <span>Add New Item</span>
                    </Link>
                    <div className="relative" ref={moreMenuRef}>
                        <button 
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className={cn(
                                "p-2 rounded-lg border transition-all",
                                showMoreMenu ? "bg-primary/10 border-primary text-primary" : "bg-white hover:bg-background-soft border-border-custom text-text-muted"
                            )}
                        >
                            <MoreVertical size={18} />
                        </button>

                        {showMoreMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border-custom shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 py-2">
                                <button 
                                    onClick={() => {
                                        fetchProducts(true);
                                        setShowMoreMenu(false);
                                        toast.success("Inventory refreshed");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-background-soft transition-colors"
                                >
                                    <RefreshCw size={16} className="text-primary" />
                                    Refresh Inventory
                                </button>
                                <button 
                                    onClick={() => {
                                        window.print();
                                        setShowMoreMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-background-soft transition-colors"
                                >
                                    <Download size={16} className="text-blue-500" />
                                    Print/Save View
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-border-custom shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                    <div className="p-3 rounded-xl bg-primary-light text-primary group-hover:scale-110 transition-transform">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted mt-1 uppercase tracking-tighter">My Products</p>
                        <h3 className="text-2xl font-bold">{products.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border-custom shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted mt-1 uppercase tracking-tighter">Active Listings</p>
                        <h3 className="text-2xl font-bold">{products.filter((p: any) => p.status === "Published").length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border-custom shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted mt-1 uppercase tracking-tighter">Low Stock</p>
                        <h3 className="text-2xl font-bold">{products.filter((p: any) => p.stock < 10).length}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-custom shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-border-custom flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-1 bg-background-soft p-1 rounded-lg overflow-x-auto w-full sm:w-auto shrink-0">
                        {["All Products", "Published", "Draft"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 whitespace-nowrap",
                                    activeTab === tab ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-foreground"
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
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search my inventory"
                                className="pl-9 pr-4 py-1.5 rounded-lg bg-background-soft border-transparent text-sm outline-none w-full uppercase tracking-tighter"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop View: List/Table */}
                <div className="hidden md:block overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-primary/5 text-xs font-semibold text-foreground tracking-widest border-b border-border-custom">
                                <th className="px-2 py-3 md:px-6 md:py-4 text-center">Sl.</th>
                                <th className="px-2 py-3 md:px-6 md:py-4">Product</th>
                                <th className="px-2 py-3 md:px-6 md:py-4 text-center">Stock</th>
                                <th className="px-2 py-3 md:px-6 md:py-4">Price</th>
                                <th className="px-2 py-3 md:px-6 md:py-4">Status</th>
                                <th className="px-2 py-3 md:px-6 md:py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom text-sm">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                            <Package size={24} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-primary uppercase">No Products Found</h3>
                                        <p className="text-xs text-text-muted mt-1 uppercase tracking-tighter">Your inventory seems empty or filtered.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p: any, i: number) => (
                                    <tr key={p._id} className="hover:bg-background-soft/50 transition-colors">
                                        <td className="px-2 py-3 md:px-6 md:py-4 text-center">
                                            <span className="text-text-muted font-bold">{i + 1}</span>
                                        </td>
                                        <td className="px-2 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-custom shadow-sm bg-background-soft">
                                                    <img src={p.images?.[0] || "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=100&h=100&auto=format&fit=crop"} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary uppercase line-clamp-1">{p.name}</p>
                                                    <p className="text-xs text-text-muted font-medium">{p.category?.name || 'Uncategorized'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 md:px-6 md:py-4 text-center">
                                            <p className="font-bold text-primary">{p.stock} lt.</p>
                                            <p className={cn(
                                                "text-[10px] font-semibold",
                                                p.stock <= 0 ? "text-red-600" :
                                                p.stock < 10 ? "text-orange-500" : "text-emerald-500"
                                            )}>
                                                {p.stock <= 0 ? 'Out of Stock' : (p.stock < 10 ? 'Low Stock' : 'In Stock')}
                                            </p>
                                        </td>
                                        <td className="px-2 py-3 md:px-6 md:py-4">
                                            <p className="font-bold text-primary">₹{p.price}</p>
                                        </td>
                                        <td className="px-2 py-3 md:px-6 md:py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit",
                                                p.status === "Published" ? "bg-primary-light text-primary" : "bg-gray-100 text-gray-400"
                                            )}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/retailer/products/edit/${p._id}`}
                                                    className="p-2 rounded-lg hover:bg-primary-light text-text-muted hover:text-primary transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Grid */}
                <div className="block md:hidden p-4 bg-background-soft/30 min-h-[300px]">
                    {filteredProducts.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-2xl border border-border-custom p-6 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                <Package size={24} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-primary uppercase">No Products Found</h3>
                            <p className="text-xs text-text-muted mt-1 uppercase tracking-tighter">Your inventory seems empty or filtered.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredProducts.map((p: any) => (
                                <div 
                                    key={p._id} 
                                    className="bg-white rounded-2xl border border-border-custom shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group animate-in fade-in zoom-in-95"
                                >
                                    {/* Image Wrapper */}
                                    <div className="w-full h-40 bg-background-soft relative overflow-hidden">
                                        <img 
                                            src={p.images?.[0] || "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=100&h=100&auto=format&fit=crop"} 
                                            alt={p.name || "Product"} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        {/* Category Overlay */}
                                        <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm">
                                            {p.category?.name || 'Uncategorized'}
                                        </span>
                                        {/* Status Overlay */}
                                        <span className={cn(
                                            "absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-md shadow-sm",
                                            p.status === "Published" ? "bg-primary/90 text-white" : "bg-white/90 text-gray-700"
                                        )}>
                                            {p.status}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                        <div>
                                            <h4 className="font-extrabold text-primary uppercase text-base tracking-tight line-clamp-1">
                                                {p.name}
                                            </h4>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-custom/50">
                                                <div>
                                                    <span className="text-[10px] text-text-muted font-bold block uppercase tracking-tighter">Price</span>
                                                    <span className="text-lg font-bold text-primary">₹{p.price}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-text-muted font-bold block uppercase tracking-tighter">Stock</span>
                                                    <span className="text-sm font-bold text-primary block">{p.stock} lt.</span>
                                                    <span className={cn(
                                                        "text-[10px] font-semibold block",
                                                        p.stock <= 0 ? "text-red-600" :
                                                        p.stock < 10 ? "text-orange-500" : "text-emerald-500"
                                                    )}>
                                                        {p.stock <= 0 ? 'Out of Stock' : (p.stock < 10 ? 'Low Stock' : 'In Stock')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Row */}
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-custom bg-background-soft/20 -mx-4 -mb-4 p-3 mt-1">
                                            <Link
                                                href={`/retailer/products/edit/${p._id}`}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold"
                                            >
                                                <Edit2 size={13} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-bold"
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border-custom flex items-center justify-between bg-background-soft/30">
                    <button className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50" disabled>
                        <ChevronLeft size={14} /> Previous
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold bg-primary text-white shadow-md shadow-primary/20">1</button>
                    </div>
                    <button className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50" disabled>
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

import { Suspense } from "react"

export default function RetailerProductsPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6 animate-pulse p-4">
                <div className="h-12 bg-background-soft rounded-xl w-1/4" />
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-background-soft rounded-2xl" />)}
                </div>
                <div className="h-96 bg-background-soft rounded-2xl" />
            </div>
        }>
            <RetailerProductsContent />
        </Suspense>
    )
}
