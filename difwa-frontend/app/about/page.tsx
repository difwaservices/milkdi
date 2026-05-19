import type { Metadata } from "next"
import Link from "next/link"
import { Users, Shield, Truck, Heart, Globe, Star } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Milkdi's mission to make safe, clean drinking water accessible for every household in India while empowering local milk delivery vendors.",
    alternates: { canonical: "https://www.milkdi.com/about" },
    openGraph: {
        title: "About Milkdi | Our Mission & Story",
        description: "Learn how Milkdi is bridging the gap between trusted dairy vendors and households that need reliable delivery across India.",
        url: "https://www.milkdi.com/about",
    },
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #b8e9fa 50%, #f0f9ff 100%)" }}>
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">

                    <h1 className="font-extrabold mb-5 leading-tight" style={{ fontSize: "clamp(32px,4vw,56px)", color: "#0F172A" }}>
                        Bringing Pure Milk to <span className="text-primary">Every Doorstep</span>
                    </h1>
                    <p className="text-base leading-relaxed max-w-2xl mx-auto text-text-body">
                        Milkdi was founded with a single mission — making safe, clean drinking water accessible and affordable for every household in India, while empowering local milk delivery vendors with modern technology.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 bg-primary-soft text-primary">
                                Our Mission
                            </div>
                            <h2 className="text-3xl font-extrabold mb-5 text-text-title">
                                Technology meets hydration
                            </h2>
                            <p className="text-sm leading-relaxed mb-4 text-text-muted">
                                Clean drinking water shouldn't be a luxury. Milkdi bridges the gap between trusted local dairy vendors and households that need reliable, scheduled delivery.
                            </p>
                            <p className="text-sm leading-relaxed text-text-muted">
                                We built a platform that handles everything from order placement and rider dispatch to payment settlement — giving vendors more time to focus on what they do best: delivering quality water.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Shield, title: "Quality First", desc: "Every vendor on our platform is FSSAI verified and quality checked." },
                                { icon: Heart, title: "Community Built", desc: "We partner with local businesses to strengthen communities." },
                                { icon: Truck, title: "Reliable Delivery", desc: "On-time delivery tracked end-to-end, every single order." },
                                { icon: Users, title: "Vendor Focused", desc: "Tools built specifically for milk delivery shop owners." },
                            ].map(card => (
                                <div key={card.title} className="p-5 rounded-2xl" style={{ border: "1px solid #E2E8F0" }}>
                                    <card.icon size={20} style={{ color: "#D97706", marginBottom: "10px" }} />
                                    <h3 className="text-sm font-bold mb-1 text-text-title">{card.title}</h3>
                                    <p className="text-xs leading-relaxed text-text-muted">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ background: "#F8FAFF", padding: "64px 0" }}>
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "50K+", label: "Happy Customers" },
                            { value: "200+", label: "Trusted Vendors" },
                            { value: "1M+", label: "Orders Delivered" },
                            { value: "4.8★", label: "Average Rating" },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-4xl font-extrabold mb-1 text-primary">{s.value}</p>
                                <p className="text-sm font-medium text-text-muted">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold mb-3 text-text-title">What we stand for</h2>
                    <p className="text-sm mb-12 text-text-muted">Our values guide every decision we make.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { icon: Globe, title: "Accessibility", desc: "Clean water for everyone, regardless of location or income." },
                            { icon: Star, title: "Excellence", desc: "We hold our vendors and ourselves to the highest standards." },
                            { icon: Heart, title: "Impact", desc: "Every order supports a local family-run water business." },
                        ].map(v => (
                            <div key={v.title} className="p-8 rounded-2xl text-center" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
                                    <v.icon size={22} className="text-primary" />
                                </div>
                                <h3 className="text-sm font-bold mb-2 text-text-title">{v.title}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)", padding: "64px 0" }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Join the Milkdi family</h2>
                    <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Whether you're a customer or a vendor, we'd love to have you.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/register" className="bg-white text-sm font-bold px-7 py-3 rounded-full text-primary">
                            Get Started
                        </Link>
                        <Link href="/contact" className="text-sm font-semibold px-7 py-3 rounded-full"
                            style={{ border: "1.5px solid rgba(255,255,255,0.5)", color: "white" }}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
