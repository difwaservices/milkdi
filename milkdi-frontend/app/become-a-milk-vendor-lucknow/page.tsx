"use client"

import { useState } from "react"
import Link from "next/link"
import {
    CheckCircle, ArrowRight, Droplets, Phone, Star, MapPin,
    BarChart2, CreditCard, Users, Bell, Truck, Shield, TrendingUp,
} from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

const PRICE_PER_CAN = 45
const MARGIN_PER_CAN = 18

const benefits = [
    { icon: Bell, title: "Live Order Dashboard", desc: "हर नया order instantly notification आता है। Accept करो, dispatch करो — एक screen पर।" },
    { icon: CreditCard, title: "Instant Payouts", desc: "Razorpay से direct bank settlement। कोई delay नहीं, कोई manual process नहीं।" },
    { icon: Truck, title: "Rider Management", desc: "अपने delivery boys को app से assign करो। Real-time tracking मिलेगी।" },
    { icon: BarChart2, title: "Revenue Analytics", desc: "Daily earnings, top products, best customers — सब एक dashboard पर।" },
    { icon: Shield, title: "Free Listing", desc: "Registration और listing पर कोई fee नहीं। हम commission per order लेते हैं।" },
    { icon: Users, title: "Customer Base", desc: "Milkdi के existing customers आपके products देखेंगे। Marketing आप नहीं, हम करते हैं।" },
]

const steps = [
    {
        num: "01",
        title: "Register करें",
        desc: "www.milkdi.com/register पर जाएं। Shop name, address और FSSAI number डालें। 5 मिनट का काम है।",
    },
    {
        num: "02",
        title: "Verification",
        desc: "हमारी team 24 घंटे में documents verify करेगी। आपको call या email आएगा।",
    },
    {
        num: "03",
        title: "Products add करें",
        desc: "अपने 10L और fresh milks की listing करें — price, stock limit और delivery area set करें।",
    },
    {
        num: "04",
        title: "Orders accept करें",
        desc: "Dashboard live हो जाएगा। Customer order करेगा — आपको notification आएगा। Dispatch करो, done।",
    },
]

const requirements = [
    "RO dairy farm या trusted water supplier",
    "FSSAI license (water packaging/distribution)",
    "Smartphone with internet connection",
    "कम से कम 1 delivery rider (or self-delivery)",
    "20L और 10L milk inventory",
    "Active bank account for payouts",
]

const testimonials = [
    {
        name: "Rajesh Gupta",
        area: "Indira Nagar, Lucknow",
        since: "6 months",
        orders: "40–50 orders/day",
        quote: "Pehle sirf WhatsApp pe orders lene padte the, kaafi chhoot jaate the. Milkdi pe aane ke baad ek bhi order miss nahi hua. Ab mere paas 3 riders hain.",
        income: "₹28,000/month",
    },
    {
        name: "Sunita Verma",
        area: "Gomti Nagar, Lucknow",
        since: "4 months",
        orders: "25–30 orders/day",
        quote: "Main akele apna shop chalati hoon. Milkdi ka dashboard bahut simple hai — mera beta bhi easily use kar leta hai. Payment automatically aa jaati hai account mein.",
        income: "₹18,000/month",
    },
    {
        name: "Mohammad Imran",
        area: "Mahanagar, Lucknow",
        since: "8 months",
        orders: "60+ orders/day",
        quote: "Pehle sirf 15 orders the per day. Milkdi app pe listing ke baad 2 mahine mein 60 tak pahunch gaya. Aab ek aur van lene ka plan hai.",
        income: "₹42,000/month",
    },
]

const faqs = [
    {
        q: "Registration fee कितनी है?",
        a: "Registration बिल्कुल free है। हम सिर्फ per-order commission लेते हैं जो delivery पूरी होने के बाद automatically settle होती है।",
    },
    {
        q: "मेरे पास FSSAI license नहीं है — क्या मैं join कर सकता हूँ?",
        a: "FSSAI license जरूरी है क्योंकि यह food safety requirement है। आप FSSAI की website से 7–10 दिन में license बनवा सकते हैं। उसके बाद apply करें।",
    },
    {
        q: "Delivery area कैसे set होता है?",
        a: "Registration के बाद आप dashboard में अपना service radius set करते हैं — जैसे 3km, 5km या specific areas। उस range में आने वाले customers को आपकी listing दिखेगी।",
    },
    {
        q: "Commission कितनी लेते हैं Milkdi?",
        a: "Per order commission structure registration के बाद onboarding call में discuss होता है। यह order value का एक fixed percentage होता है जो delivery complete होने पर settle होती है।",
    },
    {
        q: "मैं Lucknow के बाहर हूँ — क्या join कर सकता हूँ?",
        a: "अभी Milkdi Lucknow में active है। लेकिन आप दूसरे शहरों से भी registration कर सकते हैं — जब हम आपके शहर में launch करेंगे तो आप automatically activated होंगे।",
    },
]

