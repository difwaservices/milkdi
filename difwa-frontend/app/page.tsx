"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"
import { ShoppingCart, Truck, Shield, Headphones, Star, Users, ClipboardList } from "lucide-react"

export default function LandingPage() {
    const router = useRouter()

    useEffect(() => {
        const role = typeof window !== "undefined" ? localStorage.getItem("role") : null
        if (role === "retailer") { router.replace("/retailer/dashboard"); return }
        if (role === "admin") { router.replace("/admin/dashboard"); return }
    }, [router])

    return (
        <div className="min-h-screen" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>

            <PublicNav />

            {/* Hero */}
            <section
                className="relative overflow-hidden pt-[68px]"
                style={{
                    background: "#ffffff",
                    minHeight: "680px"
                }}
            >
                {/* Background imagery — cow + milk scene */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

                    {/* Soft green wash */}
                    <div className="absolute inset-0"
                        style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 55%, #f0fdf4 100%)" }} />

                    {/* Large milk splash silhouette — top right */}
                    <svg className="absolute -top-10 -right-16 opacity-[0.10]" width="520" height="520" viewBox="0 0 300 300" fill="none">
                        <ellipse cx="150" cy="220" rx="110" ry="60" fill="#15803D" />
                        <path d="M90 220 Q80 140 120 80 Q140 40 150 20 Q160 40 180 80 Q220 140 210 220 Z" fill="#15803D" />
                        <circle cx="90" cy="190" r="28" fill="#15803D" />
                        <circle cx="210" cy="190" r="22" fill="#15803D" />
                        <circle cx="60" cy="150" r="16" fill="#15803D" />
                        <circle cx="240" cy="160" r="12" fill="#15803D" />
                    </svg>

                    {/* Cow silhouette — bottom right, large, very faint */}
                    <svg className="absolute bottom-0 right-0 opacity-[0.07]" width="560" height="340" viewBox="0 0 560 340" fill="none">
                        {/* Body */}
                        <ellipse cx="300" cy="230" rx="160" ry="80" fill="#14532D" />
                        {/* Head */}
                        <ellipse cx="460" cy="185" rx="55" ry="45" fill="#14532D" />
                        {/* Snout */}
                        <ellipse cx="500" cy="198" rx="22" ry="15" fill="#14532D" />
                        {/* Ear */}
                        <ellipse cx="445" cy="148" rx="12" ry="20" fill="#14532D" transform="rotate(-20 445 148)" />
                        {/* Horn */}
                        <path d="M455 148 Q448 120 460 108" stroke="#14532D" strokeWidth="8" strokeLinecap="round" />
                        {/* Front legs */}
                        <rect x="200" y="300" width="28" height="70" rx="10" fill="#14532D" />
                        <rect x="255" y="300" width="28" height="70" rx="10" fill="#14532D" />
                        {/* Back legs */}
                        <rect x="350" y="300" width="28" height="70" rx="10" fill="#14532D" />
                        <rect x="400" y="300" width="28" height="70" rx="10" fill="#14532D" />
                        {/* Tail */}
                        <path d="M148 220 Q110 210 108 250 Q106 270 120 278" stroke="#14532D" strokeWidth="10" strokeLinecap="round" fill="none" />
                        {/* Spots */}
                        <ellipse cx="270" cy="210" rx="30" ry="22" fill="#bbf7d0" opacity="0.4" />
                        <ellipse cx="340" cy="240" rx="20" ry="15" fill="#bbf7d0" opacity="0.4" />
                        {/* Udder */}
                        <ellipse cx="280" cy="300" rx="38" ry="20" fill="#14532D" opacity="0.7" />
                    </svg>

                    {/* Floating milk drops — left side */}
                    <svg className="absolute top-24 left-4 opacity-[0.12]" width="120" height="200" viewBox="0 0 120 200" fill="none">
                        <path d="M60 10 Q80 60 80 100 Q80 140 60 155 Q40 140 40 100 Q40 60 60 10Z" fill="#15803D" />
                        <circle cx="28" cy="60" r="14" fill="#15803D" />
                        <circle cx="18" cy="120" r="9" fill="#15803D" />
                    </svg>

                    {/* Leaf/grass strip at bottom */}
                    <svg className="absolute bottom-0 left-0 right-0 opacity-[0.13]" width="100%" height="90" viewBox="0 0 1440 90" preserveAspectRatio="none" fill="none">
                        <path d="M0 90 Q80 30 160 70 Q240 110 320 50 Q400 0 480 60 Q560 110 640 45 Q720 0 800 65 Q880 110 960 50 Q1040 0 1120 60 Q1200 110 1280 40 Q1360 0 1440 60 L1440 90Z" fill="#15803D" />
                    </svg>

                    {/* Small leaf accents — scattered */}
                    <svg className="absolute top-32 right-[42%] opacity-20" width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <path d="M18 2 Q30 10 28 24 Q18 34 8 22 Q6 10 18 2Z" fill="#15803D" />
                    </svg>
                    <svg className="absolute top-52 right-[38%] opacity-15" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="11" r="11" fill="#bbf7d0" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-8 relative z-10">

                    {/* Left text */}
                    <div className="flex-1 max-w-[560px]">

                        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                            style={{ background: "#dcfce7", color: "#15803D" }}>
                            🥛 Delivered before 7 AM, every day
                        </div>

                        <h1 className="font-extrabold leading-[1.06] mb-5" style={{ fontSize: "clamp(38px,4.8vw,68px)" }}>
                            <span className="text-text-title">From the farm.</span><br />
                            <span className="text-primary">Into your glass.</span>
                        </h1>

                        <p className="text-base mb-8 leading-relaxed" style={{ color: "#334155", maxWidth: "440px" }}>
                            Skip the carton. Get real cow and buffalo milk straight from verified local farms — no packets, no powders, just milk the way it should taste.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-10">
                            <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl shadow-md transition-all"
                                style={{ background: "#15803D" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#14532D"}
                                onMouseLeave={e => e.currentTarget.style.background = "#15803D"}>
                                <ShoppingCart size={15} />
                                Order Now
                            </a>

                            <Link href="/login"
                                className="flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
                                style={{ background: "rgba(255,255,255,0.9)", color: "#15803D", border: "1.5px solid #86efac" }}
                                onMouseEnter={e => e.currentTarget.style.background = "white"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}>
                                Register your shop
                            </Link>
                        </div>

                        {/* Feature badges */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {[
                                { icon: Shield, label: "Farms, not factories", sub: "Cow & Buffalo Milk" },
                                { icon: Truck, label: "Before 7 AM", sub: "While it's still cold" },
                                { icon: Users, label: "Verified Dairies", sub: "Checked, not just listed" },
                                { icon: Headphones, label: "Real support", sub: "A person, not a bot" },
                            ].map(f => (
                                <div key={f.label} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid #bbf7d0" }}>
                                        <f.icon size={17} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold leading-tight text-text-title">{f.label}</p>
                                        <p className="text-xs text-text-muted">{f.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — hero visual */}
                    <div className="flex-1 flex justify-center lg:justify-end items-end relative" style={{ minHeight: "380px" }}>
                        {/* Glowing circle behind */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[320px] h-[320px] rounded-full"
                                style={{ background: "radial-gradient(circle, rgba(134,239,172,0.35) 0%, transparent 70%)" }} />
                        </div>
                        {/* Decorative milk glass SVG */}
                        <div className="relative flex flex-col items-center">
                            <svg width="260" height="340" viewBox="0 0 260 340" fill="none" className="drop-shadow-xl opacity-90">
                                {/* Glass body */}
                                <path d="M55 80 L30 290 Q30 310 55 310 L205 310 Q230 310 230 290 L205 80 Z" fill="white" stroke="#bbf7d0" strokeWidth="3" />
                                {/* Milk fill */}
                                <path d="M65 150 L45 290 Q45 305 65 305 L195 305 Q215 305 215 290 L195 150 Z" fill="#f0fdf4" />
                                {/* Milk surface ripple */}
                                <ellipse cx="130" cy="150" rx="65" ry="14" fill="white" />
                                <path d="M75 150 Q100 138 130 150 Q160 162 185 150" stroke="#86efac" strokeWidth="2" fill="none" />
                                {/* Glass rim */}
                                <ellipse cx="130" cy="80" rx="75" ry="18" fill="white" stroke="#86efac" strokeWidth="2.5" />
                                {/* Shine */}
                                <path d="M75 120 Q78 190 72 250" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                                {/* Milk splash above glass */}
                                <path d="M130 62 Q118 20 108 8 Q118 30 100 18 Q122 40 110 55" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
                                <path d="M130 62 Q142 18 152 5 Q142 28 160 16 Q138 38 150 55" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
                                <circle cx="108" cy="8" r="5" fill="#15803D" opacity="0.4" />
                                <circle cx="152" cy="5" r="4" fill="#15803D" opacity="0.4" />
                                <circle cx="90" cy="35" r="3" fill="#15803D" opacity="0.3" />
                                <circle cx="170" cy="30" r="3" fill="#15803D" opacity="0.3" />
                            </svg>

                            {/* Cow tag floating */}
                            <div className="absolute top-10 -right-6 bg-white rounded-2xl shadow-lg px-4 py-2.5 text-center"
                                style={{ border: "1px solid #bbf7d0" }}>
                                <p className="text-xs font-bold text-text-title">🐄 100% Fresh</p>
                                <p className="text-[10px] text-text-muted">Straight from the farm</p>
                            </div>

                            {/* Delivery badge floating */}
                            <div className="absolute bottom-16 -left-8 bg-white rounded-2xl shadow-lg px-4 py-2.5"
                                style={{ border: "1px solid #bbf7d0" }}>
                                <p className="text-xs font-bold text-primary">🚴 On the way</p>
                                <p className="text-[10px] text-text-muted">Arrives by 6:30 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 pb-0">
                    <div className="rounded-2xl shadow-xl overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", border: "1px solid #bbf7d0" }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                            {[
                                { icon: Users, value: "50K+", label: "Happy Customers" },
                                { icon: ClipboardList, value: "200+", label: "Trusted Dairies" },
                                { icon: Truck, value: "1M+", label: "Deliveries Done" },
                                { icon: Star, value: "4.8★", label: "Customer Rating" },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-3 px-6 py-5">
                                    <s.icon size={28} className="text-primary flex-shrink-0" />
                                    <div>
                                        <p className="text-xl font-extrabold text-primary">{s.value}</p>
                                        <p className="text-xs font-medium text-text-muted">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-8" />
            </section>

            {/* Features */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 bg-primary-soft text-primary">
                            For Dairy Vendors & Retailers
                        </div>
                        <h2 className="text-3xl font-extrabold mb-3 text-text-title">Run your dairy like clockwork</h2>
                        <p className="text-base max-w-xl mx-auto text-text-muted">
                            Built for milk distributors who have zero time to waste — handle orders, riders, stock, and payments without lifting a phone twice.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { title: "Live order board", desc: "Every milk order appears instantly. Accept, prepare, and dispatch without switching screens.", num: "01" },
                            { title: "Rider dispatch", desc: "Assign morning deliveries to your riders in seconds. Tracked in real time.", num: "02" },
                            { title: "Revenue analytics", desc: "Daily revenue, top-selling milk types, and subscription trends — no spreadsheets, ever.", num: "03" },
                            { title: "Payments & payouts", desc: "Razorpay integration, wallet top-ups, and same-day bank settlement.", num: "04" },
                        ].map(f => (
                            <div key={f.title}
                                className="p-6 rounded-2xl transition-all cursor-default group"
                                style={{ border: "1px solid #E2E8F0" }}
                                onMouseEnter={e => { e.currentTarget.style.border = "1px solid #86efac"; e.currentTarget.style.background = "#f0fdf4" }}
                                onMouseLeave={e => { e.currentTarget.style.border = "1px solid #E2E8F0"; e.currentTarget.style.background = "white" }}>
                                <span className="text-xs font-bold block mb-3 text-primary">{f.num}</span>
                                <h3 className="text-sm font-bold mb-2 text-text-title">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ background: "#f0fdf4", padding: "80px 0" }}>
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-extrabold mb-3 text-text-title">Up and running today</h2>
                        <p className="text-base text-text-muted">No tech setup. No hardware. Register and start taking orders before tomorrow morning.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { step: "1", title: "Register your dairy", desc: "Enter your farm name, address, and FSSAI number. Our team verifies you within 24 hours — no follow-up needed." },
                            { step: "2", title: "List your milk", desc: "Add cow milk, buffalo milk, prices, and daily stock limits. No overselling. No manual tracking." },
                            { step: "3", title: "Start your mornings right", desc: "Your dashboard goes live. Customers subscribe, you prepare, riders deliver — every morning, like clockwork." },
                        ].map(item => (
                            <div key={item.step} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: "linear-gradient(135deg, #15803D, #14532D)" }}>
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

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #15803D 0%, #14532D 100%)", padding: "64px 0" }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Your dairy deserves better tools.</h2>
                    <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Join dairies already running their mornings on Milkdi.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/register"
                            className="bg-white text-sm font-bold px-7 py-3 rounded-full transition-all text-primary"
                            onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                            onMouseLeave={e => e.currentTarget.style.background = "white"}>
                            Register your dairy
                        </Link>
                        <Link href="/login"
                            className="text-sm font-semibold px-7 py-3 rounded-full transition-all"
                            style={{ border: "1.5px solid rgba(255,255,255,0.5)", color: "white", background: "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
