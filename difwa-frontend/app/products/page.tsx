import type { Metadata } from "next"
import Link from "next/link"
import { Droplets, Shield, Star, Truck, CheckCircle } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Our Products",
    description: "Order 20L, 10L, or 5L 100% pure cow and buffalo milk delivered sealed to your door. Browse our range of pure drinking milk products.",
    keywords: ["cow/buffalo milk", "milk pouch", "small milk pack", "milk price", "milk delivery", "pure milk"],
    alternates: { canonical: "https://www.milkdi.com/products" },
    openGraph: {
        title: "Milk Products | 20L, 10L & 5L Cans | Milkdi",
        description: "Choose from 20L, 10L, or 5L fresh cow and buffalo milk. Delivered sealed from your local vendor.",
        url: "https://www.milkdi.com/products",
    },
}

const PRODUCTS = [
    {
        size: "20L",
        name: "Large Milk",
        price: "₹50 – ₹80",
        tag: "Most Popular",
        tagColor: "#D97706",
        desc: "Ideal for families and offices. Fits standard water dispensers.",
        features: ["Sealed & hygienically filled", "BPA-free food-grade jar", "Fits all standard dispensers", "Available from all vendors"],
    },
    {
        size: "10L",
        name: "Medium Milk",
        price: "₹30 – ₹50",
        tag: "Best Value",
        tagColor: "#059669",
        desc: "Perfect for small families or single-professional households.",
        features: ["Easy to carry & store", "Sealed airtight cap", "No dispenser needed", "Same-day delivery"],
    },
    {
        size: "5L",
        name: "Small Milk",
        price: "₹20 – ₹35",
        tag: "Quick Order",
        tagColor: "#B45309",
        desc: "Great for travel, events, or topping up between big deliveries.",
        features: ["Lightweight & portable", "Portable carry handle", "Ideal for outdoor use", "Instant dispatch"],
    },
]

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #b8e9fa 50%, #f0f9ff 100%)" }}>
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">

                    <h1 className="font-extrabold mb-5 leading-tight" style={{ fontSize: "clamp(32px,4vw,56px)", color: "#0F172A" }}>
                        Our <span className="text-primary">Milk Products</span>
                    </h1>
                    <p className="text-base leading-relaxed max-w-2xl mx-auto text-text-body">
                        Choose the size that fits your needs. All cans are FSSAI certified, BPA-free, and delivered sealed directly from your local vendor.
                    </p>
                </div>
            </section>

            {/* Product Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRODUCTS.map(p => (
                            <div key={p.size} className="rounded-2xl overflow-hidden flex flex-col" style={{ border: "1px solid #E2E8F0" }}>
                                <div className="p-6 text-center" style={{ background: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)" }}>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4"
                                        style={{ background: p.tagColor, color: "white" }}>
                                        <Star size={11} />
                                        {p.tag}
                                    </div>
                                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3"
                                        style={{ background: "white", border: "2px solid #FDE68A" }}>
                                        <Droplets size={36} className="text-primary" />
                                    </div>
                                    <p className="text-3xl font-extrabold text-primary">{p.size}</p>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="text-base font-bold mb-1 text-text-title">{p.name}</h2>
                                    <p className="text-xl font-extrabold mb-3 text-primary">{p.price}</p>
                                    <p className="text-sm leading-relaxed mb-5 text-text-muted">{p.desc}</p>
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {p.features.map(f => (
                                            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                                                <CheckCircle size={14} style={{ color: "#059669", flexShrink: 0 }} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                        target="_blank" rel="noopener noreferrer"
                                        className="block w-full text-center text-sm font-bold py-3 rounded-xl text-white bg-primary">
                                        Order Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Guarantee */}
            <section style={{ background: "#F8FAFF", padding: "80px 0" }}>
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold mb-3 text-text-title">Quality you can trust</h2>
                    <p className="text-sm mb-12 max-w-xl mx-auto text-text-muted">Every drop that reaches your home passes our strict quality standards.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: "FSSAI Certified", desc: "All vendors hold valid FSSAI licenses and are periodically audited." },
                            { icon: Droplets, title: "RO Purified", desc: "Water is multi-stage purified using reverse osmosis and UV filtration." },
                            { icon: Truck, title: "Sealed Delivery", desc: "Cans are sealed at the facility and never opened until they reach you." },
                        ].map(q => (
                            <div key={q.title} className="p-8 rounded-2xl bg-white text-center" style={{ border: "1px solid #E2E8F0" }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
                                    <q.icon size={22} className="text-primary" />
                                </div>
                                <h3 className="text-sm font-bold mb-2 text-text-title">{q.title}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{q.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)", padding: "64px 0" }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Order pure milk today</h2>
                    <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Delivered within hours, straight to your door.</p>
                    <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                        target="_blank" rel="noopener noreferrer"
                        className="bg-white text-sm font-bold px-7 py-3 rounded-full inline-block text-primary">
                        Get Started
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
