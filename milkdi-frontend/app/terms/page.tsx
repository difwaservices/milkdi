import Link from "next/link"
import PublicNav from "@/components/layout/PublicNav"
import PublicFooter from "@/components/layout/PublicFooter"

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: `By accessing or using the Milkdi platform (website, mobile app, or any related service), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of our services immediately.`
    },
    {
        title: "2. Eligibility",
        body: `You must be at least 18 years old to create an account or place an order on Milkdi. By using the platform, you represent that you meet this requirement and are legally capable of entering into binding contracts.`
    },
    {
        title: "3. Account Registration",
        body: `To use Milkdi as a vendor (retailer), you must register an account with accurate information including a valid FSSAI license. You are responsible for:

• Keeping your login credentials confidential
• All activity that occurs under your account
• Notifying us immediately of any unauthorized use

Milkdi reserves the right to suspend or terminate accounts that violate these terms.`
    },
    {
        title: "4. Orders and Delivery",
        body: `Orders placed through Milkdi are fulfilled by independent local dairy vendors. Milkdi acts as a technology platform connecting customers with vendors. Milkdi is not responsible for:

• The quality or safety of water (vendors hold FSSAI licenses and are responsible for quality)
• Delivery delays caused by factors outside our control (traffic, weather, etc.)
• Incorrect delivery addresses provided by the customer

However, we strive to resolve all disputes fairly and promptly.`
    },
    {
        title: "5. Payments",
        body: `All payments are processed securely through Razorpay. By making a payment, you authorize Milkdi to charge the stated amount to your selected payment method. Milkdi does not store payment card details.

Vendor payouts are processed after deducting the applicable platform commission as agreed in the vendor onboarding agreement.`
    },
    {
        id: "refund",
        title: "6. Refund & Cancellation Policy",
        body: `Customers:
• Orders may be cancelled within 5 minutes of placement for a full refund.
• After dispatch, cancellations are not accepted.
• Refunds for damaged or incorrect orders will be processed within 5–7 business days upon review.

Vendors:
• Commission charges are non-refundable once an order is marked delivered.
• Subscription fees are non-refundable but may be transferred to a new billing cycle on request.`
    },
    {
        title: "7. Prohibited Conduct",
        body: `You agree not to:

• Provide false information during registration or order placement
• Abuse, harass, or threaten any other user or Milkdi staff
• Manipulate ratings or reviews
• Reverse-engineer or attempt to access non-public parts of the platform
• Use Milkdi for any unlawful purpose`
    },
    {
        title: "8. Vendor Obligations",
        body: `Vendors registered on Milkdi agree to:

• Maintain a valid FSSAI license at all times
• Accurately represent stock levels and pricing
• Fulfil accepted orders in a timely manner
• Maintain hygiene and quality standards as communicated during onboarding
• Not engage in fraudulent transactions or manipulate the platform`
    },
    {
        title: "9. Intellectual Property",
        body: `All content on the Milkdi platform — including logos, text, graphics, software, and trademarks — is the property of DIFMO PRIVATE LIMITED. and protected by applicable IP laws. You may not reproduce, distribute, or create derivative works without our written permission.`
    },
    {
        title: "10. Limitation of Liability",
        body: `To the maximum extent permitted by law, Milkdi shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of revenue, data, or business opportunities.

Our total liability to you for any claim arising from use of Milkdi shall not exceed the amount paid by you in the 30 days preceding the claim.`
    },
    {
        title: "11. Governing Law",
        body: `These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from or related to these Terms shall be subject to the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh.`
    },
    {
        title: "12. Changes to Terms",
        body: `Milkdi reserves the right to update these Terms at any time. We will notify you of material changes via email or a notice on the platform. Continued use after changes take effect constitutes acceptance.`
    },
    {
        title: "13. Contact",
        body: `For questions about these Terms, please contact:

Email: milkdiservices@gmail.com
Address: DIFMO PRIVATE LIMITED., 4/37 Vibhav Khand, Gomti Nagar, Lucknow — 226010`
    },
]

export default function TermsPage() {
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
                        Last updated: <strong>1 January 2025</strong>
                    </p>
                    <p className="mt-4 text-sm leading-relaxed max-w-2xl mx-auto text-text-body">
                        Please read these Terms of Service carefully before using the Milkdi platform. These terms govern your use of our services as a customer or vendor.
                    </p>
                </div>
            </section>

            {/* Quick links */}
            <div className="max-w-3xl mx-auto px-6 pt-10">
                <div className="p-5 rounded-xl" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                    <p className="text-xs font-bold mb-3 uppercase tracking-wider text-text-muted">Quick navigation</p>
                    <div className="flex flex-wrap gap-2">
                        {["Acceptance", "Eligibility", "Accounts", "Orders", "Payments", "Refunds", "Conduct", "Vendors"].map((t, i) => (
                            <a key={t} href={`#section-${i + 1}`}
                                className="text-xs font-medium px-3 py-1 rounded-lg bg-primary-soft text-primary">
                                {t}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-10">
                        {sections.map((s, i) => (
                            <div key={s.title} id={s.id || `section-${i + 1}`}>
                                <h2 className="text-base font-bold mb-3 text-text-title">{s.title}</h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line text-text-muted">{s.body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-2xl text-center" style={{ background: "#F8FAFF", border: "1px solid #E2E8F0" }}>
                        <p className="text-sm font-medium mb-3 text-text-title">Questions about our terms?</p>
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
