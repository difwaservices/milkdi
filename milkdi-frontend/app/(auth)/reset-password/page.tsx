"use client"

import { useState, Suspense } from "react"
import { Lock, ArrowRight, Eye, EyeOff, ChevronLeft, KeyRound } from "lucide-react"
import { useSearchParams } from "next/navigation"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const inputClass = "w-full py-2.5 rounded-lg text-sm outline-none transition-all"
    const inputStyle = { border: "1px solid #D1D5DB", color: "#0F172A", background: "#fff" }
    const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
        (e.currentTarget.style.border = "1px solid #D97706")
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
        (e.currentTarget.style.border = "1px solid #D1D5DB")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match")
        setLoading(true)
        try {
            const res = await adminService.resetPassword(email, otp, newPassword)
            if (res.success) {
                toast.success("Password reset. Please sign in.")
                router.push("/login")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* OTP */}
            <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">OTP code</label>
                <div className="relative">
                    <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#9CA3AF" }} />
                    <input
                        type="text" required maxLength={6} autoComplete="one-time-code"
                        value={otp} onChange={e => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className={`${inputClass} pl-10 pr-4 tracking-[0.18em]`}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    />
                </div>
                {email && (
                    <p className="text-xs mt-1.5" style={{ color: "#9CA3AF" }}>Sent to {email}</p>
                )}
            </div>

            {/* New password */}
            <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">New password</label>
                <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#9CA3AF" }} />
                    <input
                        type={showPassword ? "text" : "password"} required
                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className={`${inputClass} pl-10 pr-10`}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    />
                    <button type="button" tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                        style={{ color: "#9CA3AF" }}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                </div>
            </div>

            {/* Confirm password */}
            <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Confirm new password</label>
                <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#9CA3AF" }} />
                    <input
                        type={showPassword ? "text" : "password"} required
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass} pl-10 pr-4`}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    />
                </div>
            </div>

            <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-lg transition-all group mt-1"
                style={{ background: loading ? "#93C5FD" : "#D97706" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1E40AF" }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#D97706" }}
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                ) : (
                    <>
                        <Lock size={13} />
                        Reset password
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                )}
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
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
                    <h2 className="text-2xl font-bold mb-1 text-text-title">Set a new password</h2>
                    <p className="text-sm text-text-muted">
                        Enter the OTP sent to your email along with your new password.
                    </p>
                </div>

                <Suspense fallback={
                    <div className="text-sm py-4 text-center" style={{ color: "#9CA3AF" }}>Loading…</div>
                }>
                    <ResetPasswordForm />
                </Suspense>

                <Link href="/login"
                    className="inline-flex items-center gap-1 text-sm mt-6 transition-opacity hover:opacity-70 text-text-muted">
                    <ChevronLeft size={14} />
                    Back to sign in
                </Link>
            </div>
        </div>
    )
}
