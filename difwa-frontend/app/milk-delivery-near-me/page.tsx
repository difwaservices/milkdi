"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, CheckCircle, ArrowRight, Droplets, Clock, Phone, Search } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

const ACTIVE_AREAS = [
    "lucknow", "lko", "226", "gomti nagar", "hazratganj", "indira nagar",
    "alambagh", "aliganj", "mahanagar", "aminabad", "rajajipuram", "vikas nagar",
    "vibhav khand", "viram khand", "vijay khand",
]

function checkArea(input: string): "active" | "coming_soon" | "" {
    if (!input.trim()) return ""
    const lower = input.toLowerCase()
    const isActive = ACTIVE_AREAS.some(a => lower.includes(a))
    return isActive ? "active" : "coming_soon"
}

const cities = [
    { name: "Lucknow", state: "Uttar Pradesh", status: "active", href: "/milk-delivery-lucknow" },
    { name: "Kanpur", state: "Uttar Pradesh", status: "soon", href: null },
    { name: "Agra", state: "Uttar Pradesh", status: "soon", href: null },
    { name: "Prayagraj", state: "Uttar Pradesh", status: "soon", href: null },
    { name: "Varanasi", state: "Uttar Pradesh", status: "soon", href: null },
    { name: "Noida", state: "Uttar Pradesh", status: "soon", href: null },
    { name: "Bareilly", state: "Uttar Pradesh", status: "soon", href: null },
    { name: "Aligarh", state: "Uttar Pradesh", status: "soon", href: null },
]

const faqs = [
    {
        q: "How do I find milk delivery near me?",
        a: "Download the Milkdi app, enter your address and it will automatically show you verified dairy vendors nearby. If no vendor is listed in your area, you'll see a 'coming soon' message.",
    },
    {
        q: "मेरे पास दूध डिलीवरी उपलब्ध है या नहीं — कैसे पता करूँ?",
        a: "ऊपर 'Check Your Area' बॉक्स में अपना शहर या पिन कोड लिखें। या Milkdi app download करके अपना address डालें — app खुद बता देगा।",
    },
    {
        q: "Is there a milk delivery service in Lucknow?",
        a: "Yes — Milkdi is currently active in Lucknow covering Gomti Nagar, Hazratganj, Indira Nagar, Aliganj, Mahanagar, Alambagh and more. We're expanding to new areas every month.",
    },
    {
        q: "मैं अपने शहर में Milkdi कब मिलेगा?",
        a: "हम हर महीने नए शहरों में expand कर रहे हैं। अगर आपका शहर अभी उपलब्ध नहीं है तो app download करके अपना area register करें — जब हम आपके शहर में launch करेंगे तो आपको सबसे पहले notification जाएगा।",
    },
    {
        q: "Can I become a vendor in my city?",
        a: "Yes. If you're a water supplier in any city, you can register on Milkdi and start taking orders. We welcome vendors from all cities — even where we haven't officially launched yet. Register at www.milkdi.com/register.",
    },
]

