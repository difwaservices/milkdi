import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Droplets, Clock, Shield, CheckCircle, Phone, Star } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Milk Delivery in Alambagh Lucknow | Milkdi",
    description: "20 litre milk delivery in Alambagh, Kanpur Road, Sanjay Gandhi Puram and nearby areas in Lucknow. FSSAI certified vendors, same-day delivery. दूध डिलीवरी आलमबाग।",
    keywords: [
        "milk delivery Alambagh", "milk delivery Alambagh Lucknow",
        "दूध डिलीवरी आलमबाग", "fresh milk Alambagh",
        "milk delivery Kanpur Road Lucknow", "fresh milk Alambagh",
    ],
    alternates: { canonical: "https://www.milkdi.com/milk-delivery-alambagh" },
    openGraph: {
        title: "Milk Delivery in Alambagh Lucknow | Milkdi",
        description: "20L sealed milk products delivered in Alambagh, Kanpur Road and Sanjay Gandhi Puram. FSSAI certified, same-day.",
        url: "https://www.milkdi.com/milk-delivery-alambagh",
    },
}

const areas = [
    { name: "Alambagh Market", active: true },
    { name: "Alambagh Colony", active: true },
    { name: "Kanpur Road", active: true },
    { name: "Sanjay Gandhi Puram", active: true },
    { name: "Sharda Nagar", active: true },
    { name: "Naubasta", active: false },
    { name: "Eldeco Colony", active: false },
    { name: "Jankipuram Ext.", active: false },
]

const faqs = [
    {
        q: "Alambagh में Milkdi का delivery zone कहाँ तक है?",
        a: "Alambagh Market, Alambagh Colony, Kanpur Road, Sanjay Gandhi Puram और Sharda Nagar में delivery active है। Naubasta और Eldeco Colony में जल्द शुरू होगा।",
    },
    {
        q: "Kanpur Road के किस हिस्से तक delivery होती है?",
        a: "Alambagh bus stand से Sharda Nagar तक Kanpur Road पर delivery available है। Exact availability के लिए app में अपना address डालें।",
    },
    {
        q: "Alambagh में delivery charges कितने हैं?",
        a: "Delivery charge vendor और distance के हिसाब से vary करता है। App में order से पहले total amount clearly दिखती है — कोई hidden charge नहीं।",
    },
    {
        q: "क्या Sanjay Gandhi Puram में भी delivery होती है?",
        a: "हाँ। Sanjay Gandhi Puram हमारे active zone में है। App open करके अपना address verify करें।",
    },
    {
        q: "अगर vendor available नहीं है तो?",
        a: "App automatically next nearest available vendor को order show करता है। अगर कोई vendor available नहीं है तो app आपको notify करेगा और दूसरे time slot suggest करेगा।",
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "Milkdi Milk Delivery — Alambagh",
            description: "20 litre milk delivery in Alambagh and Kanpur Road area, Lucknow. FSSAI certified vendors.",
            url: "https://www.milkdi.com/milk-delivery-alambagh",
            telephone: "+91-9455791624",
            email: "milkdiservices@gmail.com",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Alambagh, Lucknow",
                addressRegion: "Uttar Pradesh",
                postalCode: "226005",
                addressCountry: "IN",
            },
            areaServed: ["Alambagh", "Kanpur Road", "Sanjay Gandhi Puram", "Sharda Nagar", "Lucknow"],
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

export default function AlambaghPage() {
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
                            <MapPin size={12} /> Alambagh, Lucknow — Active Zone
                        </div>
                        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,3.8vw,50px)", color: "#0F172A" }}>
                            Milk Delivery<br />
                            <span className="text-primary">in Alambagh</span>
                        </h1>
                        <p className="text-base font-medium mb-3 text-text-title">
                            आलमबाग में शुद्ध पेयजल — घर पर डिलीवरी
                        </p>
                        <p className="text-sm leading-relaxed mb-8 text-text-body">
                            Alambagh Colony, Kanpur Road, Sanjay Gandhi Puram और Sharda Nagar — Milkdi के verified vendors आपके दरवाज़े पर 20L sealed milk पहुँचाते हैं।
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
                            {[["5 Areas", "Active Coverage"], ["1–3 hr", "Avg Delivery"], ["₹35–55", "Per 20L Can"]].map(([v, l]) => (
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
                    <h2 className="text-2xl font-bold mb-2 text-text-title">आलमबाग — Coverage</h2>
                    <p className="text-sm mb-8 text-text-muted">Areas where Milkdi delivers in Alambagh</p>
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
                    <p className="text-sm mb-10 text-text-muted">Alambagh से 3 steps में दूध मँगाएं</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { n: "1", title: "App download करें", body: "Google Play से Milkdi install करें। Alambagh का exact address डालें।" },
                            { n: "2", title: "Vendor चुनें", body: "Nearest vendor with rating और delivery ETA देखें। Order place करें।" },
                            { n: "3", title: "Delivery पाएं", body: "1–3 घंटे में 20L sealed can आपके घर। Empty can same trip में वापस।" },
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
                            { icon: Shield, title: "Verified Vendors", body: "Alambagh में हर vendor verified है। Safe delivery, हर बार।" },
                            { icon: Star, title: "Rating System", body: "हर order rated होता है। Quality consistently maintained।" },
                            { icon: Clock, title: "Same-Day Delivery", body: "सुबह 8 बजे से शाम 8 बजे — उसी दिन delivery।" },
                            { icon: CheckCircle, title: "No Hidden Charges", body: "App में जो price दिखे वही pay करें — कोई extra charge नहीं।" },
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
                    <p className="text-sm mb-8 text-text-muted">Water delivery — Alambagh Lucknow</p>
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
                            { label: "Mahanagar", href: "/milk-delivery-mahanagar" },
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
                    <h2 className="text-xl font-bold text-white mb-3">आलमबाग में दूध मँगाना है?</h2>
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
