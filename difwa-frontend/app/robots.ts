import { MetadataRoute } from "next"

const BASE_URL = "https://www.milkdi.com"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/admin/", "/retailer/", "/login", "/register", "/onboarding", "/forgot-password", "/reset-password"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    }
}
