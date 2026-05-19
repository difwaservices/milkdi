import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, X, ArrowRight, Droplets, Shield, MapPin, Phone, Clock } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "20 Litre Milk Delivery at Home | Milkdi — Lucknow",
    description: "Order 20 litre sealed milk delivery at home in Lucknow. FSSAI certified vendors, pure milk, same-day delivery. बीस लीटर दूध कैन डिलीवरी। Price: ₹30–₹60.",
    keywords: [
        "20 litre milk delivery",
        "fresh milk home delivery",
        "बीस लीटर दूध कैन डिलीवरी",
        "milk price Lucknow",
        "fresh milk near me",
        "RO milk delivery",
        "sealed milk delivery",
        "दूध कैन डिलीवरी घर पर",
    ],
    alternates: { canonical: "https://www.milkdi.com/pure-milk-delivery" },
    openGraph: {
        title: "20 Litre Milk Delivery at Home | Milkdi",
        description: "Safe, sealed 20L Pure cow/buffalo milk cans delivered to your door in Lucknow. No more carrying heavy cans. Order in the Milkdi app.",
        url: "https://www.milkdi.com/pure-milk-delivery",
        type: "website",
    },
}

const comparison = [
    {
        feature: "Order करने का तरीका",
        milkdi: "App में 30 seconds",
        calling: "Phone करो, busy line, wait करो",
        self: "दुकान जाओ, लाइन लगाओ",
    },
    {
        feature: "Can की quality",
        milkdi: "Factory sealed, FSSAI verified",
        calling: "Pata nahi — koi check nahi",
        self: "Can ka seal check karna padta hai",
    },
    {
        feature: "डिलीवरी का समय",
        milkdi: "Same-day, 1–3 hours",
        calling: "\"Kal tak bata dena\"",
        self: "Abhi — lekin 20kg khud uthao",
    },
    {
        feature: "Tracking",
        milkdi: "Live map tracking",
        calling: "Koi tracking nahi",
        self: "N/A",
    },
    {
        feature: "Payment",
        milkdi: "UPI / Card / Cash",
        calling: "Cash only mostly",
        self: "Cash",
    },
    {
        feature: "Problem hone par",
        milkdi: "App complaint → refund 24 hrs",
        calling: "\"Baad mein dekhenge\"",
        self: "No recourse",
    },
]

const features = [
    {
        title: "Factory Sealed Cap",
        body: "हर 20L can factory-sealed होती है। Tamper-evident seal आपको बताती है कि can सुरक्षित है।",
        icon: Shield,
    },
    {
        title: "RO + UV Purified",
        body: "FSSAI certified vendors RO + UV purified water supply करते हैं। TDS levels safe range में होती है।",
        icon: Droplets,
    },
    {
        title: "हम Can उठाते हैं",
        body: "20kg की can आपको carry नहीं करनी। Delivery person घर तक, जहाँ बोलें वहाँ रखकर जाएगा।",
        icon: CheckCircle,
    },
    {
        title: "Empty Can वापस लें",
        body: "अगला order करते समय खाली can vendor को वापस कर दें। Extra charges नहीं।",
        icon: ArrowRight,
    },
]

const cities = [
    { name: "Lucknow", active: true, href: "/milk-delivery-lucknow" },
    { name: "Kanpur", active: false, href: null },
    { name: "Agra", active: false, href: null },
    { name: "Varanasi", active: false, href: null },
    { name: "Prayagraj", active: false, href: null },
    { name: "Noida", active: false, href: null },
]

const faqs = [
    {
        q: "fresh milk ki price kitni hoti hai?",
        a: "Lucknow mein Milkdi vendors typically ₹30–₹60 per 20L can charge karte hain. Price vendor aur area ke hisaab se thodi alag ho sakti hai. App mein order karne se pehle exact price dikhai deti hai.",
    },
    {
        q: "क्या 20 लीटर कैन का दूध पीने के लिए सुरक्षित है?",
        a: "हाँ, अगर vendor FSSAI certified है। Milkdi पर listed सभी vendors pure milk supply करते हैं। दूध की quality की जिम्मेदारी हमारी है — कोई complaint आने पर vendor की listing तुरंत review होती है।",
    },
    {
        q: "Can I order multiple 20L cans at once?",
        a: "Yes. You can order up to 10 cans in a single order on the Milkdi app. For bulk orders (offices, hotels, construction sites) above 10 cans, call us directly at +91 94557 91624.",
    },
    {
        q: "20 लीटर कैन कितने दिन चलती है?",
        a: "एक औसत 4-5 लोगों के परिवार के लिए एक 20L can 3–5 दिन चलती है। अगर आप daily cooking और drinking दोनों के लिए use करते हैं तो 2–3 दिन। App में subscription set करें ताकि automatically order जाए।",
    },
    {
        q: "What if the seal is broken when delivered?",
        a: "Refuse the delivery immediately and report in the app. We will send a replacement within the same day and take action against the vendor. A broken seal is a serious quality violation in our system.",
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Product",
            name: "20 Litre Milk",
            description: "Factory-sealed 20 litre RO purified milk. FSSAI certified vendors. Home delivery in Lucknow.",
            brand: { "@type": "Brand", name: "Milkdi" },
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: "30",
                highPrice: "60",
                offerCount: "25",
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "Milkdi" },
            },
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