export default function BecomeVendorPage() {
    const [ordersPerDay, setOrdersPerDay] = useState(30)
    const monthlyOrders = ordersPerDay * 26
    const grossRevenue = monthlyOrders * PRICE_PER_CAN
    const netIncome = monthlyOrders * MARGIN_PER_CAN

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav orderLabel="Register as Vendor" />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(160deg, #dff6ff 0%, #b8e9fa 45%, #f0f9ff 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                                style={{ background: "rgba(29,78,216,0.08)", color: "#D97706", border: "1px solid rgba(29,78,216,0.15)" }}>
                                <TrendingUp size={12} /> Dairy Vendor Program — Lucknow
                            </div>
                            <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(26px,3.5vw,46px)", color: "#0F172A" }}>
                                दूध बेचो,<br />
                                <span className="text-primary">₹15,000–₹50,000</span><br />
                                महीना कमाओ
                            </h1>
                            <p className="text-sm leading-relaxed mb-8 text-text-body">
                                Milkdi पर register करें। अपना milk delivery business digitize करें। हर order का payment automatic — कोई झंझट नहीं।
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/register"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl bg-primary">
                                    Register Your Shop <ArrowRight size={15} />
                                </Link>
                                <a href="tel:+919455791624"
                                    className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl"
                                    style={{ border: "1.5px solid #FDE68A", color: "#D97706", background: "white" }}>
                                    <Phone size={14} /> बात करें
                                </a>
                            </div>
                        </div>

                        {/* Stats card */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: "200+", label: "Active Vendors", icon: Users },
                                { value: "₹0", label: "Registration Fee", icon: CreditCard },
                                { value: "24h", label: "Verification Time", icon: CheckCircle },
                                { value: "4.8★", label: "Vendor Satisfaction", icon: Star },
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

            {/* Earnings Calculator */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        अपनी कमाई calculate करें
                    </h2>
                    <p className="text-sm mb-8 text-text-muted">
                        रोज़ कितने orders deliver कर सकते हो? Slide करके देखो महीने में कितना बनेगा।
                    </p>

                    <div className="bg-white rounded-xl p-6 md:p-8" style={{ border: "1.5px solid #FDE68A", boxShadow: "0 4px 24px rgba(29,78,216,0.06)" }}>
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-text-title">
                                    Orders per day
                                </label>
                                <span className="text-2xl font-extrabold text-primary">{ordersPerDay}</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={100}
                                step={5}
                                value={ordersPerDay}
                                onChange={e => setOrdersPerDay(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                style={{ accentColor: "#D97706", background: `linear-gradient(to right, #D97706 ${(ordersPerDay - 5) / 0.95}%, #E2E8F0 ${(ordersPerDay - 5) / 0.95}%)` }}
                            />
                            <div className="flex justify-between text-xs mt-1 text-text-muted-light">
                                <span>5/day</span>
                                <span>100/day</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
                            <div className="text-center">
                                <p className="text-xs font-medium mb-1 text-text-muted">Monthly Orders</p>
                                <p className="text-xl font-bold text-text-title">{monthlyOrders.toLocaleString("en-IN")}</p>
                                <p className="text-xs text-text-muted-light">26 working days</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-medium mb-1 text-text-muted">Gross Revenue</p>
                                <p className="text-xl font-bold text-text-title">₹{grossRevenue.toLocaleString("en-IN")}</p>
                                <p className="text-xs text-text-muted-light">@₹{PRICE_PER_CAN}/can avg</p>
                            </div>
                            <div className="text-center rounded-xl p-3 bg-primary-soft">
                                <p className="text-xs font-medium mb-1 text-primary">Net Income Est.</p>
                                <p className="text-xl font-bold text-primary">₹{netIncome.toLocaleString("en-IN")}</p>
                                <p className="text-xs" style={{ color: "#3B82F6" }}>after costs</p>
                            </div>
                        </div>

                        <p className="text-xs mt-4 text-text-muted-light">
                            * Estimate based on ₹{MARGIN_PER_CAN} net margin per 20L can after supplier cost. Actual income depends on your pricing and area.
                        </p>
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        क्या चाहिए join करने के लिए?
                    </h2>
                    <p className="text-sm mb-8 text-text-muted">
                        Simple checklist — अगर यह सब है तो आप ready हैं।
                    </p>
                    <div className="space-y-3">
                        {requirements.map(req => (
                            <div key={req} className="flex items-center gap-3 p-4 rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
                                <CheckCircle size={16} style={{ color: "#059669", flexShrink: 0 }} />
                                <span className="text-sm text-gray-700">{req}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: "#C2410C" }}>FSSAI license नहीं है?</p>
                        <p className="text-sm" style={{ color: "#9A3412" }}>
                            fssai.gov.in पर 7–10 दिन में online apply कर सकते हैं। उसके बाद Milkdi पर register करें — हम पूरे process में help करेंगे।
                        </p>
                    </div>
                </div>
            </section>

            {/* How to Register */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold mb-2 text-text-title">
                            4 steps में शुरू करें
                        </h2>
                        <p className="text-sm text-text-muted">
                            Register से first order तक — 24 घंटे से कम
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {steps.map(s => (
                            <div key={s.num} className="bg-white rounded-xl p-6 flex gap-4" style={{ border: "1px solid #E2E8F0" }}>
                                <div className="w-10 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center shrink-0"
                                    style={{ background: "linear-gradient(135deg, #D97706, #D97706)" }}>
                                    {s.num}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-1.5 text-text-title">{s.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/register"
                            className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-3.5 rounded-xl bg-primary">
                            अभी Register करें <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        Milkdi पर क्यों आएं?
                    </h2>
                    <p className="text-sm mb-10 text-text-muted">
                        एक platform जो आपके business को seriously लेता है
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {benefits.map(b => (
                            <div key={b.title} className="rounded-xl border p-6 flex gap-4" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary-soft">
                                    <b.icon size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-1.5 text-text-title">{b.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        Vendors की बात, उन्हीं की ज़ुबानी
                    </h2>
                    <p className="text-sm mb-10 text-text-muted">
                        Lucknow के dairy vendors जो Milkdi से अपना business चला रहे हैं
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {testimonials.map(t => (
                            <div key={t.name} className="bg-white rounded-xl p-6" style={{ border: "1px solid #E2E8F0" }}>
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                        style={{ background: "linear-gradient(135deg, #D97706, #D97706)" }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-text-title">{t.name}</p>
                                        <p className="text-xs flex items-center gap-1 text-text-muted">
                                            <MapPin size={10} /> {t.area}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed mb-4" style={{ color: "#475569" }}>
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                                    <div>
                                        <p className="text-xs text-text-muted-light">{t.orders}</p>
                                        <p className="text-xs text-text-muted-light">Since {t.since}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-text-muted">Monthly Income</p>
                                        <p className="text-base font-bold text-primary">{t.income}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">FAQs</h2>
                    <p className="text-sm mb-8 text-text-muted">Vendor registration — common questions</p>
                    <div className="space-y-4">
                        {faqs.map((f, i) => (
                            <div key={i} className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
                                <h3 className="font-semibold text-sm mb-2 text-text-title">{f.q}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 px-6 bg-primary">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-bold text-white mb-3">
                        अपना water business Milkdi पर लाएं
                    </h2>
                    <p className="text-sm text-white/70 mb-6">
                        Free registration। 24h verification। पहले order से पहला payment।
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/register"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                            style={{ background: "white", color: "#D97706" }}>
                            <Droplets size={15} /> Register Your Shop
                        </Link>
                        <a href="tel:+919455791624"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10">
                            <Phone size={15} /> +91 94557 91624
                        </a>
                    </div>
                    <p className="mt-5 text-xs text-white/50">
                        User हैं?{" "}
                        <Link href="/milk-delivery-lucknow" className="text-white/80 underline">
                            Lucknow में order करें →
                        </Link>
                    </p>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
