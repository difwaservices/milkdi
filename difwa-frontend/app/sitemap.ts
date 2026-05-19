import { MetadataRoute } from "next"

const BASE_URL = "https://www.milkdi.com"

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const publicRoutes = [
        { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/how-it-works", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/products", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/vendors", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
        { url: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" as const },
        { url: "/terms-of-services", priority: 0.4, changeFrequency: "yearly" as const },
        // SEO landing pages
        { url: "/milk-delivery-lucknow", priority: 1.0, changeFrequency: "weekly" as const },
        { url: "/milk-delivery-gomti-nagar", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/pure-milk-delivery", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/milk-delivery-near-me", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/become-a-milk-vendor-lucknow", priority: 0.9, changeFrequency: "monthly" as const },
        // Hyperlocal area pages
        { url: "/milk-delivery-indira-nagar", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/milk-delivery-hazratganj", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/milk-delivery-aliganj", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/milk-delivery-mahanagar", priority: 0.9, changeFrequency: "weekly" as const },
        { url: "/milk-delivery-alambagh", priority: 0.9, changeFrequency: "weekly" as const },
    ]

    return publicRoutes.map(route => ({
        url: `${BASE_URL}${route.url}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))
}
