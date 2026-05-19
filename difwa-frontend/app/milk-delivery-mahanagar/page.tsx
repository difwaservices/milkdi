import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Droplets, Clock, Shield, CheckCircle, Phone, Star } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Milk Delivery in Mahanagar Lucknow | Milkdi",
    description: "20 litre milk delivery in Mahanagar, Mahanagar Extension, and nearby areas in Lucknow. FSSAI certified vendors, same-day delivery. दूध डिलीवरी महानगर।",
    keywords: [
        "milk delivery Mahanagar", "milk delivery Mahanagar Lucknow",
        "दूध डिलीवरी महानगर", "fresh milk Mahanagar",
        "milk delivery Mahanagar Extension", "fresh milk Mahanagar Lucknow",
    ],
    alternates: { canonical: "https://www.milkdi.com/milk-delivery-mahanagar" },
    openGraph: {
        title: "Milk Delivery in Mahanagar Lucknow | Milkdi",
        description: "20L sealed milk products delivered in Mahanagar and Mahanagar Extension, Lucknow. FSSAI certified, same-day.",
        url: "https://www.milkdi.com/milk-delivery-mahanagar",
    },
}

const areas = [
    { name: "Mahanagar Block A", active: true },
    { name: "Mahanagar Block B", active: true },
    { name: "Mahanagar Block C", active: true },
    { name: "Mahanagar Block D", active: true },
    { name: "Mahanagar Extension", active: true },
    { name: "Niralanagar", active: true },
    { name: "Nirala Nagar Colony", active: false },
    { name: "Qaiserbagh nearby", active: false },
]

const faqs = [
    {
        q: "Mahanagar के कौन-कौन से blocks में delivery होती है?",
        a: "Block A, B, C, D और Mahanagar Extension में currently delivery active है। Nirala Nagar Colony में जल्द शुरू होगा।",
    },
    {
        q: "क्या Niralanagar में भी Milkdi deliver करता है?",
        a: "हाँ, Niralanagar भी हमारे active delivery zone में है। App में अपना address डालें और nearest vendor check करें।",
    },
    {
        q: "Mahanagar में delivery कितने समय में होती है?",
        a: "Average 1–2 घंटे। Early morning orders (8–10 AM) typically fastest होते हैं जब vendors ज़्यादा available होते हैं।",
    },
    {
        q: "क्या winter में भी delivery होती है?",
        a: "हाँ, साल भर delivery होती है — गर्मी हो या सर्दी। Operating hours 8 AM से 8 PM daily (Monday–Saturday)।",
    },
    {
        q: "20L can के अलावा 10L can भी मिलती है?",
        a: "हाँ। App में vendor की listing में दोनों options दिखेंगे — 10L और 20L। Price और availability vendor के हिसाब से vary करती है।",
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "Milkdi Milk Delivery — Mahanagar",
            description: "20 litre milk delivery in Mahanagar, Lucknow. FSSAI certified vendors.",
            url: "https://www.milkdi.com/milk-delivery-mahanagar",
            telephone: "+91-9455791624",
            email: "milkdiservices@gmail.com",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Mahanagar, Lucknow",
                addressRegion: "Uttar Pradesh",
                postalCode: "226006",
                addressCountry: "IN",
            },
            areaServed: ["Mahanagar", "Mahanagar Extension", "Niralanagar", "Lucknow"],
            priceRange: "₹35–₹55",
            openingHours: "Mo-Sa 08:00-20:00",
        },
        {
            "@type": "FAQPage",
            mainEntity: faqs.map(f => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        },
    ],
}

