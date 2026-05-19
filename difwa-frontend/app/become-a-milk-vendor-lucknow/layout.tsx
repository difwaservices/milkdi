import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Become a Dairy Vendor in Lucknow | Sell Water Online | Milkdi",
    description: "अपना दूध का बिज़नेस Milkdi पर लाएं। Lucknow में dairy vendor बनें, ₹15,000–₹50,000/month कमाएं। Free registration, instant payouts, rider management — सब एक app में।",
    keywords: [
        "dairy vendor Lucknow", "sell water online Lucknow", "milk delivery business Lucknow",
        "दूध का बिज़नेस लखनऊ", "milk supplier registration", "Milkdi vendor registration",
        "water business income", "earn from milk delivery",
    ],
    alternates: { canonical: "https://www.milkdi.com/become-a-milk-vendor-lucknow" },
    openGraph: {
        title: "Become a Dairy Vendor in Lucknow | Earn ₹15,000–₹50,000/month | Milkdi",
        description: "Lucknow में dairy vendor बनें। Free listing, instant payouts, live order dashboard। अभी register करें।",
        url: "https://www.milkdi.com/become-a-milk-vendor-lucknow",
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
