import Link from "next/link"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

const sections = [
    {
        title: "1. Information We Collect",
        body: `We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes:

• Name, email address, and phone number
• Delivery address and location data
• Payment information (processed securely via Razorpay — we never store card details)
• Order history and preferences
• Device information and usage data when you use our platform`
    },
    {
        title: "2. How We Use Your Information",
        body: `We use the information we collect to:

• Process and deliver your orders
• Send order confirmations and delivery updates
• Improve our platform and services
• Communicate with you about your account and promotions (with your consent)
• Comply with legal obligations and prevent fraud`
    },
    {
        title: "3. Information Sharing",
        body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:

• Local vendor partners — only the delivery address and order details needed to fulfil your order
• Delivery riders — name and address required for last-mile delivery
• Payment processors (Razorpay) — to process transactions securely
• Law enforcement — when required by applicable law`
    },
    {
        title: "4. Data Retention",
        body: `We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and data at any time by contacting us at milkdiservices@gmail.com. We will delete your data within 30 days, except where we are required by law to retain it.`
    },
    {
        title: "5. Security",
        body: `We take reasonable measures to protect your information, including encryption in transit (TLS), secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
        title: "6. Cookies",
        body: `We use cookies and similar tracking technologies to enhance your experience on our platform. These include session cookies (essential for login) and analytics cookies (to understand usage patterns). You can control cookie settings in your browser.`
    },
    {
        title: "7. Your Rights",
        body: `Under applicable Indian data protection law, you have the right to:

• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Request deletion of your personal data
• Withdraw consent for marketing communications at any time

To exercise these rights, contact us at milkdiservices@gmail.com.`
    },
    {
        title: "8. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a notice on our platform. Continued use of Milkdi after changes are posted constitutes your acceptance of the updated policy.`
    },
    {
        title: "9. Contact Us",
        body: `If you have any questions or concerns about this Privacy Policy, please contact our Data Officer at:

Email: milkdiservices@gmail.com
Address: DIFMO PRIVATE LIMITED., 4/37 Vibhav Khand, Gomti Nagar, Lucknow — 226010`
    },
]

export default function PrivacyPage() {
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
                        Last updated: <strong>1 January 2025</strong>
                    </p>
                    <p className="mt-4 text-sm leading-relaxed max-w-2xl mx-auto text-text-body">
                        DIFMO PRIVATE LIMITED. ("Milkdi", "we", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our platform.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">
                        {sections.map(s => (
                            <div key={s.title}>
                                <h2 className="text-base font-bold mb-3 text-text-title">{s.title}</h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line text-text-muted">{s.body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-2xl text-center" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                        <p className="text-sm font-medium mb-3 text-text-title">Have a privacy question?</p>
                        <Link href="/contact"
                            className="text-sm font-bold text-primary">
                            Contact our team →
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
