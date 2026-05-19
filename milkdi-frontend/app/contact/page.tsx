import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Milkdi team. We're here to help with orders, vendor partnerships, billing questions, or any feedback you have.",
    alternates: { canonical: "https://www.milkdi.com/contact" },
    openGraph: {
        title: "Contact Us | Milkdi",
        description: "Reach our team via email, phone, or the contact form. We reply within a few hours.",
        url: "https://www.milkdi.com/contact",
    },
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #b8e9fa 50%, #f0f9ff 100%)" }}>
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <h1 className="font-extrabold mb-5 leading-tight" style={{ fontSize: "clamp(32px,4vw,56px)", color: "#0F172A" }}>
                        We'd love  <span className="text-primary">to hear from you</span>
                    </h1>
                    <p className="text-base leading-relaxed max-w-2xl mx-auto text-text-body">
                        Have a question, feedback, or want to partner with us? Our team is here and ready to help.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-extrabold mb-8 text-text-title">Contact information</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: Mail, title: "Email us", value: "milkdiservices@gmail.com", sub: "We reply within a few hours" },
                                    { icon: Phone, title: "Call us", value: "+91 94557 91624", sub: "Mon–Sat, 9 AM – 7 PM IST" },
                                    { icon: MapPin, title: "Our office", value: "4/37 Vibhav Khand, Gomti Nagar", sub: "Lucknow, UP — 226010" },
                                    { icon: Clock, title: "Support hours", value: "24 / 7 via chat", sub: "In-app chat always available" },
                                ].map(c => (
                                    <div key={c.title} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
                                            <c.icon size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold mb-0.5 text-text-muted">{c.title}</p>
                                            <p className="text-sm font-bold text-text-title">{c.value}</p>
                                            <p className="text-xs text-text-muted-light">{c.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 p-6 rounded-2xl" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                                <h3 className="text-sm font-bold mb-2 text-text-title">Looking to become a vendor?</h3>
                                <p className="text-sm leading-relaxed mb-4 text-text-muted">
                                    Head to our vendor registration page — it only takes a few minutes and our team verifies you within 24 hours.
                                </p>
                                <Link href="/vendors" className="text-sm font-bold text-primary">
                                    Learn about vendor registration →
                                </Link>
                            </div>
                        </div>

                        {/* Form — client component */}
                        <div>
                            <h2 className="text-2xl font-extrabold mb-8 text-text-title">Send us a message</h2>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)", padding: "64px 0" }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Need water delivered now?</h2>
                    <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Place an order in under 2 minutes.</p>
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
