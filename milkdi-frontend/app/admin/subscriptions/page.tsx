"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Save, CheckCircle, Crown, Package, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"

interface Plan {
    _id: string
    name: string
    description: string
    price: number
    billingCycle: "Monthly" | "Yearly" | "Lifetime"
    features: string[]
    maxOrderQuantity: number
    discountPercentage: number
    bulkOrdersAllowed: boolean
    isActive: boolean
}

const emptyForm = {
    name: "",
    description: "",
    price: 0,
    billingCycle: "Monthly" as Plan["billingCycle"],
    features: [""],
    maxOrderQuantity: 10,
    discountPercentage: 0,
    bulkOrdersAllowed: false,
    isActive: true,
}

const planIcons: any = { 0: Package, 1: Zap, 2: Crown }

export default function SubscriptionsPage() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Plan | null>(null)
    const [form, setForm] = useState({ ...emptyForm })
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const fetchPlans = async () => {
        try {
            setLoading(true)
            const res = await adminService.getSubscriptionPlans()
            if (res.success) setPlans(res.data || res.plans || [])
        } catch {
            toast.error("Failed to load subscription plans")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPlans() }, [])

    const openAdd = () => {
        setEditing(null)
        setForm({ ...emptyForm, features: [""] })
        setShowModal(true)
    }

    const openEdit = (plan: Plan) => {
        setEditing(plan)
        setForm({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            billingCycle: plan.billingCycle,
            features: plan.features.length > 0 ? plan.features : [""],
            maxOrderQuantity: plan.maxOrderQuantity,
            discountPercentage: plan.discountPercentage || 0,
            bulkOrdersAllowed: plan.bulkOrdersAllowed || false,
            isActive: plan.isActive !== false,
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditing(null)
        setForm({ ...emptyForm, features: [""] })
    }

    const setFeature = (i: number, val: string) => {
        setForm(f => {
            const features = [...f.features]
            features[i] = val
            return { ...f, features }
        })
    }

    const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ""] }))
    const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))

    const handleSave = async () => {
        if (!form.name.trim() || !form.description.trim()) {
            toast.error("Name and description are required")
            return
        }
        const payload = { ...form, features: form.features.filter(f => f.trim()) }
        setSaving(true)
        try {
            if (editing) {
                await adminService.updateSubscriptionPlan(editing._id, payload)
                toast.success("Plan updated")
            } else {
                await adminService.createSubscriptionPlan(payload)
                toast.success("Plan created")
            }
            closeModal()
            fetchPlans()
        } catch {
            toast.error("Failed to save plan")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await adminService.deleteSubscriptionPlan(id)
            toast.success("Plan deleted")
            setPlans(prev => prev.filter(p => p._id !== id))
        } catch {
            toast.error("Failed to delete plan")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">Subscription Plans</h1>
                        <p className="text-sm text-text-secondary">{plans.length} plans</p>
                    </div>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Plan
                </button>
            </div>

            {/* Plans Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-background-soft rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : plans.length === 0 ? (
                <div className="text-center py-16 text-text-secondary">
                    <Crown className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No plans yet</p>
                    <p className="text-sm mt-1">Click &quot;Add Plan&quot; to create the first subscription plan</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan, i) => {
                        const Icon = planIcons[i % 3] || Package
                        return (
                            <div key={plan._id} className={cn("bg-white border rounded-2xl p-5 space-y-4 relative", plan.isActive === false ? "opacity-60" : "border-border-custom")}>
                                {plan.isActive === false && (
                                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">Inactive</span>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-text-primary">{plan.name}</h3>
                                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-end gap-1">
                                    <span className="text-2xl font-bold text-foreground">
                                        {plan.price === 0 ? "Free" : `₹${plan.price}`}
                                    </span>
                                    {plan.price > 0 && (
                                        <span className="text-xs text-text-secondary mb-1">/{plan.billingCycle.toLowerCase()}</span>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    {plan.features.slice(0, 4).map((f, fi) => (
                                        <div key={fi} className="flex items-center gap-2 text-xs text-text-secondary">
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                    {plan.features.length > 4 && (
                                        <p className="text-xs text-text-secondary pl-5">+{plan.features.length - 4} more</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border-custom">
                                    <span className="text-xs text-text-secondary">Max: {plan.maxOrderQuantity} cans</span>
                                    {plan.discountPercentage > 0 && (
                                        <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            {plan.discountPercentage}% off
                                        </span>
                                    )}
                                    {plan.bulkOrdersAllowed && (
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Bulk</span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(plan)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-text-secondary border border-border-custom rounded-xl hover:bg-background-soft transition-colors"
                                    >
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan._id)}
                                        disabled={deletingId === plan._id}
                                        className="flex items-center justify-center px-3 py-2 text-xs font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom sticky top-0 bg-white">
                            <h2 className="font-bold text-text-primary">{editing ? "Edit Plan" : "Add Plan"}</h2>
                            <button onClick={closeModal} className="p-1.5 hover:bg-background-soft rounded-lg transition-colors">
                                <X className="w-4 h-4 text-text-secondary" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Plan Name *</label>
                                    <input
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="e.g. Basic, Premium"
                                        className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Description *</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                        min={0}
                                        className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Billing Cycle</label>
                                    <select
                                        value={form.billingCycle}
                                        onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value as Plan["billingCycle"] }))}
                                        className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="Lifetime">Lifetime</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Max Order (cans)</label>
                                    <input
                                        type="number"
                                        value={form.maxOrderQuantity}
                                        onChange={e => setForm(f => ({ ...f, maxOrderQuantity: Number(e.target.value) }))}
                                        min={1}
                                        className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Discount (%)</label>
                                    <input
                                        type="number"
                                        value={form.discountPercentage}
                                        onChange={e => setForm(f => ({ ...f, discountPercentage: Number(e.target.value) }))}
                                        min={0}
                                        max={100}
                                        className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.bulkOrdersAllowed}
                                        onChange={e => setForm(f => ({ ...f, bulkOrdersAllowed: e.target.checked }))}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm font-medium text-text-primary">Bulk orders allowed</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm font-medium text-text-primary">Active</span>
                                </label>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-text-primary">Features</label>
                                    <button onClick={addFeature} className="text-xs text-primary font-semibold hover:underline">+ Add feature</button>
                                </div>
                                <div className="space-y-2">
                                    {form.features.map((f, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                value={f}
                                                onChange={e => setFeature(i, e.target.value)}
                                                placeholder={`Feature ${i + 1}`}
                                                className="flex-1 px-4 py-2 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                            />
                                            {form.features.length > 1 && (
                                                <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-custom">
                            <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-soft rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {saving ? "Saving..." : "Save Plan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