export default function TwentyLitreWaterCanDelivery() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(160deg, #dff6ff 0%, #b8e9fa 45%, #f0f9ff 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                                style={{ background: "rgba(29,78,216,0.08)", color: "#D97706", border: "1px solid rgba(29,78,216,0.15)" }}>
                                <Droplets size={12} /> बीस लीटर दूध कैन डिलीवरी
                            </div>
                            <h1 className="font-extrabold leading-tight mb-3" style={{ fontSize: "clamp(28px,3.6vw,48px)", color: "#0F172A" }}>
                                20 Litre Milk<br />
                                <span className="text-primary">Delivered at Home</span>
                            </h1>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: "#334155", maxWidth: "400px" }}>
                                Heavy can carry karne ki zaroorat nahi. Milkdi app mein order karo — sealed 20L Pure cow/buffalo milk can seedha ghar pahunchi.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl" style={{ background: "white", border: "1px solid #E2E8F0" }}>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-primary">20L</p>
                                    <p className="text-xs text-text-muted">Can size</p>
                                </div>
                                <div className="text-center border-x" style={{ borderColor: "#E2E8F0" }}>
                                    <p className="text-lg font-bold text-primary">₹30–60</p>
                                    <p className="text-xs text-text-muted">Price per can</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-primary">1–3h</p>
                                    <p className="text-xs text-text-muted">Delivery</p>
                                </div>
                            </div>
                            <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary">
                                <Droplets size={16} /> Order Now
                            </a>
                        </div>
                        <div className="rounded-xl p-6" style={{ background: "white", border: "1.5px solid #FDE68A" }}>
                            <p className="text-xs font-semibold mb-4 text-text-muted">WHAT'S IN YOUR 20L CAN</p>
                            <div className="space-y-3">
                                {[
                                    "RO + UV purified fresh milk",
                                    "Factory-sealed tamper-evident cap",
                                    "Food-grade BPA-free container",
                                    "FSSAI certified source vendor",
                                    "TDS within safe drinking range",
                                    "No home-delivery surcharge (varies by area)",
                                ].map(item => (
                                    <div key={item} className="flex items-center gap-3 text-sm text-text-body">
                                        <CheckCircle size={15} style={{ color: "#D97706", flexShrink: 0 }} />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        Milkdi vs. बाकी तरीके
                    </h2>
                    <p className="text-sm mb-8 text-text-muted">Why ordering on the app beats calling the local shop</p>
                    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                                    <th className="text-left px-5 py-4 font-semibold text-text-muted">Feature</th>
                                    <th className="text-center px-5 py-4 font-semibold" style={{ color: "#D97706", background: "#FFFBEB" }}>
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Droplets size={14} /> Milkdi App
                                        </div>
                                    </th>
                                    <th className="text-center px-5 py-4 font-semibold text-text-muted">Local Shop Call</th>
                                    <th className="text-center px-5 py-4 font-semibold text-text-muted">Self Pickup</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                        <td className="px-5 py-4 font-medium text-text-body">{row.feature}</td>
                                        <td className="px-5 py-4 text-center bg-primary-soft">
                                            <span className="text-xs font-medium text-primary-dark">{row.milkdi}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center text-xs text-text-muted-light">{row.calling}</td>
                                        <td className="px-5 py-4 text-center text-xs text-text-muted-light">{row.self}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">Product Details</h2>
                    <p className="text-sm mb-10 text-text-muted">Everything you should know about your 20L can</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {features.map(f => (
                            <div key={f.title} className="rounded-xl border p-6 flex gap-4" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary-soft">
                                    <f.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1.5 text-text-title">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-muted">{f.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cities */}
            <section className="py-14 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">Where we deliver</h2>
                    <p className="text-sm mb-6 text-text-muted">Currently serving Lucknow, expanding soon</p>
                    <div className="flex flex-wrap gap-3">
                        {cities.map(c => (
                            c.active ? (
                                <Link key={c.name} href={c.href!}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                                    style={{ background: "#D97706", color: "white" }}>
                                    <MapPin size={13} /> {c.name}
                                    <span className="text-xs opacity-70 ml-1">Active</span>
                                </Link>
                            ) : (
                                <span key={c.name}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                                    style={{ background: "#F1F5F9", color: "#94A3B8", border: "1px solid #E2E8F0" }}>
                                    <MapPin size={13} /> {c.name}
                                    <span className="text-xs ml-1">Coming soon</span>
                                </span>
                            )
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">20L Can — FAQ</h2>
                    <p className="text-sm mb-8 text-text-muted">अक्सर पूछे जाने वाले सवाल</p>
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
                    <h2 className="text-xl font-bold text-white mb-2">20L Can Order करें — अभी</h2>
                    <p className="text-sm text-white/70 mb-6">Lucknow mein same-day delivery. App download karo aur 30 seconds mein order karo.</p>
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
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