export default function MahanagarPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(160deg, #dff6ff 0%, #b8e9fa 45%, #f0f9ff 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                            style={{ background: "rgba(29,78,216,0.08)", color: "#D97706", border: "1px solid rgba(29,78,216,0.15)" }}>
                            <MapPin size={12} /> Mahanagar, Lucknow — Active Zone
                        </div>
                        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,3.8vw,50px)", color: "#0F172A" }}>
                            Milk Delivery<br />
                            <span className="text-primary">in Mahanagar</span>
                        </h1>
                        <p className="text-base font-medium mb-3 text-text-title">
                            महानगर में शुद्ध पेयजल — घर पर डिलीवरी
                        </p>
                        <p className="text-sm leading-relaxed mb-8 text-text-body">
                            Mahanagar Block A–D, Mahanagar Extension और Niralanagar — Milkdi के verified vendors आपके घर 20L sealed milk deliver करते हैं। Same-day delivery, हर रोज़।
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity bg-primary">
                                <Droplets size={15} /> Order करें
                            </a>
                            <a href="tel:+919455791624"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                                style={{ border: "1.5px solid #FDE68A", color: "#D97706", background: "white" }}>
                                <Phone size={14} /> Call करें
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-8">
                            {[["4 Blocks", "Active Coverage"], ["1–2 hr", "Avg Delivery"], ["10L & 20L", "Can Options"]].map(([v, l]) => (
                                <div key={l}>
                                    <p className="text-xl font-bold text-primary">{v}</p>
                                    <p className="text-xs text-text-muted">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Areas */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">महानगर — Coverage</h2>
                    <p className="text-sm mb-8 text-text-muted">Areas where Milkdi delivers in Mahanagar</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {areas.map(a => (
                            <div key={a.name} className="flex items-center gap-2 p-3 rounded-xl border"
                                style={{ borderColor: a.active ? "#FDE68A" : "#E2E8F0", background: a.active ? "#FFFBEB" : "#F8FAFC" }}>
                                <MapPin size={13} style={{ color: a.active ? "#D97706" : "#CBD5E1", flexShrink: 0 }} />
                                <div>
                                    <p className="font-semibold text-xs leading-tight" style={{ color: a.active ? "#B45309" : "#94A3B8" }}>{a.name}</p>
                                    <p className="text-[10px]" style={{ color: a.active ? "#3B82F6" : "#CBD5E1" }}>{a.active ? "Active" : "Soon"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">Order कैसे करें?</h2>
                    <p className="text-sm mb-10 text-text-muted">Mahanagar से 3 steps में दूध मँगाएं</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { n: "1", title: "App download करें", body: "Google Play से Milkdi install करें। Mahanagar block address डालें।" },
                            { n: "2", title: "Vendor चुनें", body: "Nearest verified vendor select करें — price, rating, delivery time सब दिखेगा।" },
                            { n: "3", title: "Delivery पाएं", body: "1–2 घंटे में 20L can आपके घर। Empty can उसी trip में exchange।" },
                        ].map(s => (
                            <div key={s.n} className="rounded-xl p-6 border" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white mb-4 bg-primary">{s.n}</div>
                                <h3 className="font-semibold mb-2 text-text-title">{s.title}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-10 text-text-title">Milkdi पर भरोसा क्यों?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { icon: Shield, title: "Verified Vendors", body: "Mahanagar में हर vendor ID-verified और FSSAI-certified है।" },
                            { icon: Star, title: "Rating System", body: "हर delivery के बाद rating mandatory। Low-rated vendors automatically review में।" },
                            { icon: Clock, title: "Same-Day Delivery", body: "8 AM – 8 PM के बीच order करें — उसी दिन delivery guaranteed।" },
                            { icon: CheckCircle, title: "10L & 20L Both", body: "छोटे परिवार के लिए 10L, बड़े के लिए 20L — दोनों options app में।" },
                        ].map(t => (
                            <div key={t.title} className="bg-white rounded-xl p-6 flex gap-4 border" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary-soft">
                                    <t.icon size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1 text-sm text-text-title">{t.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{t.body}</p>
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
                    <p className="text-sm mb-8 text-text-muted">Water delivery — Mahanagar Lucknow</p>
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

            {/* Internal links */}
            <section className="py-10 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <p className="text-sm font-semibold mb-4 text-text-title">Lucknow के अन्य इलाके</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: "Gomti Nagar", href: "/milk-delivery-gomti-nagar" },
                            { label: "Indira Nagar", href: "/milk-delivery-indira-nagar" },
                            { label: "Hazratganj", href: "/milk-delivery-hazratganj" },
                            { label: "Aliganj", href: "/milk-delivery-aliganj" },
                            { label: "Alambagh", href: "/milk-delivery-alambagh" },
                            { label: "All of Lucknow", href: "/milk-delivery-lucknow" },
                        ].map(l => (
                            <Link key={l.href} href={l.href}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border hover:border-blue-300 transition-colors"
                                style={{ borderColor: "#E2E8F0", color: "#D97706" }}>
                                {l.label} →
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 px-6 bg-primary">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-bold text-white mb-3">महानगर में दूध मँगाना है?</h2>
                    <p className="text-sm text-white/70 mb-6">Download the app and order in under 60 seconds.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                            style={{ background: "white", color: "#D97706" }}>
                            <Droplets size={15} /> Download Milkdi App
                        </a>
                        <a href="tel:+919455791624"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/30">
                            <Phone size={15} /> +91 94557 91624
                        </a>
                    </div>
                    <p className="mt-5 text-xs text-white/50">
                        Vendor हैं? <Link href="/become-a-milk-vendor-lucknow" className="text-white/80 underline">Register करें →</Link>
                    </p>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
