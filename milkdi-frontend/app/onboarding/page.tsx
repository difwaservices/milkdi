"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Building2, MapPin, FileText, CheckCircle2,
    ArrowRight, ArrowLeft, Upload, ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import fileService from "@/data/services/fileService"
import authService from "@/data/services/authService"
import useAuthStore from "@/data/store/useAuthStore"
import { toast } from "sonner"

const steps = [
    { id: "owner", title: "Owner Details", icon: CheckCircle2 },
    { id: "store", title: "Store Details", icon: Building2 },
    { id: "legal", title: "Business & Legal", icon: FileText }
]

const statesAndCities: { [key: string]: string[] } = {
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Ghaziabad", "Prayagraj", "Noida", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "South West Delhi"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai", "Solapur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Vijayapura", "Shivamogga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Ambattur", "Tirunelveli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh"],
    "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda"]
}

const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())

const restrictToDigits = (str: string) => str.replace(/\D/g, "")

const validateGST = (gst: string) =>
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)

const inputBase = "w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
const inputNormal = { border: "1px solid #E2E8F0", color: "#0F172A", background: "#fff" }
const inputError = { border: "1px solid #FCA5A5", color: "#0F172A", background: "#FFF5F5" }

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

export default function OnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const licenseInputRef = useRef<HTMLInputElement>(null)
    const gstInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
    const [locating, setLocating] = useState(false)

    const [formData, setFormData] = useState({
        ownerName: "",
        alternateContact: "",
        whatsappNumber: "",
        businessName: "",
        storeDisplayName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        lat: null as number | null,
        lng: null as number | null,
        yearsInBusiness: "",
        monthlyPurchaseVolume: "",
        gst: "",
        fssai: "",
        licenseUrl: "",
        gstCertificateUrl: "",
        agreed: false
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        const id = localStorage.getItem("userId")
        if (!id) { router.push("/register"); return }
        setUserId(id)
    }, [router])

    const clearError = (field: string) =>
        setErrors(prev => { const e = { ...prev }; delete e[field]; return e })

    const validateStep = () => {
        const e: { [key: string]: string } = {}
        if (currentStep === 0) {
            if (!formData.ownerName.trim()) e.ownerName = "Owner name is required"
            if (!formData.whatsappNumber) e.whatsappNumber = "WhatsApp number is required"
            else if (formData.whatsappNumber.length !== 10) e.whatsappNumber = "Must be 10 digits"
            if (formData.alternateContact && formData.alternateContact.length !== 10) e.alternateContact = "Must be 10 digits"
        }
        if (currentStep === 1) {
            if (!formData.businessName.trim()) e.businessName = "Store name is required"
            if (!formData.addressLine1.trim()) e.addressLine1 = "Address Line 1 is required"
            if (!formData.addressLine2.trim()) e.addressLine2 = "Area / Locality is required"
            if (!formData.state) e.state = "State is required"
            if (!formData.city) e.city = "City is required"
            if (!formData.pincode) e.pincode = "Pincode is required"
            else if (formData.pincode.length !== 6) e.pincode = "Must be 6 digits"
        }
        if (currentStep === 2) {
            if (formData.gst && !validateGST(formData.gst)) e.gst = "Invalid GST format (15-digit GSTIN)"
            if (formData.fssai && formData.fssai.length !== 14) e.fssai = "Must be 14 digits"
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleNext = () => {
        if (validateStep()) setCurrentStep(s => s + 1)
        else toast.error("Please fix the errors before proceeding")
    }

    const handleBack = () => setCurrentStep(s => s - 1)

    const handleInputChange = (field: string, value: string) => {
        let v = value
        if (["ownerName", "businessName", "storeDisplayName"].includes(field)) v = toTitleCase(value)
        else if (["alternateContact", "whatsappNumber", "pincode", "fssai"].includes(field)) {
            v = restrictToDigits(value)
            if (["alternateContact", "whatsappNumber"].includes(field)) v = v.slice(0, 10)
            if (field === "pincode") v = v.slice(0, 6)
            if (field === "fssai") v = v.slice(0, 14)
        } else if (field === "gst") {
            v = value.toUpperCase().slice(0, 15)
        }
        setFormData(prev => ({ ...prev, [field]: v }))
        clearError(field)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "licenseUrl" | "gstCertificateUrl") => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(prev => ({ ...prev, [field]: true }))
        try {
            const data = await fileService.upload(file)
            setFormData(prev => ({ ...prev, [field]: data.url }))
            toast.success("File uploaded successfully")
        } catch {
            toast.error("Upload failed. Please try again.")
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }))
        }
    }

    const handleGetLocation = () => {
        if (!navigator.geolocation) { toast.error("Geolocation not supported"); return }

        setLocating(true)
        toast.info("Fetching your address…")
        navigator.geolocation.getCurrentPosition(
            async pos => {
                const { latitude: lat, longitude: lng } = pos.coords
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                        { headers: { "Accept-Language": "en" } }
                    )
                    const data = await res.json()
                    const addr = data?.address || {}

                    const localityParts = [
                        addr.road,
                        addr.neighbourhood,
                        addr.suburb,
                        addr.quarter,
                        addr.hamlet,
                        addr.county
                    ].filter(Boolean)
                    const locality: string = localityParts.length > 0
                        ? localityParts.join(", ")
                        : (data?.display_name || "")

                    const detectedState: string = addr.state || ""
                    const detectedCity: string = addr.city || addr.town || addr.village || addr.county || ""
                    const detectedPincode: string = (addr.postcode || "").toString().replace(/\D/g, "").slice(0, 6)
                    const supportedStates = Object.keys(statesAndCities)
                    const matchedState = supportedStates.find(s => s.toLowerCase() === detectedState.toLowerCase()) || ""
                    const matchedCity = matchedState
                        ? (statesAndCities[matchedState].find(c => c.toLowerCase() === detectedCity.toLowerCase()) || "")
                        : ""

                    setFormData(prev => ({
                        ...prev,
                        lat,
                        lng,
                        addressLine2: locality || prev.addressLine2,
                        state: matchedState || prev.state,
                        city: matchedState ? matchedCity : prev.city,
                        pincode: detectedPincode.length === 6 ? detectedPincode : prev.pincode
                    }))
                    if (locality) clearError("addressLine2")
                    if (matchedState) clearError("state")
                    if (matchedState && matchedCity) clearError("city")
                    if (detectedPincode.length === 6) clearError("pincode")

                    toast.success(locality ? "Location filled — please verify and edit if needed" : "Location captured — please enter address manually")
                } catch {
                    setFormData(prev => ({ ...prev, lat, lng }))
                    toast.warning("Network error — please type your address manually")
                } finally {
                    setLocating(false)
                }
            },
            err => {
                setLocating(false)
                if (err.code === err.PERMISSION_DENIED) toast.error("Permission denied. Enable location access in your browser.")
                else if (err.code === err.POSITION_UNAVAILABLE) toast.error("Location unavailable. Check your GPS or connection.")
                else if (err.code === err.TIMEOUT) toast.error("Location request timed out. Please try again.")
                else toast.error("Failed to get location.")
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateStep()) return
        setLoading(true)
        try {
            await authService.updateOnboarding({
                userId,
                alternateContact: formData.alternateContact,
                whatsappNumber: formData.whatsappNumber,
                businessDetails: {
                    businessName: formData.businessName,
                    storeDisplayName: formData.storeDisplayName || formData.businessName,
                    ownerName: formData.ownerName,
                    yearsInBusiness: formData.yearsInBusiness,
                    monthlyPurchaseVolume: formData.monthlyPurchaseVolume,
                    location: {
                        address: [formData.addressLine1, formData.addressLine2].filter(Boolean).join(", "),
                        addressLine1: formData.addressLine1,
                        addressLine2: formData.addressLine2,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        landmark: formData.landmark,
                        coordinates: formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : undefined
                    },
                    legal: {
                        gst: formData.gst,
                        fssai: formData.fssai,
                        licenseUrl: formData.licenseUrl,
                        gstCertificateUrl: formData.gstCertificateUrl
                    }
                }
            })
            const user = useAuthStore.getState().user
            if (user) {
                useAuthStore.getState().setUser({
                    ...user,
                    status: "under_review",
                    businessDetails: {
                        ...user.businessDetails,
                        businessName: formData.businessName,
                        location: {
                            address: [formData.addressLine1, formData.addressLine2].filter(Boolean).join(", "),
                            addressLine1: formData.addressLine1,
                            addressLine2: formData.addressLine2,
                            city: formData.city,
                            state: formData.state,
                            pincode: formData.pincode,
                            landmark: formData.landmark,
                            coordinates: formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : undefined
                        }
                    }
                })
            }
            localStorage.setItem("status", "under_review")
            window.location.href = "/retailer/status"
        } catch (error: any) {
            toast.error(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white">

            {/* Left sidebar — desktop only */}
            <div className="hidden lg:flex flex-col w-[300px] xl:w-[340px] flex-shrink-0 relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0C1A3B 0%, #1140A0 50%, #0284C7 100%)" }}>

                <div className="px-8 pt-9 pb-0">
                    <Link href="/" className="flex items-center gap-2.5">
                        <img src="/milkdi-icon.svg" alt="Milkdi" className="w-8 h-8" />
                        <div className="flex flex-col leading-none">
                            <span className="text-base font-bold text-white">Milkdi</span>
                            <span className="text-[10px] font-semibold tracking-wide mt-0.5 text-sky-300">Pure Milk. Pure Life.</span>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center px-8">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "rgba(186,230,253,0.55)" }}>
                        Vendor Registration
                    </p>
                    <h2 className="text-xl font-bold text-white mb-10 leading-snug">
                        Complete your<br />business profile
                    </h2>

                    {/* Step list */}
                    <div>
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex gap-3.5">
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all text-sm",
                                        idx < currentStep
                                            ? "bg-[#7DD3FC] text-[#0C1A3B]"
                                            : idx === currentStep
                                                ? "bg-white text-[#1140A0]"
                                                : "bg-white/10 text-white/30"
                                    )}>
                                        {idx < currentStep
                                            ? <CheckCircle2 size={15} />
                                            : <step.icon size={15} />}
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="w-px flex-1 my-1"
                                            style={{ minHeight: 28, background: idx < currentStep ? "rgba(125,211,252,0.35)" : "rgba(255,255,255,0.1)" }} />
                                    )}
                                </div>
                                <div className="pb-7 pt-1">
                                    <p className={cn(
                                        "text-sm font-semibold",
                                        idx === currentStep ? "text-white"
                                            : idx < currentStep ? "text-[#7DD3FC]"
                                                : "text-white/30"
                                    )}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="px-8 pb-8 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    © 2025 DIFMO PRIVATE LIMITED.
                </p>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Mobile top bar */}
                <div className="lg:hidden sticky top-0 z-30 bg-white" style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <div className="px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/milkdi-icon.svg" alt="Milkdi" className="w-6 h-6" />
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-sm text-text-title">Milkdi</span>
                                <span className="text-[9px] font-semibold tracking-wide mt-0.5 text-primary">Pure Milk. Pure Life.</span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-text-muted">
                            {steps[currentStep].title} · {currentStep + 1}/{steps.length}
                        </span>
                    </div>
                    <div className="h-0.5 bg-slate-100">
                        <div className="h-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%`, background: "#D97706" }} />
                    </div>
                </div>

                {/* Form scroll container */}
                <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
                    <div className="max-w-lg w-full mx-auto">

                        {/* Step header */}
                        <div className="mb-7">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5 text-primary">
                                Step {currentStep + 1} of {steps.length}
                            </p>
                            <h1 className="text-xl font-bold text-text-title">
                                {steps[currentStep].title}
                            </h1>
                        </div>

                        {/* Mobile step dots */}
                        <div className="flex items-center gap-1.5 mb-7 lg:hidden">
                            {steps.map((_, i) => (
                                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                                    style={{ background: i <= currentStep ? "#D97706" : "#E2E8F0" }} />
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* ── Step 0: Owner Details ── */}
                            {currentStep === 0 && (
                                <div className="space-y-5">
                                    <Field label="Owner Full Name *" error={errors.ownerName}>
                                        <input
                                            required
                                            value={formData.ownerName}
                                            onChange={e => handleInputChange("ownerName", e.target.value)}
                                            placeholder="Full legal name"
                                            className={inputBase}
                                            style={errors.ownerName ? inputError : inputNormal}
                                            onFocus={e => !errors.ownerName && (e.currentTarget.style.border = "1px solid #D97706")}
                                            onBlur={e => !errors.ownerName && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                        />
                                    </Field>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="WhatsApp Number *" error={errors.whatsappNumber}>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                                                    style={{ color: "#9CA3AF" }}>+91</span>
                                                <input
                                                    required
                                                    value={formData.whatsappNumber}
                                                    onChange={e => handleInputChange("whatsappNumber", e.target.value)}
                                                    placeholder="10-digit number"
                                                    className={`${inputBase} pl-10`}
                                                    style={errors.whatsappNumber ? inputError : inputNormal}
                                                    onFocus={e => !errors.whatsappNumber && (e.currentTarget.style.border = "1px solid #D97706")}
                                                    onBlur={e => !errors.whatsappNumber && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                                />
                                            </div>
                                        </Field>
                                        <Field label="Alternate Contact" error={errors.alternateContact}>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                                                    style={{ color: "#9CA3AF" }}>+91</span>
                                                <input
                                                    value={formData.alternateContact}
                                                    onChange={e => handleInputChange("alternateContact", e.target.value)}
                                                    placeholder="Optional"
                                                    className={`${inputBase} pl-10`}
                                                    style={errors.alternateContact ? inputError : inputNormal}
                                                    onFocus={e => !errors.alternateContact && (e.currentTarget.style.border = "1px solid #D97706")}
                                                    onBlur={e => !errors.alternateContact && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                                />
                                            </div>
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 1: Store Details ── */}
                            {currentStep === 1 && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Store Name *" error={errors.businessName}>
                                            <input
                                                required
                                                value={formData.businessName}
                                                onChange={e => handleInputChange("businessName", e.target.value)}
                                                placeholder="e.g. Gourmet Water"
                                                className={inputBase}
                                                style={errors.businessName ? inputError : inputNormal}
                                                onFocus={e => !errors.businessName && (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => !errors.businessName && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                        <Field label="Display Name (optional)">
                                            <input
                                                value={formData.storeDisplayName}
                                                onChange={e => handleInputChange("storeDisplayName", e.target.value)}
                                                placeholder="Public-facing name"
                                                className={inputBase}
                                                style={inputNormal}
                                                onFocus={e => (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Address Line 1 *" error={errors.addressLine1}>
                                        <input
                                            required
                                            value={formData.addressLine1}
                                            onChange={e => handleInputChange("addressLine1", e.target.value)}
                                            placeholder="Shop no., building, floor, street"
                                            className={inputBase}
                                            style={errors.addressLine1 ? inputError : inputNormal}
                                            onFocus={e => !errors.addressLine1 && (e.currentTarget.style.border = "1px solid #D97706")}
                                            onBlur={e => !errors.addressLine1 && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                        />
                                    </Field>

                                    <Field label="Area / Locality *" error={errors.addressLine2}>
                                        <div className="relative">
                                            <input
                                                required
                                                value={formData.addressLine2}
                                                onChange={e => handleInputChange("addressLine2", e.target.value)}
                                                placeholder="Auto-filled from location, editable"
                                                className={`${inputBase} pr-36`}
                                                style={errors.addressLine2 ? inputError : inputNormal}
                                                onFocus={e => !errors.addressLine2 && (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => !errors.addressLine2 && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleGetLocation}
                                                disabled={locating}
                                                title="Fill area & nearby fields from your current location"
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-60"
                                                style={{
                                                    background: formData.lat && formData.lng ? "#FFFBEB" : "#F8FAFF",
                                                    color: "#D97706",
                                                    border: "1px solid #FDE68A"
                                                }}
                                            >
                                                <MapPin size={12} className={locating ? "animate-pulse" : ""} />
                                                {locating ? "Locating…" : formData.lat && formData.lng ? "Update" : "Use current"}
                                            </button>
                                        </div>
                                    </Field>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="State *" error={errors.state}>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={formData.state}
                                                    onChange={e => {
                                                        handleInputChange("state", e.target.value)
                                                        handleInputChange("city", "")
                                                    }}
                                                    className={`${inputBase} appearance-none pr-9`}
                                                    style={errors.state ? inputError : inputNormal}
                                                >
                                                    <option value="">Select state</option>
                                                    {Object.keys(statesAndCities).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
                                            </div>
                                        </Field>
                                        <Field label="City *" error={errors.city}>
                                            <div className="relative">
                                                <select
                                                    required
                                                    disabled={!formData.state}
                                                    value={formData.city}
                                                    onChange={e => handleInputChange("city", e.target.value)}
                                                    className={`${inputBase} appearance-none pr-9 disabled:opacity-50`}
                                                    style={errors.city ? inputError : inputNormal}
                                                >
                                                    <option value="">Select city</option>
                                                    {formData.state && statesAndCities[formData.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
                                            </div>
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Pincode *" error={errors.pincode}>
                                            <input
                                                required
                                                value={formData.pincode}
                                                onChange={e => handleInputChange("pincode", e.target.value)}
                                                placeholder="6-digit pincode"
                                                className={inputBase}
                                                style={errors.pincode ? inputError : inputNormal}
                                                onFocus={e => !errors.pincode && (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => !errors.pincode && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                        <Field label="Landmark (optional)">
                                            <input
                                                value={formData.landmark}
                                                onChange={e => handleInputChange("landmark", e.target.value)}
                                                placeholder="Near SBI Bank, etc."
                                                className={inputBase}
                                                style={inputNormal}
                                                onFocus={e => (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                    </div>

                                </div>
                            )}

                            {/* ── Step 2: Business Info ── */}
                            {/* ── Step 2: Business & Legal ── */}
                            {currentStep === 2 && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Years in Business (optional)">
                                            <input
                                                value={formData.yearsInBusiness}
                                                onChange={e => handleInputChange("yearsInBusiness", e.target.value)}
                                                placeholder="e.g. 5 years"
                                                className={inputBase}
                                                style={inputNormal}
                                                onFocus={e => (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                        <Field label="Monthly Purchase Volume (optional)">
                                            <input
                                                value={formData.monthlyPurchaseVolume}
                                                onChange={e => handleInputChange("monthlyPurchaseVolume", e.target.value)}
                                                placeholder="e.g. 500 LTR"
                                                className={inputBase}
                                                style={inputNormal}
                                                onFocus={e => (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                    </div>

                                    <div style={{ borderTop: "1px solid #F1F5F9" }} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="GST Number (optional)" error={errors.gst}>
                                            <input
                                                value={formData.gst}
                                                onChange={e => handleInputChange("gst", e.target.value)}
                                                placeholder="22AAAAA0000A1Z5"
                                                className={`${inputBase} uppercase`}
                                                style={errors.gst ? inputError : inputNormal}
                                                onFocus={e => !errors.gst && (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => !errors.gst && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                        <Field label="FSSAI License Number (optional)" error={errors.fssai}>
                                            <input
                                                value={formData.fssai}
                                                onChange={e => handleInputChange("fssai", e.target.value)}
                                                placeholder="14-digit number"
                                                className={inputBase}
                                                style={errors.fssai ? inputError : inputNormal}
                                                onFocus={e => !errors.fssai && (e.currentTarget.style.border = "1px solid #D97706")}
                                                onBlur={e => !errors.fssai && (e.currentTarget.style.border = "1px solid #E2E8F0")}
                                            />
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Business license upload */}
                                        <Field label="Business License (optional)" error={errors.licenseUrl}>
                                            <input type="file" ref={licenseInputRef} className="hidden"
                                                accept=".pdf,image/*"
                                                onChange={e => handleFileChange(e, "licenseUrl")} />
                                            <button
                                                type="button"
                                                onClick={() => licenseInputRef.current?.click()}
                                                className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg transition-all"
                                                style={{
                                                    border: `1.5px dashed ${errors.licenseUrl ? "#FCA5A5" : formData.licenseUrl ? "#FDE68A" : "#CBD5E1"}`,
                                                    background: errors.licenseUrl ? "#FFF5F5" : formData.licenseUrl ? "#FFFBEB" : "#F8FAFF"
                                                }}
                                            >
                                                {uploading["licenseUrl"] ? (
                                                    <div className="w-5 h-5 border-2 rounded-full animate-spin"
                                                        style={{ borderColor: "#FDE68A", borderTopColor: "#D97706" }} />
                                                ) : formData.licenseUrl ? (
                                                    <>
                                                        <CheckCircle2 size={20} className="text-primary" />
                                                        <span className="text-xs font-semibold text-primary">Uploaded</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={18} className="text-text-muted-light" />
                                                        <span className="text-xs text-text-muted-light">PDF or image</span>
                                                    </>
                                                )}
                                            </button>
                                        </Field>

                                        {/* GST certificate upload */}
                                        <Field label="GST Certificate (optional)" error={errors.gstCertificateUrl}>
                                            <input type="file" ref={gstInputRef} className="hidden"
                                                accept=".pdf,image/*"
                                                onChange={e => handleFileChange(e, "gstCertificateUrl")} />
                                            <button
                                                type="button"
                                                onClick={() => gstInputRef.current?.click()}
                                                className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg transition-all"
                                                style={{
                                                    border: `1.5px dashed ${errors.gstCertificateUrl ? "#FCA5A5" : formData.gstCertificateUrl ? "#FDE68A" : "#CBD5E1"}`,
                                                    background: errors.gstCertificateUrl ? "#FFF5F5" : formData.gstCertificateUrl ? "#FFFBEB" : "#F8FAFF"
                                                }}
                                            >
                                                {uploading["gstCertificateUrl"] ? (
                                                    <div className="w-5 h-5 border-2 rounded-full animate-spin"
                                                        style={{ borderColor: "#FDE68A", borderTopColor: "#D97706" }} />
                                                ) : formData.gstCertificateUrl ? (
                                                    <>
                                                        <CheckCircle2 size={20} className="text-primary" />
                                                        <span className="text-xs font-semibold text-primary">Uploaded</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={18} className="text-text-muted-light" />
                                                        <span className="text-xs text-text-muted-light">PDF or image</span>
                                                    </>
                                                )}
                                            </button>
                                        </Field>
                                    </div>

                                    {/* Agreement */}
                                    <label className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all"
                                        style={{ border: `1px solid ${formData.agreed ? "#FDE68A" : "#E2E8F0"}`, background: formData.agreed ? "#FFFBEB" : "#fff" }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.agreed}
                                            onChange={e => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                                            className="mt-0.5 w-4 h-4 rounded accent-[#D97706] flex-shrink-0"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-text-title">
                                                I agree to Milkdi Partner Terms & Supply Policies
                                            </p>
                                            <p className="text-xs mt-0.5 text-text-muted">
                                                I certify that all information provided is accurate and complete.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="mt-8 pt-5 flex items-center justify-between"
                                style={{ borderTop: "1px solid #F1F5F9" }}>
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                        currentStep === 0 ? "invisible" : "hover:bg-slate-50"
                                    )}
                                    className="text-text-muted"
                                >
                                    <ArrowLeft size={15} />
                                    Back
                                </button>

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all bg-primary"
                                        onMouseEnter={e => (e.currentTarget.style.background = "#1E40AF")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "#D97706")}
                                    >
                                        Next
                                        <ArrowRight size={15} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!formData.agreed || loading}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                        style={{
                                            background: formData.agreed && !loading ? "#D97706" : "#E2E8F0",
                                            color: formData.agreed && !loading ? "white" : "#94A3B8",
                                            cursor: formData.agreed && !loading ? "pointer" : "not-allowed"
                                        }}
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 rounded-full animate-spin"
                                                style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                                        ) : (
                                            <>Submit Application <CheckCircle2 size={15} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
