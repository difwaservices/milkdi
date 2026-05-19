"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, ArrowRight } from "lucide-react"

export const NAV_LINKS = [
    { label: "Home",        href: "/" },
    { label: "How It Works",href: "/how-it-works" },
    { label: "Products",    href: "/products" },
    { label: "For Vendors", href: "/vendors" },
    { label: "About",       href: "/about" },
    { label: "Contact",     href: "/contact" },
]

export default function PublicNav({ orderLabel = "Download App" }: { orderLabel?: string }) {
    const pathname    = usePathname()
    const [scrolled, setScrolled]     = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <nav className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-[0_1px_0_0_#EBEBEB]" : "border-b border-border"}`}>
            <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-between gap-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C9 2 5 4 5 9v10a2 2 0 002 2h10a2 2 0 002-2V9c0-5-4-7-7-7z" fill="white" opacity=".9"/>
                            <ellipse cx="12" cy="9" rx="4" ry="2" fill="white" opacity=".5"/>
                        </svg>
                    </div>
                    <span className="text-[17px] font-bold tracking-tight text-text-title group-hover:text-primary transition-colors">
                        Milkdi
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden lg:flex items-center gap-1 flex-1">
                    {NAV_LINKS.map(item => {
                        const active = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                                    active
                                        ? "text-primary bg-primary-soft"
                                        : "text-text-muted hover:text-text-title hover:bg-background"
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="hidden lg:inline-flex text-sm font-medium text-text-muted hover:text-text-title transition-colors px-3 py-2"
                    >
                        Sign in
                    </Link>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                        target="_blank" rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        {orderLabel}
                        <ArrowRight size={13} />
                    </a>
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="lg:hidden p-2 rounded-md text-text-muted hover:bg-background transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-border bg-white px-6 py-4 space-y-1">
                    {NAV_LINKS.map(item => {
                        const active = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                    active ? "text-primary bg-primary-soft" : "text-text-body hover:bg-background"
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                    <div className="pt-2 border-t border-border mt-2 flex flex-col gap-2">
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2.5 text-sm font-medium text-text-muted hover:text-text-title transition-colors"
                        >
                            Sign in
                        </Link>
                        <a
                            href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                        >
                            Download App
                            <ArrowRight size={13} />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}
