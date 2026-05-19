import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, CheckCircle, ArrowRight, Clock, Droplets, Shield, Star, Phone } from "lucide-react"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Milk Delivery in Gomti Nagar Lucknow | 20L Home Delivery | Milkdi",
    description: "20 litre milk delivery in Gomti Nagar Lucknow — Vibhav Khand, Viram Khand, Vijay Khand, Vipul Khand and all sectors. Same-day delivery from verified vendors. शुद्ध दूध गोमती नगर।",
    keywords: [
        "milk delivery Gomti Nagar",
        "fresh milk Gomti Nagar",
        "शुद्ध दूध गोमती नगर",
        "milk delivery Gomti Nagar Lucknow",
        "milk home delivery Gomti Nagar",
        "दूध डिलीवरी गोमती नगर",
        "Vibhav Khand milk delivery",
        "Viram Khand milk delivery",
    ],
    alternates: { canonical: "https://www.milkdi.com/milk-delivery-gomti-nagar" },
    openGraph: {
        title: "Milk Delivery in Gomti Nagar | Milkdi",
        description: "Same-day 20L milk delivery across all Gomti Nagar sectors in Lucknow. Vibhav Khand, Viram Khand, Vijay Khand and more.",
        url: "https://www.milkdi.com/milk-delivery-gomti-nagar",
        type: "website",
    },
}

const sectors = [
    { name: "Vibhav Khand", detail: "विभव खंड", note: "Our HQ area — fastest delivery" },
    { name: "Viram Khand", detail: "विराम खंड", note: "15–45 min avg. delivery" },
    { name: "Vijay Khand", detail: "विजय खंड", note: "3 active vendors" },
    { name: "Vipul Khand", detail: "विपुल खंड", note: "Same-day guaranteed" },
    { name: "Vinay Khand", detail: "विनय खंड", note: "Morning slots available" },
    { name: "Varun Khand", detail: "वरुण खंड", note: "4 verified vendors" },
    { name: "Vikrant Khand", detail: "विक्रांत खंड", note: "Evening delivery also" },
    { name: "Vishal Khand", detail: "विशाल खंड", note: "Same-day delivery" },
    { name: "Vrindavan Colony", detail: "वृंदावन कॉलोनी", note: "Nearby area" },
    { name: "Sector A", detail: "सेक्टर ए", note: "Covered" },
    { name: "Sector B", detail: "सेक्टर बी", note: "Covered" },
    { name: "Sector C", detail: "सेक्टर सी", note: "Covered" },
]

const process = [
    { step: "1", title: "App खोलें और पता दर्ज करें", body: "Milkdi app में अपना Gomti Nagar का address डालें। App खुद ही पास के vendors दिखाएगा।" },
    { step: "2", title: "Vendor और quantity चुनें", body: "Rating, price और delivery time देखकर vendor choose करें। 1 से 10 cans तक order करें।" },
    { step: "3", title: "Payment करें", body: "UPI, card या cash on delivery — जो आपको सुविधाजनक लगे।" },
    { step: "4", title: "Doorstep delivery", body: "Vendor निकल जाते हैं। आप live track कर सकते हैं। Delivery person sealed can आपको देता है।" },
]

