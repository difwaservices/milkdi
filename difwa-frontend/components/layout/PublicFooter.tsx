"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
    Company: [
        { label: "About Us", href: "/about" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Our Products", href: "/products" },
        { label: "Contact Us", href: "/contact" },
    ],
    Vendors: [
        { label: "For Vendors", href: "/vendors" },
        { label: "Register Shop", href: "/register" },
        { label: "Vendor Login", href: "/login" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-services" },
        { label: "Refund Policy", href: "/terms-of-services#payments" },
    ],
}

export default function PublicFooter() {
    return (
        <footer className="bg-text-title">
            <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/milkdi-icon.svg" alt="Milkdi logo" className="w-9 h-9" />
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-white text-xl">MILKDI</span>
                                <span className="text-[10px] font-semibold tracking-wide mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Pure Milk. Daily Fresh.</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                            100% pure cow and buffalo milk delivered fresh daily from trusted local dairy farms.
                        </p>
                        <div className="space-y-2">
                            {[
                                { icon: Mail, text: "milkdiservices@gmail.com" },
                                { icon: Phone, text: "+91 94557 91624" },
                                { icon: MapPin, text: "Vibhav Khand, Lucknow" },
                            ].map(c => (
                                <div key={c.text} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                                    <c.icon size={12} />
                                    {c.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link groups */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                                {group}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map(l => (
                                    <li key={l.href}>
                                        <Link href={l.href}
                                            className="text-sm transition-colors"
                                            style={{ color: "rgba(255,255,255,0.5)" }}
                                            onMouseEnter={e => e.currentTarget.style.color = "white"}
                                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>© 2026 DIFMO PRIVATE LIMITED. All rights reserved.</span>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                        <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.25)" }}
                            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                            Privacy
                        </Link>
                        <Link href="/terms-of-services" style={{ color: "rgba(255,255,255,0.25)" }}
                            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
