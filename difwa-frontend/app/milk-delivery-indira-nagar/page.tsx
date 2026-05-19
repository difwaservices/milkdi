import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Droplets, Clock, Shield, CheckCircle, ArrowRight, Phone, Star } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Milk Delivery in Indira Nagar Lucknow | Milkdi",
    description: "20 litre milk delivery in Indira Nagar Lucknow — Sector 1 to 27, Munshi Pulia, and surrounding areas. FSSAI certified vendors, same-day delivery. दूध डिलीवरी इंदिरा नगर।",
    keywords: [
        "milk delivery Indira Nagar", "milk delivery Indira Nagar Lucknow",
        "fresh milk Indira Nagar", "दूध डिलीवरी इंदिरा नगर",
        "milk delivery Munshi Pulia", "fresh milk Indira Nagar",
    ],
    alternates: { canonical: "https://www.milkdi.com/milk-delivery-indira-nagar" },
    openGraph: {
        title: "Milk Delivery in Indira Nagar Lucknow | Milkdi",
        description: "20L sealed milk products delivered to your door in Indira Nagar. FSSAI certified vendors, same-day delivery.",
        url: "https://www.milkdi.com/milk-delivery-indira-nagar",
    },
}

const sectors = [
    { name: "Sector 1–5", active: true },
    { name: "Sector 6–10", active: true },
    { name: "Sector 11–15", active: true },
    { name: "Sector 16–20", active: true },
    { name: "Sector 21–25", active: true },
    { name: "Sector 26–27", active: true },
    { name: "Munshi Pulia", active: true },
    { name: "Sitapur Road", active: true },
    { name: "Faizabad Road", active: false },
    { name: "Nishatganj", active: false },
]

