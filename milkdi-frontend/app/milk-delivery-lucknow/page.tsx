import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Droplets, Clock, Shield, Star, CheckCircle, ArrowRight, Phone, Truck, Users } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Milk Delivery in Lucknow | 20L Can Delivery at Home | Milkdi",
    description: "Order 20 litre milk delivery in Lucknow — Gomti Nagar, Hazratganj, Indira Nagar and more. FSSAI certified vendors, same-day delivery. Download the Milkdi app. दूध डिलीवरी लखनऊ।",
    keywords: [
        "milk delivery Lucknow",
        "दूध डिलीवरी लखनऊ",
        "milk delivery Lucknow",
        "milk delivery app Lucknow",
        "fresh milk Lucknow",
        "drinking milk delivery Lucknow",
        "milk home delivery Lucknow",
        "शुद्ध दूध डिलीवरी लखनऊ",
    ],
    alternates: { canonical: "https://www.milkdi.com/milk-delivery-lucknow" },
    openGraph: {
        title: "Milk Delivery in Lucknow | Milkdi",
        description: "Safe, clean fresh milk delivered to your door anywhere in Lucknow. Order in 60 seconds on the Milkdi app.",
        url: "https://www.milkdi.com/milk-delivery-lucknow",
        type: "website",
    },
}

const faqData = [
    {
        question: "लखनऊ में दूध की डिलीवरी कितने समय में होती है?",
        answer: "आपका ऑर्डर देने के बाद नज़दीकी वेंडर को तुरंत नोटिफिकेशन जाती है। गोमती नगर, हज़रतगंज और इंदिरा नगर जैसे इलाकों में ज़्यादातर ऑर्डर 1–3 घंटे में डिलीवर होते हैं।",
    },
    {
        question: "How much does milk delivery cost in Lucknow?",
        answer: "Prices vary by vendor and area, typically ₹30–₹60 per 20L can. Delivery charges depend on distance. You can see exact pricing before placing your order in the app.",
    },
    {
        question: "क्या Milkdi के दूध के वेंडर FSSAI सर्टिफाइड हैं?",
        answer: "हाँ। Milkdi पर रजिस्टर होने वाले सभी वेंडर की जाँच की जाती है। FSSAI-certified vendors को प्राथमिकता दी जाती है ताकि आपको हमेशा शुद्ध पेयजल मिले।",
    },
    {
        question: "Can I schedule a daily milk delivery in Lucknow?",
        answer: "Yes. The Milkdi app lets you set a recurring delivery — for example, one 20L can every morning at 8 AM. Your vendor gets the order automatically.",
    },
    {
        question: "Milkdi किन-किन इलाकों में डिलीवरी करता है?",
        answer: "अभी हम लखनऊ के प्रमुख इलाकों में सेवा दे रहे हैं — गोमती नगर, हज़रतगंज, इंदिरा नगर, आलमबाग, अमीनाबाद, महानगर, विकास नगर, कानपुर रोड और आसपास के क्षेत्र। हम लगातार और जगहों तक पहुँच रहे हैं।",
    },
]

const areas = [
    { name: "Gomti Nagar", hindi: "गोमती नगर", active: true },
    { name: "Hazratganj", hindi: "हज़रतगंज", active: true },
    { name: "Indira Nagar", hindi: "इंदिरा नगर", active: true },
    { name: "Aliganj", hindi: "अलीगंज", active: true },
    { name: "Mahanagar", hindi: "महानगर", active: true },
    { name: "Alambagh", hindi: "आलमबाग", active: true },
    { name: "Vikas Nagar", hindi: "विकास नगर", active: true },
    { name: "Aminabad", hindi: "अमीनाबाद", active: true },
    { name: "Rajajipuram", hindi: "राजाजीपुरम", active: true },
    { name: "Kanpur Road", hindi: "कानपुर रोड", active: true },
    { name: "Jankipuram", hindi: "जानकीपुरम", active: false },
    { name: "Chinhat", hindi: "चिनहट", active: false },
]

