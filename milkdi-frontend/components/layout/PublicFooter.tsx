import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
    Product: [
        { label: "How It Works",  href: "/how-it-works" },
        { label: "Our Products",  href: "/products" },
        { label: "For Vendors",   href: "/vendors" },
        { label: "Pricing",       href: "/vendors#pricing" },
    ],
    Company: [
        { label: "About Us",   href: "/about" },
        { label: "Contact",    href: "/contact" },
        { label: "Vendor Login", href: "/login" },
        { label: "Register",   href: "/vendors" },
    ],
    Legal: [
        { label: "Privacy Policy",  href: "/privacy-policy" },
        { label: "Terms of Service",href: "/terms-of-services" },
        { label: "Refund Policy",   href: "/terms-of-services#payments" },
    ],
}

const CONTACT = [
    { icon: Mail,    text: "milkdiservices@gmail.com" },
    { icon: Phone,   text: "+91 94557 91624" },
    { icon: MapPin,  text: "Vibhav Khand, Lucknow, UP" },
]

export default function PublicFooter() {
    return (
        <footer className="bg-white border-t border-border">
            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Top row */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">

                    {/* Brand — takes 2 cols */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C9 2 5 4 5 9v10a2 2 0 002 2h10a2 2 0 002-2V9c0-5-4-7-7-7z" fill="white" opacity=".9"/>
                                    <ellipse cx="12" cy="9" rx="4" ry="2" fill="white" opacity=".5"/>
                                </svg>
                            </div>
                            <span className="text-[17px] font-bold tracking-tight text-text-title">Milkdi</span>
                        </Link>

                        <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-xs">
                            Pure cow and buffalo milk delivered fresh every morning from verified local dairy farms across India.
                        </p>

                        <div className="space-y-2.5">
                            {CONTACT.map(c => (
                                <div key={c.text} className="flex items-center gap-2.5 text-sm text-text-muted">
                                    <c.icon size={14} className="text-primary shrink-0" />
                                    {c.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link groups */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
                                {group}
                            </p>
                            <ul className="space-y-3">
                                {links.map(l => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className="text-sm text-text-body hover:text-primary transition-colors"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} DIFMO PRIVATE LIMITED. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        <Link href="/privacy-policy"    className="text-xs text-text-muted hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms-of-services" className="text-xs text-text-muted hover:text-primary transition-colors">Terms</Link>
                        <Link href="/contact"           className="text-xs text-text-muted hover:text-primary transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
