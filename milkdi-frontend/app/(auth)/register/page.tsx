"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthStore from "@/data/store/useAuthStore"

export default function RegisterPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const { register, loading, error: storeError } = useAuthStore()
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await register(formData)
            router.push("/onboarding")
        } catch { /* handled by store */ }
    }

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

    const inputClass = "w-full py-2.5 rounded-lg text-sm transition-all outline-none border border-gray-300 text-text-title bg-white focus:border-primary"

    return (
        <div className="min-h-screen flex overflow-x-hidden" style={{ background: "#ffffff" }}>

            {/* Left — brand panel */}
            <div className="hidden lg:flex flex-col w-[440px] xl:w-[500px] flex-shrink-0 relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #052e16 0%, #14532D 50%, #166534 100%)" }}>

                {/* Organic texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
                    style={{ backgroundImage: "radial-gradient(circle at 15% 85%, #86EFAC 0%, transparent 55%), radial-gradient(circle at 85% 15%, #4ADE80 0%, transparent 55%)" }} />

                {/* Delivery illustration */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
                    <img
                        src="/milkdi-man.png"
                        alt="Milkdi milk delivery"
                        className="w-full select-none"
                        style={{ maxWidth: "460px", objectFit: "contain", objectPosition: "bottom" }}
                        draggable={false}
                    />
                </div>

                {/* Top fade */}
                <div className="absolute top-0 inset-x-0 pointer-events-none"
                    style={{ height: "220px", background: "linear-gradient(180deg, #052e16 0%, rgba(5,46,22,0.8) 60%, transparent 100%)" }} />

                {/* Bottom fade */}
                <div className="absolute bottom-0 inset-x-0 pointer-events-none"
                    style={{ height: "320px", background: "linear-gradient(0deg, #052e16 0%, rgba(5,46,22,0.95) 45%, transparent 100%)" }} />

                {/* Foreground content */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    <div className="px-10 pt-10 shrink-0">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-light/15 border border-primary-light/25">
                                <img src="/milkdi-icon.svg" alt="Milkdi" className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold text-white">Milkdi</span>
                                <span className="text-[10px] font-semibold tracking-wide mt-0.5 text-primary-light">Pure Milk. Pure Life.</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1" />

                    <div className="px-10 pb-10 shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 bg-primary-light/10 text-white/90 border border-primary-light/20">
                            🐄 For Dairy Vendors
                        </div>
                        <h1 className="text-3xl font-extrabold leading-[1.2] mb-5 text-white">
                            Start delivering<br />
                            pure milk with{" "}
                            <span className="text-primary-light">Milkdi</span>
                        </h1>
                        <div className="space-y-2.5 mb-7">
                            {[
                                "Vendor verification within 24 hours",
                                "Real-time order & rider management",
                                "Razorpay payments built in",
                                "Dedicated dairy support team",
                            ].map(item => (
                                <div key={item} className="flex items-center gap-2.5">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-light/20">
                                        <svg viewBox="0 0 10 8" className="w-2 h-2" fill="none">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="#86EFAC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>{item}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>© 2026 Milkdi Technologies Pvt. Ltd.</p>
                    </div>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-12">
                <div className="w-full max-w-[380px]">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <img src="/milkdi-icon.svg" alt="Milkdi" className="w-7 h-7" />
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-base text-text-title">Milkdi</span>
                            <span className="text-[10px] font-semibold tracking-wide mt-0.5 text-primary">Pure Milk. Pure Life.</span>
                        </div>
                    </div>

                    <div className="mb-7">
                        <h2 className="text-2xl font-bold mb-1 text-text-title">Create your account</h2>
                        <p className="text-sm text-text-muted">
                            Already registered?{" "}
                            <Link href="/login" className="font-semibold transition-opacity hover:opacity-70 text-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {storeError && (
                        <div className="mb-5 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
                            style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
                            <span className="shrink-0 mt-0.5">⚠</span>
                            <span>{storeError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Full name</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: "#9CA3AF" }} />
                                <input
                                    name="name" required autoComplete="name"
                                    value={formData.name} onChange={set("name")}
                                    placeholder="Ravi Kumar"
                                    className={`${inputClass} pl-10 pr-4`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Email address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: "#9CA3AF" }} />
                                <input
                                    name="email" type="email" required autoComplete="email"
                                    value={formData.email} onChange={set("email")}
                                    placeholder="you@example.com"
                                    className={`${inputClass} pl-10 pr-4`}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Mobile number</label>
                            <div className="flex">
                                <span className="inline-flex items-center gap-1 pl-3 pr-2.5 text-sm rounded-l-lg flex-shrink-0 select-none bg-gray-50 border border-gray-300 border-r-0 text-gray-500">
                                    <Phone size={13} />+91
                                </span>
                                <input
                                    name="phone" type="tel" required autoComplete="tel"
                                    value={formData.phone} onChange={set("phone")}
                                    placeholder="94557 91624"
                                    className="flex-1 px-4 py-2.5 rounded-r-lg text-sm outline-none transition-all border border-gray-300 text-text-title bg-white focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: "#9CA3AF" }} />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required autoComplete="new-password"
                                    value={formData.password} onChange={set("password")}
                                    placeholder="Min. 6 characters"
                                    className={`${inputClass} pl-10 pr-10`}
                                />
                                <button type="button" tabIndex={-1}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                                    style={{ color: "#9CA3AF" }}>
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            className={cn("w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-lg transition-all group mt-1", loading ? "bg-primary-light" : "bg-primary hover:bg-primary-dark")}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 rounded-full animate-spin"
                                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-5 text-xs text-center" style={{ color: "#9CA3AF" }}>
                        By registering you agree to our{" "}
                        <Link href="/terms-of-services" className="underline underline-offset-2" style={{ color: "#6B7280" }}>terms of service</Link>
                        {" "}and{" "}
                        <Link href="/privacy-policy" className="underline underline-offset-2" style={{ color: "#6B7280" }}>privacy policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    )
}