const steps = [
    { n: "1", title: "App डाउनलोड करें", body: "Google Play से Milkdi app install करें। Registration में 2 मिनट से भी कम लगते हैं।" },
    { n: "2", title: "Order करें", body: "अपना पता डालें, पास के vendor चुनें और 20L कैन की संख्या बताएं। Payment online या cash दोनों।" },
    { n: "3", title: "घर बैठे पाएं", body: "Vendor को तुरंत notification जाती है। वो confirm करते हैं और डिलीवरी पर निकल जाते हैं।" },
]

const trustPoints = [
    { icon: Shield, title: "Verified Vendors Only", body: "हर vendor verified है। कोई भी अनजान व्यक्ति आपके घर दूध deliver नहीं कर सकता।" },
    { icon: Droplets, title: "Sealed Cans, Pure Milk", body: "सभी 20L cans factory-sealed होती हैं। RO purified water जो सीधे आपके घर आती है।" },
    { icon: Clock, title: "Same-Day Delivery", body: "सुबह 8 बजे से शाम 8 बजे के बीच ऑर्डर करें — उसी दिन डिलीवरी।" },
    { icon: Star, title: "Rate Every Delivery", body: "हर delivery के बाद rating दें। Low-rated vendors automatically suspend हो जाते हैं।" },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "Milkdi Milk Delivery Lucknow",
            description: "20 litre milk delivery service in Lucknow, Uttar Pradesh. FSSAI certified vendors, same-day delivery.",
            url: "https://www.milkdi.com/milk-delivery-lucknow",
            telephone: "+91-9455791624",
            email: "milkdiservices@gmail.com",
            address: {
                "@type": "PostalAddress",
                streetAddress: "4/37 Vibhav Khand, Gomti Nagar",
                addressLocality: "Lucknow",
                addressRegion: "Uttar Pradesh",
                postalCode: "226010",
                addressCountry: "IN",
            },
            geo: { "@type": "GeoCoordinates", latitude: 26.8467, longitude: 80.9462 },
            areaServed: [
                "Gomti Nagar", "Hazratganj", "Indira Nagar", "Aliganj",
                "Mahanagar", "Alambagh", "Vikas Nagar", "Aminabad", "Lucknow",
            ],
            priceRange: "₹30–₹60",
            openingHours: "Mo-Sa 08:00-20:00",
            sameAs: ["https://play.google.com/store/apps/details?id=com.difmo.milkdi"],
        },
        {
            "@type": "FAQPage",
            mainEntity: faqData.map(f => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ],
}

