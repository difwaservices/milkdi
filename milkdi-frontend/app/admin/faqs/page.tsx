"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, HelpCircle, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"

interface FAQ {
    _id: string
    question: string
    answer: string
    order: number
}

const emptyForm = { question: "", answer: "", order: 0 }

export default function FaqsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<FAQ | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const fetchFaqs = async () => {
        try {
            setLoading(true)
            const res = await adminService.getFaqs()
            if (res.success) setFaqs(res.data)
        } catch {
            toast.error("Failed to load FAQs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchFaqs() }, [])

    const openAdd = () => {
        setEditing(null)
        setForm({ ...emptyForm, order: faqs.length + 1 })
        setShowModal(true)
    }

    const openEdit = (faq: FAQ) => {
        setEditing(faq)
        setForm({ question: faq.question, answer: faq.answer, order: faq.order })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditing(null)
        setForm(emptyForm)
    }

    const handleSave = async () => {
        if (!form.question.trim() || !form.answer.trim()) {
            toast.error("Question and answer are required")
            return
        }
        setSaving(true)
        try {
            if (editing) {
                await adminService.updateFaq(editing._id, form)
                toast.success("FAQ updated")
            } else {
                await adminService.createFaq(form)
                toast.success("FAQ created")
            }
            closeModal()
            fetchFaqs()
        } catch {
            toast.error("Failed to save FAQ")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await adminService.deleteFaq(id)
            toast.success("FAQ deleted")
            setFaqs(prev => prev.filter(f => f._id !== id))
        } catch {
            toast.error("Failed to delete FAQ")
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
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">FAQs</h1>
                        <p className="text-sm text-text-secondary">{faqs.length} questions</p>
                    </div>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add FAQ
                </button>
            </div>

            {/* FAQ List */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-background-soft rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : faqs.length === 0 ? (
                <div className="text-center py-16 text-text-secondary">
                    <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No FAQs yet</p>
                    <p className="text-sm mt-1">Click &quot;Add FAQ&quot; to create the first one</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {faqs.map((faq) => (
                        <div key={faq._id} className="bg-white border border-border-custom rounded-xl overflow-hidden">
                            <div
                                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-background-soft transition-colors"
                                onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-xs font-bold text-text-secondary bg-background-soft px-2 py-0.5 rounded-lg shrink-0">
                                        #{faq.order}
                                    </span>
                                    <p className="font-semibold text-text-primary text-sm truncate">{faq.question}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-3 shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEdit(faq) }}
                                        className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(faq._id) }}
                                        disabled={deletingId === faq._id}
                                        className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    {expandedId === faq._id
                                        ? <ChevronUp className="w-4 h-4 text-text-secondary" />
                                        : <ChevronDown className="w-4 h-4 text-text-secondary" />
                                    }
                                </div>
                            </div>
                            {expandedId === faq._id && (
                                <div className="px-5 pb-4 pt-1 border-t border-border-custom bg-background-soft">
                                    <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
                            <h2 className="font-bold text-text-primary">{editing ? "Edit FAQ" : "Add FAQ"}</h2>
                            <button onClick={closeModal} className="p-1.5 hover:bg-background-soft rounded-lg transition-colors">
                                <X className="w-4 h-4 text-text-secondary" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-1.5">Question *</label>
                                <input
                                    value={form.question}
                                    onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                                    placeholder="e.g. How do I pause my subscription?"
                                    className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-1.5">Answer *</label>
                                <textarea
                                    value={form.answer}
                                    onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                                    placeholder="Write the answer here..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-1.5">Display Order</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                                    min={1}
                                    className="w-32 px-4 py-2.5 border border-border-custom rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                />
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
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
