import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Milkdi — Pure Milk Delivery",
        short_name: "Milkdi",
        description: "Order 100% pure cow and buffalo milk from trusted local dairy farms — delivered fresh to your doorstep.",
        start_url: "/",
        display: "standalone",
        background_color: "#fffbeb",
        theme_color: "#31c980ff",
        orientation: "portrait",
        categories: ["shopping", "food"],
        icons: [
            { src: "/milkdi-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
    }
}
