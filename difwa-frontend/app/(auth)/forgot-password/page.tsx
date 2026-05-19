"use client"

import { useState } from "react"
import { ArrowRight, Mail, ChevronLeft } from "lucide-react"
import Link from "next/link"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await adminService.forgotPassword(email)
            if (res.success) {
                toast.success("OTP sent to your email")
                router.push(`/reset-password?email=${encodeURIComponent(email)}`)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-5 py-10"
            style={{ background: "#F8FAFC" }}>

            <div className="w-full max-w-[380px]">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <img src="/milkdi-icon.svg" alt="Milkdi" className="w-7 h-7" />
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-base text-text-title">Milkdi</span>
                        <span className="text-[10px] font-semibold tracking-wide mt-0.5 text-primary">Pure Milk. Pure Life.</span>
                    </div>
                </div>

                <div className="mb-7">
                    <h2 className="text-2xl font-bold mb-1 text-text-title">Forgot your password?</h2>
                    <p className="text-sm text-text-muted">
                        Enter your account email and we'll send a one-time code to reset it.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: "#9CA3AF" }} />
                            <input
                                type="email" required autoComplete="email"
                                value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                                style={{ border: "1px solid #D1D5DB", color: "#0F172A", background: "#fff" }}
                                onFocus={e => e.currentTarget.style.border = "1px solid #D97706"}
                                onBlur={e => e.currentTarget.style.border = "1px solid #D1D5DB"}
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-lg transition-all group"
                        style={{ background: loading ? "#93C5FD" : "#D97706" }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1E40AF" }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#D97706" }}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 rounded-full animate-spin"
                                style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                        ) : (
                            <>
                                Send OTP
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <Link href="/login"
                    className="inline-flex items-center gap-1 text-sm mt-6 transition-opacity hover:opacity-70 text-text-muted">
                    <ChevronLeft size={14} />
                    Back to sign in
                </Link>
            </div>
        </div>
    )
}
