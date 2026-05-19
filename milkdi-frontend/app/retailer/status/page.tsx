"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Clock,
    XCircle,
    CheckCircle2,
    Building2,
    MapPin,
    RefreshCw,
    LogOut,
    Sparkles,
    ShieldCheck,
    Rocket,
    Phone,
    Download,
    Package,
    Wallet,
    PlayCircle,
    Users,
    Star,
    Timer,
    HelpCircle,
    ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import useAuthStore from "@/data/store/useAuthStore"

const PREP_TASKS = [
    { id: "app", label: "Download the Milkdi Vendor app", icon: Download, hint: "Get notified the moment you go live" },
    { id: "products", label: "Prepare your product list & prices", icon: Package, hint: "Have 5–10 SKUs ready to publish on day one" },
    { id: "bank", label: "Keep bank account details handy", icon: Wallet, hint: "Needed for payouts; we'll ask after approval" },
    { id: "support", label: "Save support contact", icon: Phone, hint: "+91 98765 43210 — for any approval queries" },
    { id: "video", label: "Watch the 3-min onboarding video", icon: PlayCircle, hint: "Learn the dashboard before you log in" }
]

const FAQS = [
    {
        q: "How long does verification take?",
        a: "Most applications are reviewed within 24–48 hours. Complex cases (missing GST verification, unclear documents) may take up to 72 hours."
    },
    {
        q: "What if my application is rejected?",
        a: "You'll see the exact reason on this page along with an 'Update & Resubmit' button. We rarely reject — most rejections are document quality issues that are easy to fix."
    },
    {
        q: "Can I start adding products before approval?",
        a: "Not yet — the dashboard unlocks the moment we approve you. You can still prepare your product list offline so you launch the same day."
    },
    {
        q: "Will my data be saved if I close this page?",
        a: "Yes. Everything you submitted is safely stored. This page auto-refreshes your status every 30 seconds."
    }
]