export default function WaterDeliveryLucknow() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(160deg, #dff6ff 0%, #b8e9fa 40%, #e0f2fe 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                            style={{ background: "rgba(29,78,216,0.08)", color: "#D97706", border: "1px solid rgba(29,78,216,0.15)" }}>
                            <MapPin size={13} />
                            लखनऊ में उपलब्ध — Lucknow, Uttar Pradesh
                        </div>

                        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(30px,4vw,54px)", color: "#0F172A" }}>
                            घर बैठे मँगाएं<br />
                            <span className="text-primary">शुद्ध पेयजल</span>
                        </h1>
                        <p className="text-base md:text-lg mb-3 font-medium text-text-title">
                            Milk Delivery in Lucknow — at Your Doorstep
                        </p>
                        <p className="text-sm leading-relaxed mb-8" style={{ color: "#334155", maxWidth: "480px" }}>
                            Order 20-litre sealed milk products from FSSAI-certified local vendors. Same-day delivery across Gomti Nagar, Hazratganj, Indira Nagar and 7+ more areas in Lucknow.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity bg-primary">
                                <Droplets size={16} /> App Download करें
                            </a>
                            <Link href="/become-a-milk-vendor-lucknow"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                                style={{ background: "white", color: "#D97706", border: "1.5px solid #FDE68A" }}>
                                Vendor बनें <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-5 mt-8">
                            {[["500+", "Happy Customers"], ["25+", "Verified Vendors"], ["1–3 hr", "Delivery Time"]].map(([v, l]) => (
                                <div key={l}>
                                    <p className="text-xl font-bold text-primary">{v}</p>
                                    <p className="text-xs text-text-muted">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">कैसे काम करता है?</h2>
                    <p className="text-sm mb-10 text-text-muted">How to order milk delivery in Lucknow — 3 simple steps</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map(s => (
                            <div key={s.n} className="bg-white rounded-xl p-6 border" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white mb-4 bg-primary">{s.n}</div>
                                <h3 className="font-semibold mb-2 text-text-title">{s.title}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coverage */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">लखनऊ में हमारी डिलीवरी</h2>
                    <p className="text-sm mb-8 text-text-muted">
                        Water can delivery available across these Lucknow neighbourhoods
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {areas.map(a => (
                            <div key={a.name}
                                className="flex items-center gap-2.5 p-3 rounded-xl border text-sm"
                                style={{
                                    borderColor: a.active ? "#FDE68A" : "#E2E8F0",
                                    background: a.active ? "#FFFBEB" : "#F8FAFC",
                                }}>
                                <MapPin size={14} style={{ color: a.active ? "#D97706" : "#94A3B8", flexShrink: 0 }} />
                                <div>
                                    <p className="font-semibold leading-tight" style={{ color: a.active ? "#B45309" : "#94A3B8" }}>{a.name}</p>
                                    <p className="text-xs" style={{ color: a.active ? "#3B82F6" : "#CBD5E1" }}>{a.hindi}</p>
                                </div>
                                {!a.active && (
                                    <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "#F1F5F9", color: "#94A3B8" }}>Soon</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-text-muted-light">
                        अपने इलाके की जाँच करें — <Link href="/milk-delivery-near-me" className="underline text-primary">Check your area →</Link>
                    </p>
                </div>
            </section>

            {/* Trust */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">Why Lucknow trusts Milkdi</h2>
                    <p className="text-sm mb-10 text-text-muted">Milkdi पर भरोसा क्यों?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {trustPoints.map(t => (
                            <div key={t.title} className="bg-white rounded-xl p-6 flex gap-4 border" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary-soft">
                                    <t.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1 text-text-title">{t.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{t.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">अक्सर पूछे जाने वाले सवाल</h2>
                    <p className="text-sm mb-10 text-text-muted">Frequently Asked Questions — Milk Delivery Lucknow</p>
                    <div className="space-y-4">
                        {faqData.map((f, i) => (
                            <div key={i} className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
                                <h3 className="font-semibold mb-2 text-sm text-text-title">{f.question}</h3>
                                <p className="text-sm leading-relaxed text-text-muted">{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download CTA */}
            <section className="py-16 px-6 bg-primary">
                <div className="max-w-2xl mx-auto text-center">
                    <Droplets size={32} className="mx-auto mb-4 opacity-60" style={{ color: "white" }} />
                    <h2 className="text-2xl font-bold text-white mb-3">
                        लखनऊ में दूध मँगाना है?
                    </h2>
                    <p className="text-sm mb-8 opacity-80 text-white">
                        Download the Milkdi app and place your first order in under 60 seconds.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: "white", color: "#D97706" }}>
                            <Droplets size={16} /> Google Play से Download करें
                        </a>
                        <a href="tel:+919455791624"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/30 transition-all hover:bg-white/10">
                            <Phone size={16} /> +91 94557 91624
                        </a>
                    </div>
                    <p className="mt-6 text-xs opacity-50 text-white">
                        Vendor हैं? <Link href="/become-a-milk-vendor-lucknow" className="underline text-white">Milkdi पर register करें →</Link>
                    </p>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
