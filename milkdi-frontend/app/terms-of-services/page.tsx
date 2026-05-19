import type { Metadata } from "next"
import Link from "next/link"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read DIWFA's Terms of Service. These terms govern your use of the Milkdi mobile application, website, and milk delivery services.",
    alternates: { canonical: "https://www.milkdi.com/terms-of-services" },
    openGraph: {
        title: "Terms of Service | Milkdi",
        description: "The terms and conditions governing your use of Milkdi (DIWFA) milk delivery services.",
        url: "https://www.milkdi.com/terms-of-services",
    },
    robots: { index: true, follow: false },
}

const sections = [
    {
        id: "eligibility",
        title: "1. Eligibility",
        body: `You must be at least 18 years old to use the DIWFA Service. By using the Service you represent that you meet this requirement and are legally capable of entering into a binding agreement.`,
    },
    {
        id: "account",
        title: "2. Account Registration",
        body: `To access the Service you may be required to create an account and provide accurate information such as name, email, phone number and delivery address. You are responsible for maintaining confidentiality of your account credentials and for all activities that occur under your account. If you believe your account is compromised, notify us at milkdiservices@gmail.com.`,
    },
    {
        id: "service",
        title: "3. Service Description",
        body: `DIWFA provides a milk delivery platform for ordering and paying for drinking water delivered by verified suppliers. We aim to ensure timely service but delivery times may vary due to weather, traffic, supplier availability or other factors beyond our control.`,
    },
    {
        id: "payments",
        title: "4. Payments",
        body: `Payments are processed through integrated third-party payment gateways. By paying you confirm you are authorized to use the selected payment method. Transactions are final once processed. DIWFA is not liable for third-party payment gateway errors or delays.\n\nRefunds (if applicable) are handled according to our Refund Policy.`,
    },
    {
        id: "responsibilities",
        title: "5. User Responsibilities",
        bullets: [
            "Do not use the Service for unlawful purposes.",
            "Do not interfere with or disrupt the Service.",
            "Provide accurate and up-to-date information.",
            "Do not attempt unauthorized access of systems or other users' data.",
        ],
        footer: "Violations may result in suspension or account termination without prior notice.",
    },
    {
        id: "ip",
        title: "6. Intellectual Property",
        body: `All content, logos and trademarks on the Service are the property of DIWFA or its licensors. You may not copy, modify, distribute or use material from the Service without written permission.`,
    },
    {
        id: "liability",
        title: "7. Limitation of Liability",
        body: `To the fullest extent permitted by law, DIWFA will not be liable for indirect, incidental or consequential damages from use or inability to use the Service, delivery delays, or unauthorized access. Our total liability will not exceed the total amount paid by you for the Service in the preceding one month.`,
    },
    {
        id: "termination",
        title: "8. Termination",
        body: `We may suspend or terminate access to the Service for violation of these Terms or misuse of the platform. You may request account deletion by contacting us at milkdiservices@gmail.com.`,
    },
    {
        id: "changes",
        title: "9. Changes to These Terms",
        body: `We may update these Terms from time to time. Updates will be posted on our app or site, and continued use after posting constitutes acceptance of the revised Terms.`,
    },
    {
        id: "contact",
        title: "10. Contact Information",
        body: `For questions, contact: milkdiservices@gmail.com\n\nDIWFA (Digital Impact Water Foundation Alliance)`,
    },
]

export default function TermsOfServicesPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <PublicNav />

            {/* Hero */}
            <section className="pt-[68px]" style={{ background: "linear-gradient(180deg, #dff6ff 0%, #f0f9ff 100%)" }}>
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <h1 className="font-extrabold mb-3" style={{ fontSize: "clamp(28px,3.5vw,48px)", color: "#0F172A" }}>
                        Terms of Service
                    </h1>
                    <p className="text-sm text-text-muted">
                        Effective Date: <strong>February 16, 2025</strong> &nbsp;·&nbsp; Last Updated: <strong>February 16, 2025</strong>
                    </p>
                    <p className="mt-5 text-sm leading-relaxed max-w-2xl mx-auto text-text-body">
                        These Terms govern your use of <strong>DIWFA</strong> (Digital Impact Water Foundation Alliance) mobile application, website, and related services (the "Service"). By creating an account or using the Service you accept these Terms.
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
                                className="text-xs font-medium px-3 py-1 rounded-lg transition-colors bg-primary-soft text-primary">
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
                                    <p className="text-sm leading-relaxed whitespace-pre-line text-text-muted">{s.body}</p>
                                )}

                                {"bullets" in s && s.bullets && (
                                    <>
                                        <ul className="space-y-2 mb-3">
                                            {s.bullets.map(b => (
                                                <li key={b} className="flex items-start gap-2 text-sm text-text-muted">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                        {"footer" in s && s.footer && (
                                            <p className="text-sm leading-relaxed text-text-muted">{s.footer}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-2xl text-center" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                        <p className="text-sm font-medium mb-1 text-text-title">Questions about these Terms?</p>
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
