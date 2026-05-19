"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"
import {
    ArrowRight, CheckCircle2, BarChart3, Truck,
    Clock, ShieldCheck, Smartphone, Star, Users, Package
} from "lucide-react"

/* ─── tiny reusable primitives ─────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-primary-soft text-primary border border-primary-light">
            {children}
        </span>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <Tag>{children}</Tag>
}

/* ─── data ──────────────────────────────────────────────── */
const STATS = [
    { value: "50K+", label: "Customers served" },
    { value: "200+", label: "Verified dairies" },
    { value: "1M+",  label: "Deliveries done" },
    { value: "4.8",  label: "App store rating" },
]

const FEATURES = [
    {
        icon: BarChart3,
        title: "Live order dashboard",
        desc: "Every incoming milk order appears in real time. Accept, prepare, and dispatch from one screen — no phone calls, no notebooks.",
    },
    {
        icon: Truck,
        title: "Rider dispatch & tracking",
        desc: "Assign morning deliveries in seconds. See where every rider is until the last bottle is dropped off.",
    },
    {
        icon: BarChart3,
        title: "Revenue analytics",
        desc: "Daily sales, top milk types, subscription trends. Everything you need to grow — without touching a spreadsheet.",
    },
    {
        icon: Package,
        title: "Stock management",
        desc: "Set daily limits per milk type. Never oversell. Get low-stock alerts before your morning rush starts.",
    },
    {
        icon: ShieldCheck,
        title: "Payments & settlements",
        desc: "Razorpay-powered checkout, wallet top-ups, and same-day bank settlement for every order.",
    },
    {
        icon: Smartphone,
        title: "Customer subscriptions",
        desc: "Customers set a daily schedule. You prepare the right quantity every morning — automatically.",
    },
]

const STEPS = [
    {
        n: "01",
        title: "Register your dairy",
        desc: "Enter your farm name, city, and FSSAI number. Our team verifies your listing within 24 hours.",
    },
    {
        n: "02",
        title: "List your milk types",
        desc: "Add full cream, toned, A2, or buffalo milk with prices and daily quantity limits.",
    },
    {
        n: "03",
        title: "Go live & start earning",
        desc: "Your store goes public. Customers subscribe, you prepare, riders deliver. Every morning, like clockwork.",
    },
]

const TESTIMONIALS = [
    {
        name: "Rajan Verma",
        role: "Sunrise Dairy Farm, Pune",
        quote: "Before Milkdi I was managing 80 customers on WhatsApp. Now I handle 400+ with zero confusion.",
        rating: 5,
    },
    {
        name: "Anita Sharma",
        role: "Nandini Farms, Bengaluru",
        quote: "The morning dashboard shows me exactly what to prepare. My riders finish by 7 AM every day.",
        rating: 5,
    },
    {
        name: "Suresh Patel",
        role: "Gokul Dairy Farm, Ahmedabad",
        quote: "Subscription payments hit my account the same day. No follow-ups, no delays.",
        rating: 5,
    },
]