export default function StatusPage() {
    const router = useRouter()
    const { user, logout, checkAuth, loading: storeLoading } = useAuthStore()
    const [lastChecked, setLastChecked] = useState<Date>(new Date())
    const [refreshing, setRefreshing] = useState(false)
    const [secondsAgo, setSecondsAgo] = useState(0)
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    useEffect(() => {
        const stored = localStorage.getItem("milkdi_prep_tasks")
        if (stored) {
            try { setCompletedTasks(JSON.parse(stored)) } catch { /* noop */ }
        }
    }, [])

    useEffect(() => {
        const updateStatus = async () => {
            if (!user) {
                await checkAuth()
                return
            }
            if (user.status === "approved") {
                router.push("/retailer/dashboard")
            }
        }
        updateStatus()
        const interval = setInterval(async () => {
            await checkAuth()
            setLastChecked(new Date())
        }, 30000)
        return () => clearInterval(interval)
    }, [user, router, checkAuth])

    useEffect(() => {
        const tick = setInterval(() => {
            setSecondsAgo(Math.floor((Date.now() - lastChecked.getTime()) / 1000))
        }, 1000)
        return () => clearInterval(tick)
    }, [lastChecked])

    const handleManualRefresh = async () => {
        setRefreshing(true)
        await checkAuth()
        setLastChecked(new Date())
        setTimeout(() => setRefreshing(false), 600)
    }

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const handleResubmit = () => router.push("/onboarding")

    const toggleTask = (id: string) => {
        const next = { ...completedTasks, [id]: !completedTasks[id] }
        setCompletedTasks(next)
        localStorage.setItem("milkdi_prep_tasks", JSON.stringify(next))
    }

    if (storeLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="w-10 h-10 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
            </div>
        )
    }

    const userData = user
    const isRejected = userData?.status === "rejected"
    const isUnderReview = userData?.status === "under_review"

    const stages = [
        { key: "submitted", label: "Submitted", icon: CheckCircle2 },
        { key: "review", label: "Under Review", icon: ShieldCheck },
        { key: "approved", label: "Approved", icon: Sparkles },
        { key: "live", label: "Live", icon: Rocket }
    ]
    const currentStageIndex = isRejected ? 1 : isUnderReview ? 1 : 0
    const completedTaskCount = Object.values(completedTasks).filter(Boolean).length

    const formattedLastChecked = secondsAgo < 10
        ? "just now"
        : secondsAgo < 60
            ? `${secondsAgo}s ago`
            : `${Math.floor(secondsAgo / 60)}m ago`

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0c2340] p-5 lg:p-10">
            <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/milkdi-icon.svg" alt="Logo" className="w-9 h-9" />
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-bold text-white">milkdi</span>
                            <span className="text-[10px] font-semibold tracking-wide mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Pure Milk. Pure Life.</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white/70 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>

                {/* Welcome line */}
                {userData?.businessDetails?.ownerName && (
                    <p className="text-white/70 text-sm">
                        Welcome back, <span className="text-white font-semibold">{userData.businessDetails.ownerName}</span> 👋
                    </p>
                )}

                {/* Status hero with timeline */}
                <div className={cn(
                    "rounded-3xl border shadow-2xl relative overflow-hidden",
                    isUnderReview ? "bg-white border-white/10" : "bg-red-50 border-red-100"
                )}>
                    {isUnderReview && (
                        <>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />
                        </>
                    )}

                    <div className="relative z-10 p-7 lg:p-10">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                                    isUnderReview ? "bg-blue-50 text-blue-600" : "bg-red-100 text-red-600"
                                )}>
                                    {isUnderReview ? <Clock size={26} className="animate-pulse" /> : <XCircle size={26} />}
                                </div>
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] leading-tight">
                                        {isUnderReview ? "Application under review" : "Application not approved"}
                                    </h2>
                                    <p className="text-sm text-[#64748B] mt-1.5">
                                        {isUnderReview
                                            ? "Our team is verifying your details. You'll get full dashboard access within 24–48 hours."
                                            : "Please review the rejection reason below and update your details."}
                                    </p>
                                </div>
                            </div>

                            {isUnderReview && (
                                <div className="flex flex-col gap-2 items-end">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                                        <Timer size={13} className="text-amber-700" />
                                        <span className="text-xs font-semibold text-amber-700">ETA: within 48 hours</span>
                                    </div>
                                    <button
                                        onClick={handleManualRefresh}
                                        disabled={refreshing}
                                        className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#D97706] font-medium transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                                        Last checked {formattedLastChecked} · Refresh
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Progress timeline */}
                        <div className="relative mt-6">
                            <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-200" />
                            <div
                                className="absolute left-0 top-5 h-0.5 transition-all duration-500"
                                style={{
                                    width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                                    background: isRejected ? "#FCA5A5" : "linear-gradient(to right, #D97706, #D97706)"
                                }}
                            />
                            <div className="relative grid grid-cols-4 gap-2">
                                {stages.map((stage, idx) => {
                                    const isDone = idx < currentStageIndex
                                    const isCurrent = idx === currentStageIndex
                                    const Icon = stage.icon
                                    return (
                                        <div key={stage.key} className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
                                                isDone && !isRejected && "bg-blue-600 text-white shadow-lg shadow-blue-200",
                                                isCurrent && !isRejected && "bg-white text-blue-600 ring-4 ring-blue-100",
                                                isCurrent && isRejected && "bg-red-100 text-red-600 ring-4 ring-red-50",
                                                !isDone && !isCurrent && "bg-slate-100 text-slate-400"
                                            )}>
                                                <Icon size={16} />
                                                {isCurrent && isUnderReview && (
                                                    <span className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
                                                )}
                                            </div>
                                            <p className={cn(
                                                "text-[11px] font-semibold mt-2 text-center",
                                                isCurrent ? "text-[#0F172A]" : "text-[#94A3B8]"
                                            )}>{stage.label}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {isRejected && (
                            <div className="mt-6 p-4 rounded-xl bg-white border border-red-200">
                                <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1.5">Rejection reason</p>
                                <p className="text-sm font-medium text-[#0F172A]">
                                    {userData?.rejectionReason || "Please verify your legal documents and business address."}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3 mt-6">
                            {isRejected && (
                                <button
                                    onClick={handleResubmit}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D97706] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-all"
                                >
                                    <RefreshCw size={14} />
                                    Update & Resubmit
                                </button>
                            )}
                            <a
                                href="tel:+919876543210"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-[#0F172A] text-sm font-semibold hover:bg-slate-50 transition-all"
                            >
                                <Phone size={14} />
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>

                {/* While you wait — preparation checklist */}
                {isUnderReview && (
                    <div className="rounded-3xl bg-white/95 backdrop-blur p-7 lg:p-10 shadow-xl">
                        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#D97706] mb-1">While you wait</p>
                                <h3 className="text-2xl font-bold text-[#0F172A]">Get ready to launch 🚀</h3>
                                <p className="text-sm text-[#64748B] mt-1">5 quick things to do today, so you can sell on day one.</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-xs font-semibold text-[#94A3B8]">{completedTaskCount} of {PREP_TASKS.length} done</p>
                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                            width: `${(completedTaskCount / PREP_TASKS.length) * 100}%`,
                                            background: "linear-gradient(to right, #D97706, #D97706)"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {PREP_TASKS.map(task => {
                                const done = !!completedTasks[task.id]
                                const Icon = task.icon
                                return (
                                    <button
                                        key={task.id}
                                        type="button"
                                        onClick={() => toggleTask(task.id)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all border",
                                            done
                                                ? "bg-emerald-50/60 border-emerald-200"
                                                : "bg-white border-slate-200 hover:border-[#D97706] hover:shadow-sm"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                                            done ? "bg-emerald-600 text-white" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-semibold",
                                                done ? "text-emerald-900 line-through" : "text-[#0F172A]"
                                            )}>
                                                {task.label}
                                            </p>
                                            <p className="text-xs text-[#64748B] mt-0.5">{task.hint}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Trust badges / stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {[
                        { icon: Users, value: "500+", label: "active vendors" },
                        { icon: Star, value: "4.8★", label: "vendor rating" },
                        { icon: Timer, value: "~36hr", label: "avg approval" },
                        { icon: ShieldCheck, value: "99%", label: "approval rate" }
                    ].map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4 lg:p-5">
                                <Icon size={18} className="text-[#7DD3FC] mb-2" />
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mt-0.5">{stat.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Submitted Details */}
                <div className="rounded-3xl bg-white/95 backdrop-blur p-7 lg:p-10 shadow-xl">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2.5">
                        <Building2 size={20} className="text-[#D97706]" />
                        Submitted Details
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                        <DetailRow label="Business Name" value={userData?.businessDetails?.businessName} />
                        <DetailRow label="Owner" value={userData?.businessDetails?.ownerName} />
                        <DetailRow label="WhatsApp" value={userData?.whatsappNumber ? `+91 ${userData.whatsappNumber}` : undefined} />
                        <DetailRow label="Years in Business" value={userData?.businessDetails?.yearsInBusiness} />
                        <div className="sm:col-span-2">
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Address</p>
                            <p className="text-sm text-[#334155] flex items-start gap-2">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#94A3B8]" />
                                <span>
                                    {[
                                        userData?.businessDetails?.location?.address,
                                        userData?.businessDetails?.location?.city,
                                        userData?.businessDetails?.location?.state
                                    ].filter(Boolean).join(", ")}
                                    {userData?.businessDetails?.location?.pincode && ` - ${userData.businessDetails.location.pincode}`}
                                </span>
                            </p>
                        </div>
                        <DetailRow label="GST" value={userData?.businessDetails?.legal?.gst} fallback="Not provided" />
                        <DetailRow label="FSSAI" value={userData?.businessDetails?.legal?.fssai} fallback="Not provided" />
                    </div>
                </div>

                {/* FAQs */}
                <div className="rounded-3xl bg-white/95 backdrop-blur p-7 lg:p-10 shadow-xl">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2.5">
                        <HelpCircle size={20} className="text-[#D97706]" />
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-2">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-[#0F172A]">{faq.q}</span>
                                    <ChevronDown
                                        size={16}
                                        className={cn("text-[#94A3B8] transition-transform flex-shrink-0", openFaq === i && "rotate-180")}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 pb-4 pt-1 text-sm text-[#475569] leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-white/40 py-4">
                    Need urgent help? Email <a href="mailto:support@milkdi.com" className="text-white/70 hover:text-white underline">support@milkdi.com</a> or call <a href="tel:+919876543210" className="text-white/70 hover:text-white underline">+91 98765 43210</a>
                </p>
            </div>
        </div>
    )
}

function DetailRow({ label, value, fallback = "—" }: { label: string; value?: string; fallback?: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{label}</p>
            <p className={cn("text-sm font-semibold", value ? "text-[#0F172A]" : "text-[#94A3B8] italic font-normal")}>
                {value || fallback}
            </p>
        </div>
    )
}