export default function WaterDeliveryNearMe() {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState<"active" | "coming_soon" | "">("")

    const handleCheck = () => {
        setResult(checkArea(query))
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero + Area Checker */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(160deg, #dff6ff 0%, #b8e9fa 45%, #f0f9ff 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
                    <div className="max-w-xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                            style={{ background: "rgba(29,78,216,0.08)", color: "#D97706", border: "1px solid rgba(29,78,216,0.15)" }}>
                            <MapPin size={12} /> Find Milk Delivery in Your Area
                        </div>
                        <h1 className="font-extrabold leading-tight mb-3" style={{ fontSize: "clamp(28px,3.8vw,48px)", color: "#0F172A" }}>
                            Milk Delivery<br />
                            <span className="text-primary">Near Me</span>
                        </h1>
                        <p className="text-sm leading-relaxed mb-8 text-text-body">
                            अपना शहर या pin code डालें और जानें कि Milkdi आपके इलाके में deliver करता है या नहीं।
                        </p>

                        {/* Area Checker */}
                        <div className="rounded-xl p-5" style={{ background: "white", border: "1.5px solid #FDE68A", boxShadow: "0 4px 24px rgba(29,78,216,0.06)" }}>
                            <p className="text-sm font-semibold mb-3 text-left text-text-title">
                                अपना इलाका check करें
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={e => { setQuery(e.target.value); setResult("") }}
                                        onKeyDown={e => e.key === "Enter" && handleCheck()}
                                        placeholder="City, area or pin code — e.g. Lucknow, 226010"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                                        style={{ border: "1.5px solid #E2E8F0", background: "#F8FAFC" }}
                                    />
                                </div>
                                <button
                                    onClick={handleCheck}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 bg-primary">
                                    Check
                                </button>
                            </div>

                            {result === "active" && (
                                <div className="mt-4 p-4 rounded-xl flex items-start gap-3"
                                    style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                                    <CheckCircle size={18} style={{ color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                        <p className="font-semibold text-sm text-primary">
                                            हाँ! हम आपके इलाके में deliver करते हैं 🎉
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: "#166534" }}>
                                            App download करें और 60 seconds में order करें।
                                        </p>
                                        <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                            target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
                                            style={{ background: "#16A34A", color: "white" }}>
                                            <Droplets size={12} /> Download App
                                        </a>
                                    </div>
                                </div>
                            )}

                            {result === "coming_soon" && (
                                <div className="mt-4 p-4 rounded-xl flex items-start gap-3"
                                    style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                                    <Clock size={18} style={{ color: "#EA580C", flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: "#C2410C" }}>
                                            अभी इस इलाके में coming soon
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: "#9A3412" }}>
                                            हम लगातार नए areas में expand कर रहे हैं। App download करें — launch होते ही notification मिलेगा।
                                        </p>
                                        <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                            target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
                                            style={{ background: "#EA580C", color: "white" }}>
                                            <Droplets size={12} /> Notify करें जब launch हो
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* How local vendors work */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        Nearby vendors, delivered fast
                    </h2>
                    <p className="text-sm mb-10 text-text-muted">
                        Milkdi connects you to verified dairy vendors in your neighbourhood — not a centralised warehouse
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                icon: MapPin,
                                title: "Hyperlocal matching",
                                body: "जब आप address डालते हैं तो app 5km radius में सभी verified vendors दिखाता है। Closest vendor को order जाता है।",
                            },
                            {
                                icon: Clock,
                                title: "Faster than you think",
                                body: "Local vendor पास में है इसलिए delivery fast होती है। Average time Lucknow में 1–3 घंटे है।",
                            },
                            {
                                icon: CheckCircle,
                                title: "Every vendor is verified",
                                body: "No random delivery people. हर vendor ID-verified है, पता जानते हैं और Milkdi पर rating maintain करते हैं।",
                            },
                        ].map(item => (
                            <div key={item.title} className="bg-white rounded-xl border p-6 flex gap-4" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary-soft">
                                    <item.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1.5 text-sm text-text-title">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cities */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        Currently serving
                    </h2>
                    <p className="text-sm mb-8 text-text-muted">
                        अभी उपलब्ध शहर — और जल्द आने वाले शहर
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {cities.map(c => (
                            <div key={c.name}>
                                {c.status === "active" && c.href ? (
                                    <Link href={c.href}
                                        className="flex items-center gap-2.5 p-3 rounded-xl border text-sm transition-all hover:border-blue-300"
                                        style={{ borderColor: "#FDE68A", background: "#FFFBEB" }}>
                                        <MapPin size={14} style={{ color: "#D97706", flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold leading-tight text-primary-dark">{c.name}</p>
                                            <p className="text-xs" style={{ color: "#3B82F6" }}>Active now</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl border text-sm"
                                        style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
                                        <MapPin size={14} style={{ color: "#CBD5E1", flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold leading-tight text-text-muted-light">{c.name}</p>
                                            <p className="text-xs" style={{ color: "#CBD5E1" }}>Coming soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">FAQs</h2>
                    <p className="text-sm mb-8 text-text-muted">Water delivery near me — common questions</p>
                    <div className="space-y-4">
                        {faqs.map((f, i) => (
                            <div key={i} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
                                <h3 className="font-semibold text-sm mb-2 text-text-title">{f.q}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* App CTA */}
            <section className="py-14 px-6 bg-primary">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-bold text-white mb-3">
                        आपके पास डिलीवरी है — Order करें
                    </h2>
                    <p className="text-sm text-white/70 mb-6">
                        Download the app, enter your address and see vendors near you right now.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                            style={{ background: "white", color: "#D97706" }}>
                            <Droplets size={15} /> Download Milkdi App
                        </a>
                        <a href="tel:+919455791624"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10">
                            <Phone size={15} /> +91 94557 91624
                        </a>
                    </div>
                    <p className="mt-5 text-xs text-white/50">
                        Vendor हैं? <Link href="/become-a-milk-vendor-lucknow" className="text-white/80 underline">अपना area cover करें →</Link>
                    </p>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
