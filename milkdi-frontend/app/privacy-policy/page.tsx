import type { Metadata } from "next"
import Link from "next/link"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read DIWFA's Privacy Policy. Learn how we collect, use, and protect your personal information when you use our milk delivery platform.",
    alternates: { canonical: "https://www.milkdi.com/privacy-policy" },
    openGraph: {
        title: "Privacy Policy | Milkdi",
        description: "Our commitment to protecting your privacy. Read how Milkdi (DIWFA) handles your personal data.",
        url: "https://www.milkdi.com/privacy-policy",
    },
    robots: { index: true, follow: false },
}

const sections = [
    {
        id: "information-collected",
        title: "1. Types of Information We May Collect from You",
        body: "We may collect, store, and use the following kinds of personal information about individuals who visit and use our website and social media sites:",
        bullets: [
            "Information you supply to us, including when you submit a contact/inquiry form. This may include your name, address, e-mail address, and phone number.",
        ],
    },
    {
        id: "how-we-use",
        title: "2. How We May Use the Information We Collect",
        bullets: [
            "To provide you with information and/or services that you request from us.",
            "To contact you to provide the information requested.",
        ],
    },
    {
        id: "disclosure",
        title: "3. Disclosure of Your Information",
        body: "Any information you provide to us will either be emailed directly to us or may be stored on a secure server. We do not rent, sell, or share personal information about you with other people or non-affiliated companies. We will use all reasonable efforts to ensure that your personal data is not disclosed unless required by law or regulations.",
    },
    {
        id: "rights",
        title: "4. Your Rights – Access to Your Personal Data",
        body: `You have the right to ensure that your personal data is being processed lawfully ("Subject Access Right"). Any subject access request must be made in writing to DIWFA at the contact address below.`,
    },
    {
        id: "changes",
        title: "5. Changes to Our Privacy Policy",
        body: "Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by e-mail.",
    },
    {
        id: "contact",
        title: "6. Contact",
        body: "If you have any questions, comments, or concerns about this Privacy Policy, please contact us at:",
        email: "milkdiservices@gmail.com",
    },
]

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #f0f9ff 100%)" }}>
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <h1 className="font-extrabold mb-3" style={{ fontSize: "clamp(28px,3.5vw,48px)", color: "#0F172A" }}>
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-text-muted">
                        Effective Date: <strong>February 16, 2025</strong>&nbsp;·&nbsp;Last Updated: <strong>February 16, 2025</strong>
                    </p>
                    <p className="mt-5 text-sm leading-relaxed max-w-2xl mx-auto text-text-body">
                        This Privacy Policy is prepared by <strong>DIWFA</strong> (Digital Impact Water Foundation Alliance) ("We", "Us", or "Our"). We are committed to protecting and preserving the privacy of our visitors when visiting our site or communicating electronically with us.
                    </p>
                </div>
            </section>

            {/* Quick nav */}
            <div className="max-w-3xl mx-auto px-6 pt-10">
                <div className="p-5 rounded-xl" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                    <p className="text-xs font-bold mb-3 uppercase tracking-wider text-text-muted">Jump to section</p>
                    <div className="flex flex-wrap gap-2">
                        {sections.map(s => (
                            <a key={s.id} href={`#${s.id}`}
                                className="text-xs font-medium px-3 py-1 rounded-lg bg-primary-soft text-primary">
                                {s.title.replace(/^\d+\.\s/, "")}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">
                        {sections.map(s => (
                            <div key={s.id} id={s.id} className="scroll-mt-24">
                                <h2 className="text-base font-bold mb-3 text-text-title">{s.title}</h2>

                                {"body" in s && s.body && (
                                    <p className="text-sm leading-relaxed mb-3 text-text-muted">{s.body}</p>
                                )}

                                {"bullets" in s && s.bullets && (
                                    <ul className="space-y-2 mb-3">
                                        {s.bullets.map(b => (
                                            <li key={b} className="flex items-start gap-2 text-sm text-text-muted">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {"email" in s && s.email && (
                                    <a href={`mailto:${s.email}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold mt-1 text-primary">
                                        📧 {s.email}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* App Access Instructions */}
                    <div className="mt-12 rounded-2xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                        <div className="px-6 py-4" style={{ background: "#FFFBEB", borderBottom: "1px solid #FEF3C7" }}>
                            <h3 className="text-sm font-bold text-text-title">App Access Instructions</h3>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-sm mb-4 text-text-muted">
                                The user enters their identifier, such as an Email address and Password, associated with their account:
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                                    <span className="text-base">📩</span>
                                    <div>
                                        <p className="text-xs font-semibold text-text-muted">Email</p>
                                        <p className="text-sm font-bold text-text-title">testmilkdi@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                                    <span className="text-base">🔐</span>
                                    <div>
                                        <p className="text-xs font-semibold text-text-muted">Password</p>
                                        <p className="text-sm font-bold text-text-title">Testmilkdi@123</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                        <p className="text-sm font-medium mb-1 text-text-title">Questions about this policy?</p>
                        <a href="mailto:milkdiservices@gmail.com" className="text-sm font-bold text-primary">
                            milkdiservices@gmail.com
                        </a>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
