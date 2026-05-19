"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Globe, Menu, X } from "lucide-react"

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Our Products", href: "/products" },
    { label: "For Vendors", href: "/vendors" },
    { label: "Contact Us", href: "/contact" },
]

export default function PublicNav({ orderLabel = "Order Now" }: { orderLabel?: string }) {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8)
        window.addEventListener("scroll", fn)
        return () => window.removeEventListener("scroll", fn)
    }, [])

    return (
        <nav
            className="fixed top-0 inset-x-0 z-50 transition-all"
            style={{
                background: scrolled || mobileOpen ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                borderBottom: scrolled || mobileOpen ? "1px solid rgba(0,0,0,0.07)" : "none"
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <img src="/milkdi-icon.svg" alt="Milkdi logo" className="w-8 h-8" />
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-bold text-text-title">MILKDI</span>
                        <span className="text-xs font-semibold tracking-wide mt-0.5 text-primary">Pure Milk. Daily Fresh.</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map(item => (
                        <Link key={item.href} href={item.href}
                            className="text-base font-medium transition-colors"
                            style={{ color: pathname === item.href ? "#D97706" : "#374151" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#D97706"}
                            onMouseLeave={e => e.currentTarget.style.color = pathname === item.href ? "#D97706" : "#374151"}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">

                    <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                        target="_blank" rel="noopener noreferrer"
                        className="px-5 py-2.5 text-sm font-bold text-white rounded-full bg-primary">
                        {orderLabel}
                    </a>
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="lg:hidden p-2 rounded-lg text-gray-700">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="lg:hidden px-6 pb-5 space-y-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    {NAV_LINKS.map(item => (
                        <Link key={item.href} href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2.5 text-sm font-medium"
                            style={{ color: pathname === item.href ? "#D97706" : "#374151" }}>
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    )
}
