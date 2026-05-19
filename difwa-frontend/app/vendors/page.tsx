import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardList, Truck, BarChart2, CreditCard, Bell, Users, CheckCircle, Star } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "For Vendors",
    description: "Grow your milk delivery business with Milkdi. Manage orders, dispatch riders, track revenue, and get paid automatically. Register your shop in minutes.",
    keywords: ["dairy vendor platform", "milk delivery business", "water shop management", "vendor dashboard"],
    alternates: { canonical: "https://www.milkdi.com/vendors" },
    openGraph: {
        title: "For Vendors | Grow Your Milk Delivery Business | Milkdi",
        description: "Powerful tools for dairy vendor shops. Live order board, rider dispatch, revenue analytics, and instant payouts. Free setup.",
        url: "https://www.milkdi.com/vendors",
    },
}

export default function VendorsPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav orderLabel="Join as Vendor" />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #b8e9fa 50%, #f0f9ff 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>

                            <h1 className="font-extrabold mb-5 leading-tight" style={{ fontSize: "clamp(28px,3.5vw,50px)", color: "#0F172A" }}>
                                The platform built for <span className="text-primary">dairy vendor shops</span>
                            </h1>
                            <p className="text-sm leading-relaxed mb-8 text-text-body">
                                Manage orders, riders, inventory and payments from one powerful dashboard. No technical setup required — register and start taking orders today.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/register"
                                    className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl shadow-lg bg-primary">
                                    Register Your Shop
                                </Link>
                                <Link href="/how-it-works"
                                    className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl"
                                    style={{ border: "1.5px solid #FDE68A", color: "#D97706", background: "white" }}>
                                    See How It Works
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: ClipboardList, value: "1M+", label: "Orders Processed" },
                                { icon: Users, value: "200+", label: "Active Vendors" },
                                { icon: Star, value: "4.8★", label: "Vendor Rating" },
                                { icon: CreditCard, value: "₹0", label: "Setup Cost" },
                            ].map(s => (
                                <div key={s.label} className="p-5 rounded-2xl bg-white text-center" style={{ border: "1px solid #E2E8F0" }}>
                                    <s.icon size={20} style={{ color: "#D97706", margin: "0 auto 8px" }} />
                                    <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                                    <p className="text-xs font-medium text-text-muted">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 bg-primary-soft text-primary">
                            Everything You Need
                        </div>
                        <h2 className="text-3xl font-extrabold mb-3 text-text-title">Powerful tools, zero complexity</h2>
                        <p className="text-base max-w-xl mx-auto text-text-muted">
                            Built specifically for dairy milk distributors — every feature was designed around how you actually run your business.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Bell, title: "Live Order Board", desc: "Every order appears instantly. Accept, prepare, and dispatch without switching screens.", num: "01" },
                            { icon: Truck, title: "Rider Dispatch", desc: "Assign orders to your riders in seconds. Track delivery confirmations in real time.", num: "02" },
                            { icon: BarChart2, title: "Revenue Analytics", desc: "Daily revenue, bestsellers, and order trends. No spreadsheets required.", num: "03" },
                            { icon: CreditCard, title: "Payments & Payouts", desc: "Razorpay integration, wallet top-ups, and instant bank settlement.", num: "04" },
                            { icon: ClipboardList, title: "Inventory Control", desc: "Set stock limits per product. Auto-pause orders when you run low.", num: "05" },
                            { icon: Users, title: "Customer Insights", desc: "See your repeat customers, top spenders, and delivery zones at a glance.", num: "06" },
                        ].map(f => (
                            <div key={f.title} className="p-6 rounded-2xl" style={{ border: "1px solid #E2E8F0" }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
                                        <f.icon size={18} className="text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-primary">{f.num}</span>
                                </div>
                                <h3 className="text-sm font-bold mb-2 text-text-title">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Join */}
            <section style={{ background: "#F8FAFF", padding: "80px 0" }}>
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-extrabold mb-3 text-text-title">Get verified in 24 hours</h2>
                        <p className="text-sm text-text-muted">No technical setup. No hardware. Just register and start.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { step: "1", title: "Register your shop", desc: "Enter your store name, address, and FSSAI number. We verify you within 24 hours." },
                            { step: "2", title: "Add your products", desc: "List your milk products with prices and stock limits so you never oversell." },
                            { step: "3", title: "Accept orders", desc: "Your dashboard goes live. Customers order, you dispatch, riders deliver — end to end." },
                        ].map(item => (
                            <div key={item.step} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: "linear-gradient(135deg, #D97706, #D97706)" }}>
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold mb-2 text-text-title">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-2xl font-extrabold mb-8 text-center text-text-title">What you need to join</h2>
                    <div className="space-y-3">
                        {[
                            "Valid FSSAI license for water packaging/delivery",
                            "Active bank account for payment settlement",
                            "At least one delivery rider (or self-delivery)",
                            "Smartphone with internet access",
                            "Minimum 10L and 20L fresh milk daily stock",
                        ].map(req => (
                            <div key={req} className="flex items-center gap-3 p-4 rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
                                <CheckCircle size={16} style={{ color: "#059669", flexShrink: 0 }} />
                                <span className="text-sm text-gray-700">{req}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)", padding: "64px 0" }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Ready to modernise your water business?</h2>
                    <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Join dairy vendor shops already running on Milkdi.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/register" className="bg-white text-sm font-bold px-7 py-3 rounded-full text-primary">
                            Register Your Shop
                        </Link>
                        <Link href="/contact" className="text-sm font-semibold px-7 py-3 rounded-full"
                            style={{ border: "1.5px solid rgba(255,255,255,0.5)", color: "white" }}>
                            Talk to Us
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
