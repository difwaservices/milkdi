import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Droplets, Clock, Shield, CheckCircle, Phone, Star } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Milk Delivery in Hazratganj Lucknow | Milkdi",
    description: "20 litre milk delivery in Hazratganj, Civil Lines, Lalbagh and surrounding areas in Lucknow. FSSAI certified vendors, same-day delivery. दूध डिलीवरी हज़रतगंज।",
    keywords: [
        "milk delivery Hazratganj", "milk delivery Hazratganj Lucknow",
        "दूध डिलीवरी हज़रतगंज", "milk delivery Civil Lines Lucknow",
        "fresh milk Hazratganj", "fresh milk Hazratganj",
    ],
    alternates: { canonical: "https://www.milkdi.com/milk-delivery-hazratganj" },
    openGraph: {
        title: "Milk Delivery in Hazratganj Lucknow | Milkdi",
        description: "20L sealed milk products delivered in Hazratganj, Civil Lines, Lalbagh. FSSAI certified vendors, same-day delivery.",
        url: "https://www.milkdi.com/milk-delivery-hazratganj",
    },
}

const areas = [
    { name: "Hazratganj Market", active: true },
    { name: "Civil Lines", active: true },
    { name: "Lalbagh", active: true },
    { name: "Butler Palace", active: true },
    { name: "Kaiserbagh", active: true },
    { name: "Hewett Road", active: true },
    { name: "Vidhan Sabha Marg", active: false },
    { name: "Aminabad", active: false },
]

const faqs = [
    {
        q: "क्या Hazratganj market area में भी delivery होती है?",
        a: "हाँ। Hazratganj market, Civil Lines offices और residential buildings — सभी जगह हम deliver करते हैं। Office buildings के लिए bulk orders भी accept करते हैं।",
    },
    {
        q: "Hazratganj में delivery का time क्या है?",
        a: "सुबह 8 बजे से शाम 8 बजे तक। Central location होने के कारण Hazratganj में delivery typically 1–1.5 घंटे में हो जाती है।",
    },
    {
        q: "क्या office buildings में bulk order कर सकते हैं?",
        a: "बिल्कुल। Bulk orders (5+ cans) के लिए app में bulk order option है। Office के लिए weekly subscription भी set कर सकते हैं।",
    },
    {
        q: "Civil Lines area में कौन से vendors available हैं?",
        a: "App open करके अपना Civil Lines address डालें — app automatically nearby verified vendors दिखाएगा with ratings और delivery time।",
    },
    {
        q: "Payment कैसे करें?",
        a: "UPI, debit/credit card, net banking, या cash on delivery — सभी options available हैं। App में order के समय choose करें।",
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "Milkdi Milk Delivery — Hazratganj",
            description: "20 litre milk delivery in Hazratganj and Civil Lines, Lucknow.",
            url: "https://www.milkdi.com/milk-delivery-hazratganj",
            telephone: "+91-9455791624",
            email: "milkdiservices@gmail.com",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Hazratganj, Lucknow",
                addressRegion: "Uttar Pradesh",
                postalCode: "226001",
                addressCountry: "IN",
            },
            areaServed: ["Hazratganj", "Civil Lines", "Lalbagh", "Butler Palace", "Lucknow"],
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

export default function HazratganjPage() {
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
                            <MapPin size={12} /> Hazratganj, Lucknow — Active Zone
                        </div>
                        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,3.8vw,50px)", color: "#0F172A" }}>
                            Milk Delivery<br />
                            <span className="text-primary">in Hazratganj</span>
                        </h1>
                        <p className="text-base font-medium mb-3 text-text-title">
                            हज़रतगंज में शुद्ध पेयजल — घर और ऑफिस दोनों के लिए
                        </p>
                        <p className="text-sm leading-relaxed mb-8 text-text-body">
                            Hazratganj market, Civil Lines, Lalbagh और Butler Palace — Milkdi के verified vendors Lucknow के इस central hub में 20L sealed milk products deliver करते हैं। Offices के लिए bulk orders भी available।
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
                            {[["1–1.5 hr", "Avg Delivery"], ["₹35–55", "Per 20L Can"], ["Bulk OK", "Office Orders"]].map(([v, l]) => (
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
                    <h2 className="text-2xl font-bold mb-2 text-text-title">हज़रतगंज — Coverage Areas</h2>
                    <p className="text-sm mb-8 text-text-muted">Areas where Milkdi delivers in and around Hazratganj</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {areas.map(a => (
                            <div key={a.name} className="flex items-center gap-2 p-3 rounded-xl border text-sm"
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
                    <p className="text-sm mb-10 text-text-muted">Hazratganj से 3 steps में दूध मँगाएं</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { n: "1", title: "App download करें", body: "Google Play से Milkdi app install करें। Hazratganj या Civil Lines का address डालें।" },
                            { n: "2", title: "Vendor select करें", body: "आपके address के नज़दीकी verified vendors दिखेंगे — ratings और ETA के साथ।" },
                            { n: "3", title: "Delivery पाएं", body: "1–1.5 घंटे में 20L sealed milk आपके घर या office पहुँचेगी।" },
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
                            { icon: Shield, title: "Verified Vendors", body: "हर vendor ID-verified है। Hazratganj जैसे commercial area में भी safe और trusted delivery।" },
                            { icon: Star, title: "Rated Deliveries", body: "हर order के बाद rating system। Low performers automatically removed होते हैं।" },
                            { icon: Clock, title: "Fast Delivery", body: "Central location होने से Hazratganj में average delivery time सबसे कम है — 1 घंटे से भी कम।" },
                            { icon: CheckCircle, title: "Bulk & Office Orders", body: "5+ cans के orders के लिए special bulk option। Weekly office subscriptions भी available।" },
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
                    <p className="text-sm mb-8 text-text-muted">Water delivery — Hazratganj Lucknow</p>
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
                            { label: "Aliganj", href: "/milk-delivery-aliganj" },
                            { label: "Mahanagar", href: "/milk-delivery-mahanagar" },
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
                    <h2 className="text-xl font-bold text-white mb-3">हज़रतगंज में दूध मँगाना है?</h2>
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
