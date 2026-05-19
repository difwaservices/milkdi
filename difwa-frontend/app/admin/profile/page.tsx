"use client"

import { useState, useEffect } from "react"
import { Mail, Lock, CheckCircle2, AlertCircle, Save, Eye, EyeOff } from "lucide-react"
import adminService from "@/data/services/adminService"
import { toast } from "sonner"
import useAuthStore from "@/data/store/useAuthStore"
import { cn } from "@/lib/utils"

export default function RootProfilePage() {
    const { user, setUser } = useAuthStore()
    const [mounted, setMounted] = useState(false)

    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPwd, setShowPwd] = useState(false)

    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (user?.email) setEmail(user.email)
    }, [user])

    if (!mounted) return null

    const permissions = user?.permissions && user.permissions.length > 0
        ? user.permissions
        : (user?.roleId?.permissions || [])

    if (!permissions.includes("ALL")) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-border-custom shadow-sm text-center my-12 mx-auto max-w-lg">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={28} />
                </div>
                <h2 className="text-xl font-bold">Access Restricted</h2>
                <p className="text-text-muted mt-2 text-sm">Only the root administrator can access this section.</p>
            </div>
        )
    }

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return toast.error("Email cannot be empty")
        if (email === user?.email) return toast.info("That's already your email")
        setIsUpdatingEmail(true)
        try {
            const res = await adminService.updateAdminProfile(email)
            if (res.success) {
                toast.success("Email updated")
                if (setUser && res.data) setUser({ ...user, email: res.data.email })
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update email")
        } finally {
            setIsUpdatingEmail(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentPassword) return toast.error("Enter your current password")
        if (!newPassword) return toast.error("Enter a new password")
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match")
        if (newPassword.length < 6) return toast.error("Password must be at least 6 characters")
        setIsUpdatingPassword(true)
        try {
            const res = await adminService.changePassword(currentPassword, newPassword)
            if (res.success) {
                toast.success("Password updated successfully")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password")
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-sm text-text-muted mt-0.5">Manage your admin login credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="bg-white rounded-2xl border border-border-custom overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-custom flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Mail size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold">Email Address</h2>
                            <p className="text-xs text-text-muted">Login and notification email</p>
                        </div>
                    </div>
                    <form onSubmit={handleUpdateEmail} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@milkdi.com"
                                className="w-full px-4 py-2.5 bg-background-soft border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdatingEmail || email === user?.email}
                            className={cn(
                                "w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                                email !== user?.email
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-background-soft text-text-muted cursor-not-allowed"
                            )}
                        >
                            {isUpdatingEmail ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : email === user?.email ? (
                                <><CheckCircle2 size={16} /> Up to date</>
                            ) : (
                                <><Save size={16} /> Save Email</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Password */}
                <div className="bg-white rounded-2xl border border-border-custom overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-custom flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold">Password</h2>
                            <p className="text-xs text-text-muted">Change your login password</p>
                        </div>
                    </div>
                    <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">Current Password</label>
                            <input
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-background-soft border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="w-full pl-4 pr-10 py-2.5 bg-background-soft border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                                />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground">
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">Confirm New Password</label>
                            <input
                                type={showPwd ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-background-soft border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                            <CheckCircle2 size={13} className={cn(newPassword.length >= 6 ? "text-green-500" : "text-gray-300")} />
                            <span className="text-xs text-text-muted">At least 6 characters</span>
                            <CheckCircle2 size={13} className={cn(newPassword && newPassword === confirmPassword ? "text-green-500" : "text-gray-300")} />
                            <span className="text-xs text-text-muted">Passwords match</span>
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                            className={cn(
                                "w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                                currentPassword && newPassword && confirmPassword
                                    ? "bg-gray-900 text-white hover:bg-black"
                                    : "bg-background-soft text-text-muted cursor-not-allowed"
                            )}
                        >
                            {isUpdatingPassword ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Lock size={15} /> Update Password</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