/* ─── page ──────────────────────────────────────────────── */
export default function LandingPage() {
    const router = useRouter()

    useEffect(() => {
        const role = typeof window !== "undefined" ? localStorage.getItem("role") : null
        if (role === "retailer") { router.replace("/retailer/dashboard"); return }
        if (role === "admin")    { router.replace("/admin/dashboard");    return }
    }, [router])

    return (
        <div className="min-h-screen bg-white text-text-title antialiased">
            <PublicNav />

            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="pt-[68px] border-b border-border">
                <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">

                    {/* left */}
                    <div>
                        <SectionLabel>Pure milk · Daily delivery</SectionLabel>

                        <h1 className="mt-6 text-[2.75rem] lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-text-title">
                            Fresh milk delivered<br />
                            <span className="text-primary">before sunrise.</span>
                        </h1>

                        <p className="mt-5 text-lg text-text-muted leading-relaxed max-w-md">
                            Skip the carton. Get real cow and buffalo milk from verified local dairy farms — delivered to your door every morning.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Download the app
                                <ArrowRight size={15} />
                            </a>
                            <Link
                                href="/vendors"
                                className="inline-flex items-center gap-2 border border-border text-sm font-semibold px-6 py-3 rounded-lg text-text-title hover:border-primary hover:text-primary transition-colors"
                            >
                                For dairy vendors
                            </Link>
                        </div>

                        <ul className="mt-10 space-y-3">
                            {[
                                "100% verified farms — cow & buffalo milk",
                                "Delivered before 7 AM, 365 days a year",
                                "Flexible daily & weekly subscriptions",
                            ].map(t => (
                                <li key={t} className="flex items-center gap-2.5 text-sm text-text-body">
                                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* right — clean product card */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-sm rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                            {/* top green strip */}
                            <div className="h-2 bg-primary w-full" />
                            <div className="p-8">
                                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">Today's availability</p>
                                {[
                                    { label: "Full Cream Milk", qty: "500 ml", price: "₹32", badge: "Popular" },
                                    { label: "A2 Desi Cow Milk", qty: "1 L",    price: "₹85", badge: "Organic" },
                                    { label: "Buffalo Milk",    qty: "500 ml", price: "₹38", badge: "" },
                                    { label: "Toned Milk",      qty: "1 L",    price: "₹52", badge: "" },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-border last:border-none">
                                        <div>
                                            <p className="text-sm font-semibold text-text-title">{item.label}</p>
                                            <p className="text-xs text-text-muted">{item.qty}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.badge && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary-light">
                                                    {item.badge}
                                                </span>
                                            )}
                                            <span className="text-sm font-bold text-text-title">{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                    target="_blank" rel="noopener noreferrer"
                                    className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Subscribe now
                                    <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="border-t border-border">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                            {STATS.map(s => (
                                <div key={s.label} className="px-8 py-6">
                                    <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOR VENDORS ─────────────────────────────────────── */}
            <section className="py-24 bg-white border-b border-border">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-2xl mb-14">
                        <SectionLabel>For dairy vendors</SectionLabel>
                        <h2 className="mt-5 text-3xl font-extrabold tracking-tight">
                            Everything to run your dairy — in one dashboard
                        </h2>
                        <p className="mt-4 text-base text-text-muted leading-relaxed">
                            Built for milk distributors and dairy farms who want to stop managing orders on WhatsApp and start growing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
                        {FEATURES.map((f, i) => (
                            <div
                                key={f.title}
                                className="bg-white p-7 hover:bg-primary-soft transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary-soft border border-primary-light flex items-center justify-center mb-5 group-hover:bg-white transition-colors">
                                    <f.icon size={17} className="text-primary" />
                                </div>
                                <h3 className="text-sm font-bold text-text-title mb-2">{f.title}</h3>
                                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex items-center gap-4">
                        <Link
                            href="/vendors"
                            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Become a vendor
                            <ArrowRight size={14} />
                        </Link>
                        <Link href="/how-it-works" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                            See how it works →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ────────────────────────────────────── */}
            <section className="py-24 bg-background border-b border-border">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-xl mx-auto mb-14">
                        <SectionLabel>Getting started</SectionLabel>
                        <h2 className="mt-5 text-3xl font-extrabold tracking-tight">Up and running today</h2>
                        <p className="mt-4 text-base text-text-muted">
                            No hardware, no tech setup. Register your dairy and start accepting orders before tomorrow morning.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STEPS.map((s, i) => (
                            <div key={s.n} className="relative">
                                {i < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-5 left-[calc(100%_-_16px)] w-8 h-px bg-border z-10" />
                                )}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                                        {s.n}
                                    </span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <h3 className="text-base font-bold text-text-title mb-2">{s.title}</h3>
                                <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ────────────────────────────────────── */}
            <section className="py-24 bg-white border-b border-border">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-xl mx-auto mb-14">
                        <SectionLabel>From our vendors</SectionLabel>
                        <h2 className="mt-5 text-3xl font-extrabold tracking-tight">Trusted by dairy farmers across India</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="border border-border rounded-xl p-7 hover:border-primary-light hover:shadow-sm transition-all">
                                <div className="flex gap-0.5 mb-5">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-text-body leading-relaxed mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-soft border border-primary-light flex items-center justify-center text-primary text-xs font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-title">{t.name}</p>
                                        <p className="text-xs text-text-muted">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="py-24 bg-primary">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Ready to grow your dairy business?
                    </h2>
                    <p className="mt-4 text-base text-white/70">
                        Join 200+ dairies already running their mornings on Milkdi. Free to get started.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/vendors"
                            className="inline-flex items-center gap-2 bg-white text-primary text-sm font-bold px-7 py-3.5 rounded-lg hover:bg-primary-soft transition-colors"
                        >
                            Register your dairy
                            <ArrowRight size={14} />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 border border-white/30 text-white text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
