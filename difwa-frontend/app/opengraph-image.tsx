import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Milkdi — Pure Milk Delivery Platform"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Logo area */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "20px",
                            background: "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "40px",
                        }}
                    >
                        🥛
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "64px", fontWeight: 800, color: "white", lineHeight: 1 }}>MILKDI</span>
                        <span style={{ fontSize: "22px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
                            Pure Milk. Daily Fresh.
                        </span>
                    </div>
                </div>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: "28px",
                        color: "rgba(255,255,255,0.9)",
                        textAlign: "center",
                        maxWidth: "700px",
                        lineHeight: 1.4,
                        margin: 0,
                    }}
                >
                    100% pure cow and buffalo milk delivered fresh to your doorstep daily.
                </p>

                {/* Bottom badge */}
                <div
                    style={{
                        marginTop: "48px",
                        padding: "12px 32px",
                        borderRadius: "100px",
                        background: "rgba(255,255,255,0.15)",
                        border: "1.5px solid rgba(255,255,255,0.3)",
                        fontSize: "18px",
                        color: "white",
                        fontWeight: 600,
                    }}
                >
                    www.milkdi.com
                </div>
            </div>
        ),
        { ...size }
    )
}