const faqs = [
    {
        q: "क्या Milkdi इंदिरा नगर के सभी सेक्टर्स में deliver करता है?",
        a: "हाँ। Sector 1 से 27 तक और Munshi Pulia तक हम currently deliver कर रहे हैं। Sitapur Road और Faizabad Road क्षेत्र में जल्द शुरू होगा।",
    },
    {
        q: "Indira Nagar में delivery कितने समय में होती है?",
        a: "Indira Nagar में average delivery time 1–2 घंटे है। Peak hours (सुबह 8–10 बजे) में थोड़ा अधिक समय लग सकता है।",
    },
    {
        q: "fresh milk की कीमत क्या है?",
        a: "Indira Nagar में 20L can की price ₹35–₹55 के बीच होती है, vendor और area के अनुसार। App में order से पहले exact price दिखती है।",
    },
    {
        q: "Can I order water daily in Indira Nagar?",
        a: "Yes. The Milkdi app lets you schedule recurring deliveries — pick your time slot and your vendor delivers automatically every day.",
    },
    {
        q: "Empty can वापस कैसे करें?",
        a: "Delivery के समय rider पुरानी empty can ले जाता है। कोई अलग process नहीं — एक ही trip में exchange होता है।",
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "Milkdi Milk Delivery — Indira Nagar",
            description: "20 litre milk delivery in Indira Nagar, Lucknow. FSSAI certified vendors.",
            url: "https://www.milkdi.com/milk-delivery-indira-nagar",
            telephone: "+91-9455791624",
            email: "milkdiservices@gmail.com",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Indira Nagar, Lucknow",
                addressRegion: "Uttar Pradesh",
                postalCode: "226016",
                addressCountry: "IN",
            },
            areaServed: ["Indira Nagar", "Munshi Pulia", "Sector 1", "Sector 10", "Sector 20", "Lucknow"],
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

export default function IndiraNagarPage() {
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
                            <MapPin size={12} /> Indira Nagar, Lucknow — Active Zone
                        </div>
                        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,3.8vw,50px)", color: "#0F172A" }}>
                            Milk Delivery<br />
                            <span className="text-primary">in Indira Nagar</span>
                        </h1>
                        <p className="text-base font-medium mb-3 text-text-title">
                            इंदिरा नगर में शुद्ध पेयजल — घर पर डिलीवरी
                        </p>
                        <p className="text-sm leading-relaxed mb-8 text-text-body">
                            Sector 1 से Sector 27 तक और Munshi Pulia — Milkdi के verified vendors इंदिरा नगर के हर कोने में 20L sealed milk deliver करते हैं। Same-day delivery, cash या online payment।
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity bg-primary">
                                <Droplets size={15} /> Order करें — App Download
                            </a>
                            <a href="tel:+919455791624"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                                style={{ border: "1.5px solid #FDE68A", color: "#D97706", background: "white" }}>
                                <Phone size={14} /> Call करें
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-8">
                            {[["27+", "Sectors Covered"], ["1–2 hr", "Avg Delivery"], ["₹35–55", "Per 20L Can"]].map(([v, l]) => (
                                <div key={l}>
                                    <p className="text-xl font-bold text-primary">{v}</p>
                                    <p className="text-xs text-text-muted">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sectors grid */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">इंदिरा नगर — Coverage</h2>
                    <p className="text-sm mb-8 text-text-muted">Areas where Milkdi delivers in Indira Nagar</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {sectors.map(s => (
                            <div key={s.name} className="flex items-center gap-2 p-3 rounded-xl border text-sm"
                                style={{ borderColor: s.active ? "#FDE68A" : "#E2E8F0", background: s.active ? "#FFFBEB" : "#F8FAFC" }}>
                                <MapPin size={13} style={{ color: s.active ? "#D97706" : "#CBD5E1", flexShrink: 0 }} />
                                <div>
                                    <p className="font-semibold text-xs leading-tight" style={{ color: s.active ? "#B45309" : "#94A3B8" }}>{s.name}</p>
                                    <p className="text-[10px]" style={{ color: s.active ? "#3B82F6" : "#CBD5E1" }}>{s.active ? "Active" : "Soon"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">Order कैसे करें?</h2>
                    <p className="text-sm mb-10 text-text-muted">3 steps में दूध मँगाएं — Indira Nagar से</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { n: "1", title: "App download करें", body: "Google Play से Milkdi app install करें। अपना Indira Nagar sector address डालें।" },
                            { n: "2", title: "Vendor चुनें", body: "App आपके sector के nearest verified vendor दिखाएगा। Price, rating और delivery time सब visible।" },
                            { n: "3", title: "Delivery पाएं", body: "Order confirm होते ही vendor निकल जाता है। 1–2 घंटे में 20L can आपके दरवाज़े पर।" },
                        ].map(s => (
                            <div key={s.n} className="bg-white rounded-xl p-6 border" style={{ borderColor: "#E2E8F0" }}>
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
                            { icon: Shield, title: "Verified Vendors", body: "हर vendor ID-verified और FSSAI-certified है। Indira Nagar में कोई भी random delivery नहीं।" },
                            { icon: Star, title: "Rated After Every Order", body: "हर delivery के बाद rating mandatory है। 4★ से कम rating पर vendor auto-review में जाता है।" },
                            { icon: Clock, title: "Same-Day Guarantee", body: "सुबह 8 बजे से शाम 8 बजे तक order करें — उसी दिन delivery।" },
                            { icon: CheckCircle, title: "Sealed Factory Cans", body: "सभी 20L cans factory-sealed, RO+UV purified। खुली या refill कैन नहीं।" },
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
                    <h2 className="text-2xl font-bold mb-2 text-text-title">अक्सर पूछे जाने वाले सवाल</h2>
                    <p className="text-sm mb-8 text-text-muted">Water delivery — Indira Nagar Lucknow</p>
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
                            { label: "Hazratganj", href: "/milk-delivery-hazratganj" },
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
                    <h2 className="text-xl font-bold text-white mb-3">इंदिरा नगर में दूध मँगाना है?</h2>
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