const faqs = [
    {
        q: "गोमती नगर में कौन-कौन से खंडों में डिलीवरी होती है?",
        a: "Milkdi अभी Vibhav Khand, Viram Khand, Vijay Khand, Vipul Khand, Vinay Khand, Varun Khand और आसपास के सभी sectors में delivery करता है। अगर आपका पता ऊपर नहीं है तो app में address डालकर check करें।",
    },
    {
        q: "Gomti Nagar mein milk delivery kitne time mein hoti hai?",
        a: "Peak hours (7–10 AM aur 5–8 PM) mein 30–60 minute. Off-peak hours mein kabhi kabhi 15 minute se bhi kam.",
    },
    {
        q: "क्या गोमती नगर में सोसाइटी और अपार्टमेंट में डिलीवरी होती है?",
        a: "हाँ। Gomti Nagar के ज़्यादातर gated societies और apartments में हमारे vendors deliver करते हैं। Security gate पर भी vendor जाता है।",
    },
    {
        q: "Can I order water for my office in Gomti Nagar?",
        a: "Absolutely. Many corporate offices in Gomti Nagar order through Milkdi for their water coolers and pantries. You can set up weekly recurring orders with a fixed morning delivery slot.",
    },
    {
        q: "अगर दूध का टेस्ट सही नहीं लगा तो क्या होगा?",
        a: "App में तुरंत complaint करें। हम 24 घंटे के अंदर refund या free replacement देते हैं। Vendor की rating भी कम हो जाती है ताकि दूसरे users सावधान रहें।",
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "Milkdi Milk Delivery — Gomti Nagar",
            description: "20L milk delivery in Gomti Nagar, Lucknow. All sectors: Vibhav Khand, Viram Khand, Vijay Khand, Vipul Khand.",
            url: "https://www.milkdi.com/milk-delivery-gomti-nagar",
            telephone: "+91-9455791624",
            address: {
                "@type": "PostalAddress",
                streetAddress: "4/37 Vibhav Khand, Gomti Nagar",
                addressLocality: "Lucknow",
                addressRegion: "Uttar Pradesh",
                postalCode: "226010",
                addressCountry: "IN",
            },
            areaServed: sectors.map(s => s.name + ", Gomti Nagar, Lucknow"),
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

export default function WaterDeliveryGomtiNagar() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(160deg, #dff6ff 0%, #b8e9fa 50%, #f0f9ff 100%)" }}>
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                            style={{ background: "rgba(29,78,216,0.08)", color: "#D97706", border: "1px solid rgba(29,78,216,0.15)" }}>
                            <MapPin size={13} />
                            Gomti Nagar, Lucknow — All Sectors Covered
                        </div>
                        <h1 className="font-extrabold leading-tight mb-3" style={{ fontSize: "clamp(28px,3.8vw,50px)", color: "#0F172A" }}>
                            गोमती नगर में<br />
                            <span className="text-primary">दूध कैन डिलीवरी</span>
                        </h1>
                        <p className="text-base font-medium mb-2 text-primary-dark">
                            20L Milk Delivery — Vibhav Khand to Vijay Khand
                        </p>
                        <p className="text-sm leading-relaxed mb-8" style={{ color: "#334155", maxWidth: "480px" }}>
                            Gomti Nagar ke sabhi sectors mein same-day 20 litre sealed milk delivery. FSSAI certified vendors, live tracking, cash aur online payment.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary">
                                <Droplets size={16} /> अभी Order करें
                            </a>
                            <Link href="/milk-delivery-lucknow"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                                style={{ color: "#D97706", border: "1.5px solid #FDE68A", background: "white" }}>
                                Other Lucknow areas <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sectors Grid */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-1 text-text-title">
                        Gomti Nagar — Coverage Map
                    </h2>
                    <p className="text-sm mb-8 text-text-muted">
                        गोमती नगर के जिन खंडों में हम डिलीवरी करते हैं
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {sectors.map(s => (
                            <div key={s.name}
                                className="rounded-xl border p-4 flex items-start gap-3"
                                style={{ borderColor: "#FDE68A", background: "#FFFBEB" }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary">
                                    <MapPin size={14} style={{ color: "white" }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-primary-dark">{s.name}</p>
                                    <p className="text-xs" style={{ color: "#3B82F6" }}>{s.detail}</p>
                                    <p className="text-xs mt-0.5 text-text-muted">{s.note}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-sm text-text-muted">
                        अपना exact area check करें — <Link href="/milk-delivery-near-me" className="font-semibold underline text-primary">Area Checker →</Link>
                    </p>
                </div>
            </section>

            {/* Process */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-1 text-text-title">Order कैसे करें?</h2>
                    <p className="text-sm mb-10 text-text-muted">Same-day ordering process — Gomti Nagar</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {process.map(p => (
                            <div key={p.step} className="bg-white rounded-xl p-5 border" style={{ borderColor: "#E2E8F0" }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white mb-3 bg-primary">{p.step}</div>
                                <h3 className="font-semibold text-sm mb-1.5 text-text-title">{p.title}</h3>
                                <p className="text-xs leading-relaxed text-text-muted">{p.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vendor Quality */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-text-title">
                                Gomti Nagar ke verified vendors
                            </h2>
                            <p className="text-sm leading-relaxed mb-6 text-text-muted">
                                हर vendor जो Milkdi पर Gomti Nagar में deliver करता है, उसकी पहले जाँच होती है। Address verification, ID proof और first test-order के बाद ही listing active होती है।
                            </p>
                            <div className="space-y-3">
                                {[
                                    [Shield, "ID-verified delivery persons"],
                                    [Droplets, "Factory-sealed 20L cans only"],
                                    [Star, "Minimum 4.0 rating required to stay listed"],
                                    [Clock, "On-time delivery tracked per order"],
                                ].map(([Icon, text]: any) => (
                                    <div key={text} className="flex items-center gap-3 text-sm text-text-body">
                                        <CheckCircle size={16} style={{ color: "#D97706", flexShrink: 0 }} />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-xl p-8 text-center" style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
                            <Droplets size={40} className="mx-auto mb-4 text-primary" />
                            <p className="text-3xl font-bold mb-1 text-primary">4.7 / 5</p>
                            <p className="text-sm font-medium mb-1 text-text-body">Average vendor rating</p>
                            <p className="text-xs text-text-muted">Gomti Nagar area — last 30 days</p>
                            <div className="mt-6 pt-6 border-t" style={{ borderColor: "#FDE68A" }}>
                                <p className="text-2xl font-bold text-primary">94%</p>
                                <p className="text-sm text-text-muted">On-time delivery rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6" style={{ background: "#F8FAFC" }}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-text-title">
                        गोमती नगर — अक्सर पूछे जाते हैं
                    </h2>
                    <p className="text-sm mb-8 text-text-muted">FAQ — Water delivery in Gomti Nagar</p>
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

            {/* CTA */}
            <section className="py-14 px-6 bg-primary">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-bold text-white mb-3">
                        गोमती नगर में दूध चाहिए?
                    </h2>
                    <p className="text-sm text-white/70 mb-6">App download करें और 60 seconds में order करें।</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="https://play.google.com/store/apps/details?id=com.difmo.milkdi"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                            style={{ background: "white", color: "#D97706" }}>
                            <Droplets size={15} /> Download App
                        </a>
                        <a href="tel:+919455791624"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10">
                            <Phone size={15} /> Call करें
                        </a>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
