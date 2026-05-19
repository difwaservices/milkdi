import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingCart, Truck, CheckCircle, ClipboardList, CreditCard, Bell } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "How It Works",
    description: "Order pure drinking water in 3 simple steps. Choose your can size, pay securely, and get it delivered to your door by a verified local vendor.",
    alternates: { canonical: "https://www.milkdi.com/how-it-works" },
    openGraph: {
        title: "How It Works | Order Pure Milk in 3 Steps",
        description: "Order 20L, 10L, or 5L milks online. Pay via UPI or card and track delivery in real-time.",
        url: "https://www.milkdi.com/how-it-works",
    },
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #b8e9fa 50%, #f0f9ff 100%)" }}>
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">

                    <h1 className="font-extrabold mb-5 leading-tight" style={{ fontSize: "clamp(32px,4vw,56px)", color: "#0F172A" }}>
                        How <span className="text-primary">Milkdi</span> Works
                    </h1>
                    <p className="text-base leading-relaxed max-w-2xl mx-auto text-text-body">
                        Order safe, pure drinking water in three easy steps — from your phone or browser, delivered to your door.
                    </p>
                </div>
            </section>

            {/* Customer Flow */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 bg-primary-soft text-primary">
                            For Customers
                        </div>
                        <h2 className="text-3xl font-extrabold text-text-title">Order in 3 simple steps</h2>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5"
                            style={{ background: "linear-gradient(90deg, #D97706, #D97706)" }} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { step: "1", icon: ShoppingCart, title: "Choose your water", desc: "Browse verified vendors near you, pick your can size (20L, 10L, or 5L), and add to cart." },
                                { step: "2", icon: CreditCard, title: "Pay securely", desc: "Pay online via UPI, card, or wallet. 100% secure checkout powered by Razorpay." },
                                { step: "3", icon: Truck, title: "Get it delivered", desc: "Your order is dispatched to a rider. Track delivery in real-time and receive water at your door." },
                            ].map(item => (
                                <div key={item.step} className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                                        style={{ background: "linear-gradient(135deg, #D97706, #D97706)" }}>
                                        <item.icon size={26} color="white" />
                                    </div>
                                    <span className="text-xs font-bold mb-2 text-primary">STEP {item.step}</span>
                                    <h3 className="text-base font-bold mb-2 text-text-title">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Vendor Flow */}
            <section style={{ background: "#F8FAFF", padding: "80px 0" }}>
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 bg-primary-soft text-primary">
                            For Vendors
                        </div>
                        <h2 className="text-3xl font-extrabold text-text-title">Start taking orders today</h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { num: "01", icon: ClipboardList, title: "Register your shop", desc: "Sign up with your store name, address, and FSSAI number. Our team verifies you within 24 hours — no paperwork required." },
                            { num: "02", icon: ShoppingCart, title: "List your products", desc: "Add your milks with prices, images, and stock levels. Set daily limits so you never oversell." },
                            { num: "03", icon: Bell, title: "Receive & manage orders", desc: "New orders appear on your dashboard instantly. Accept, prepare, and assign to your delivery riders in seconds." },
                            { num: "04", icon: CheckCircle, title: "Get paid automatically", desc: "Payments settle directly to your bank account. View daily revenue, bestsellers, and trends from your analytics dashboard." },
                        ].map(item => (
                            <div key={item.num} className="flex gap-6 p-6 rounded-2xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
                                    <item.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-primary">{item.num}</span>
                                    <h3 className="text-sm font-bold mb-1 text-text-title">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold mb-10 text-center text-text-title">Common questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "How long does delivery take?", a: "Most deliveries happen within 1–3 hours of placing the order, depending on your location and vendor availability." },
                            { q: "Is the water safe to drink?", a: "Yes. All vendors on Milkdi are FSSAI certified. Water cans are sealed, tested, and handled hygienically." },
                            { q: "Can I schedule a recurring delivery?", a: "Absolutely. You can set up weekly or bi-weekly deliveries from your account dashboard." },
                            { q: "What if I'm not home?", a: "Your rider can leave the can at your door or a designated spot. You'll get a photo confirmation." },
                        ].map(item => (
                            <div key={item.q} className="p-5 rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
                                <h3 className="text-sm font-bold mb-1 text-text-title">{item.q}</h3>
                                <p className="text-sm text-text-muted">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)", padding: "64px 0" }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Ready to get started?</h2>
                    <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Order your first can in under 2 minutes.</p>
                    <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                        target="_blank" rel="noopener noreferrer"
                        className="bg-white text-sm font-bold px-7 py-3 rounded-full inline-block text-primary">
                        Order Now
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
