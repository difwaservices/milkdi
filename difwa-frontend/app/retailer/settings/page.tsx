"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Store, MapPin, Upload, Save, Loader2, X, Phone, Mail, Clock, Plus, AlertTriangle, MapPin as MapPinIcon, Truck, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import retailerService from "@/data/services/retailerService"
import useAuthStore from "@/data/store/useAuthStore"
import { toast } from "sonner"

export default function StoreSettingsPage() {
    const { user, setUser } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        businessName: "",
        storeDisplayName: "",
        businessType: "",
        ownerName: "",
        email: "",
        whatsappNumber: "",
        storeImage: "",
        location: {
            address: "",
            city: "",
            state: "",
            pincode: "",
            landmark: "",
            coordinates: null as { lat: number, lng: number } | null | undefined
        },
        deliverySlots: [] as string[]
    })
    const [originalData, setOriginalData] = useState<any>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [pendingPath, setPendingPath] = useState<string | null>(null)
    const [showExitModal, setShowExitModal] = useState(false)

    const [customSlot, setCustomSlot] = useState("")
    const [hasDeliveryPermission, setHasDeliveryPermission] = useState(false)
    const defaultSlots = ["8-9 AM", "9-10 AM", "10-11 AM", "11 AM-12 PM", "4-5 PM", "5-6 PM", "6-7 PM"]

    // Delivery Charges state (only used if deliveryChargePermission is true)
    type DeliverySlab = { minKm: number; maxKm: number; charge: number }
    const [deliverySlabs, setDeliverySlabs] = useState<DeliverySlab[]>([])
    const [availableSlabOptions, setAvailableSlabOptions] = useState<DeliverySlab[]>([])
    const [retailerMaxDeliveryKm, setRetailerMaxDeliveryKm] = useState<number>(30)
    const [savingDelivery, setSavingDelivery] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (user?._id || user?.id) fetchProfile()
    }, [user?._id, user?.id])

    useEffect(() => {
        if (hasDeliveryPermission) {
            retailerService.getDeliveryCharges()
                .then(res => {
                    if (res.success) {
                        setDeliverySlabs(res.data.retailerDeliverySlabs || [])
                        setAvailableSlabOptions(res.data.availableSlabOptions || [])
                        setRetailerMaxDeliveryKm(res.data.retailerMaxDeliveryKm || res.data.maxDeliveryKm || 30)
                    }
                })
                .catch(() => { })
        }
    }, [hasDeliveryPermission])

    // Track Dirty State
    useEffect(() => {
        if (!originalData) return
        const current = JSON.stringify(formData)
        const original = JSON.stringify(originalData)
        setIsDirty(current !== original)
    }, [formData, originalData])

    // Browser Close/Reload Guard
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ""
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [isDirty])

    // Client-side Navigation Interceptor
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            if (!isDirty) return

            const target = e.target as HTMLElement
            const anchor = target.closest("a")

            if (anchor && anchor.href && !anchor.href.includes("#")) {
                // If it's an internal link (e.g. sidebar)
                if (anchor.origin === window.location.origin && anchor.pathname !== window.location.pathname) {
                    e.preventDefault()
                    e.stopPropagation()
                    setPendingPath(anchor.pathname)
                    setShowExitModal(true)
                }
            }
        }

        document.addEventListener("click", handleAnchorClick, true)
        return () => document.removeEventListener("click", handleAnchorClick, true)
    }, [isDirty])

    const handleConfirmDiscard = () => {
        setShowExitModal(false)
        setIsDirty(false)
        if (pendingPath) {
            router.push(pendingPath)
        }
    }

    const handleConfirmSave = async () => {
        const success = await handleSave()
        if (success) {
            setShowExitModal(false)
            if (pendingPath) {
                router.push(pendingPath)
            }
        }
    }

    const fetchProfile = async () => {
        try {
            const userId = user?._id || user?.id;
            if (!userId) return;
            const response = await retailerService.getProfile(userId)
            const data = response.data || response;

            const initialData = {
                businessName: data.businessDetails?.businessName || "",
                storeDisplayName: data.businessDetails?.storeDisplayName || "",
                businessType: data.businessDetails?.businessType || "",
                ownerName: data.businessDetails?.ownerName || data.name || "",
                email: data.email || "",
                whatsappNumber: data.whatsappNumber || "",
                storeImage: data.businessDetails?.storeImage || "",
                location: {
                    address: data.businessDetails?.location?.address || "",
                    city: data.businessDetails?.location?.city || "",
                    state: data.businessDetails?.location?.state || "",
                    pincode: data.businessDetails?.location?.pincode || "",
                    landmark: data.businessDetails?.location?.landmark || "",
                    coordinates: data.businessDetails?.location?.coordinates || null
                },
                deliverySlots: data.businessDetails?.deliverySlots || []
            }

            setFormData(initialData)
            setOriginalData(initialData)
            setHasDeliveryPermission(!!data.deliveryChargePermission)
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const response = await retailerService.uploadImage(file)
            const imageUrl = response?.url || response?.data?.url;
            if (typeof imageUrl === "string") {
                setFormData(prev => ({ ...prev, storeImage: imageUrl }))
                toast.success("Banner uploaded successfully! Don't forget to save changes.")
            } else {
                toast.error("Failed to get image URL from server.")
            }
        } catch (error) {
            console.error("Upload failed:", error)
            toast.error("Image upload failed. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser")
            return
        }

        toast.info("Fetching your location...")
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Update coordinates immediately
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        coordinates: {
                            lat: latitude,
                            lng: longitude
                        }
                    }
                }))

                try {
                    // Fetch address details
                    const response = await retailerService.reverseGeocode(latitude, longitude);
                    if (response.success && response.data) {
                        const { address, city, pincode, state } = response.data;
                        setFormData(prev => ({
                            ...prev,
                            location: {
                                ...prev.location,
                                address: address || prev.location.address,
                                city: city || prev.location.city,
                                pincode: pincode || prev.location.pincode,
                                state: state || prev.location.state
                            }
                        }));
                        toast.success("Location and address captured successfully!");
                    } else {
                        toast.success("Location captured, but address could not be fetched.");
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    toast.success("Location captured! (Address autofill failed)");
                }
            },
            (error) => {
                console.error("Error getting location:", error)
                toast.error("Failed to get location. Please allow location access.")
            }
        )
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await retailerService.updateProfile({
                businessDetails: {
                    businessName: formData.businessName,
                    storeDisplayName: formData.storeDisplayName,
                    businessType: formData.businessType,
                    storeImage: formData.storeImage,
                    location: formData.location,
                    deliverySlots: formData.deliverySlots
                },
                whatsappNumber: formData.whatsappNumber
            })
            if (res?.data && setUser) {
                setUser({ ...user, ...res.data })
            }
            setOriginalData(formData) // Reset original data to current
            setIsDirty(false)
            toast.success("Settings saved successfully!")
            return true
        } catch (error) {
            console.error("Save failed:", error)
            toast.error("Failed to save settings.")
            return false
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>

    return (
        <div className="space-y-6 sm:space-y-8 pb-20 p-4 sm:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Store Settings</h1>
                    <p className="text-xs sm:text-sm text-text-muted">Manage your shop's profile and customer-facing information.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-xs sm:text-sm font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 shrink-0"
                >
                    {saving ? <Loader2 size={16} className="animate-spin shrink-0" /> : <Save size={16} className="shrink-0" />}
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <section className="bg-white p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <div className="p-2 rounded-lg bg-primary-light text-primary shrink-0">
                                <Store size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold">Shop Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold">Store Display Name</label>
                                <input
                                    type="text"
                                    value={formData.storeDisplayName}
                                    onChange={e => setFormData({ ...formData, storeDisplayName: e.target.value })}
                                    placeholder="e.g. Milkdi Water Solutions"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-background-soft border-transparent focus:bg-white focus:border-primary transition-all outline-none text-xs sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold">Legal Business Name</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    readOnly
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gray-100 border-transparent text-xs sm:text-sm text-text-muted font-medium outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold">WhatsApp Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                    <input
                                        type="tel"
                                        value={formData.whatsappNumber}
                                        onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        placeholder="+91 8989898989"
                                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-background-soft border-transparent focus:bg-white focus:border-primary outline-none text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold">Support Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-gray-100 border-transparent text-xs sm:text-sm text-text-muted outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Address */}
                    <section className="bg-white p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                <MapPin size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold">Store Location</h3>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold">Full Address</label>
                                <textarea
                                    rows={3}
                                    value={formData.location.address}
                                    onChange={e => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                                    placeholder="Street, Area..."
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-background-soft border-transparent focus:bg-white focus:border-primary outline-none text-xs sm:text-sm resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold">City</label>
                                    <input
                                        type="text"
                                        value={formData.location.city}
                                        onChange={e => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-background-soft border-transparent outline-none text-xs sm:text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold">Pincode</label>
                                    <input
                                        type="text"
                                        value={formData.location.pincode}
                                        onChange={e => setFormData({ ...formData, location: { ...formData.location, pincode: e.target.value } })}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-background-soft border-transparent outline-none text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold">Store Location (GPS)</label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-blue-50 text-blue-600 text-xs sm:text-sm font-bold hover:bg-blue-100 transition-all border border-blue-200 shrink-0"
                                    >
                                        <MapPinIcon size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                                        <span>{formData.location.coordinates ? "Location Captured ✓" : "Get Current Location"}</span>
                                    </button>
                                    {formData.location.coordinates && (
                                        <span className="text-xs text-gray-500 text-center sm:text-left">
                                            {formData.location.coordinates.lat.toFixed(4)}, {formData.location.coordinates.lng.toFixed(4)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Time Slots */}
                    <section className="bg-white p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                <Clock size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold">Delivery Time Slots</h3>
                        </div>

                        <p className="text-xs sm:text-sm text-text-muted">
                            Define the time windows when you can fulfill deliveries. Customers will be required to pick one during checkout.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {formData.deliverySlots.map((slot, index) => (
                                <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium group">
                                    <span>{slot}</span>
                                    <button
                                        onClick={() => setFormData({ ...formData, deliverySlots: formData.deliverySlots.filter((_, i) => i !== index) })}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} className="shrink-0" />
                                    </button>
                                </div>
                            ))}
                            {formData.deliverySlots.length === 0 && (
                                <p className="text-xs text-blue-600 font-medium italic">Please add at least one slot for customers to order.</p>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border-custom">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-muted">Quick Add Defaults</label>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {defaultSlots.filter(s => !formData.deliverySlots.includes(s)).map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setFormData({ ...formData, deliverySlots: [...formData.deliverySlots, slot] })}
                                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-border-custom hover:border-primary hover:text-primary transition-all text-[11px] sm:text-xs font-medium bg-background-soft"
                                            >
                                                + {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-muted">Custom Slot</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customSlot}
                                            onChange={(e) => setCustomSlot(e.target.value)}
                                            placeholder="e.g. 7:30 - 8:30 AM"
                                            className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-background-soft border-transparent focus:bg-white focus:border-primary outline-none text-xs sm:text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                if (customSlot && !formData.deliverySlots.includes(customSlot)) {
                                                    setFormData({ ...formData, deliverySlots: [...formData.deliverySlots, customSlot] })
                                                    setCustomSlot("")
                                                }
                                            }}
                                            className="px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-medium shrink-0"
                                        >
                                            <Plus size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Media */}
                <div className="space-y-6">
                    <section className="bg-white p-4 sm:p-6 rounded-2xl space-y-3 sm:space-y-4 shadow-sm">
                        <h3 className="text-base sm:text-lg font-bold">Shop Banner</h3>
                        <p className="text-xs text-text-muted">This image will be shown to customers when they browse shops.</p>

                        <label className="aspect-video border-2 border-dashed border-border-custom rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary transition-all overflow-hidden relative bg-background-soft">
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                            {formData.storeImage ? (
                                <img src={formData.storeImage} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center p-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
                                        {uploading ? <Loader2 size={20} className="text-primary animate-spin sm:w-6 sm:h-6" /> : <Upload size={20} className="text-text-muted sm:w-6 sm:h-6" />}
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold">{uploading ? "Uploading..." : "Upload Cover"}</p>
                                </div>
                            )}
                        </label>

                        {formData.storeImage && (
                            <button
                                onClick={() => setFormData({ ...formData, storeImage: "" })}
                                className="w-full py-2 rounded-lg border border-red-100 text-red-600 text-xs font-bold hover:bg-red-50 flex items-center justify-center gap-2 mt-2"
                            >
                                <X size={14} className="shrink-0" /> Remove Image
                            </button>
                        )}
                    </section>
                </div>
            </div>

            {/* ── Delivery Charges Section (only shown if admin granted permission) ── */}
            {hasDeliveryPermission && (
                <div className="bg-white rounded-2xl sm:rounded-xl border border-blue-100 shadow-xl p-4 sm:p-8 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-blue-100">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <Truck size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-600 text-base">My Delivery Charges</h3>
                            <p className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-widest leading-tight">Set your own distance-based pricing. You keep the delivery income.</p>
                        </div>
                    </div>

                    {/* Max Delivery Distance Setup */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Maximum Delivery Distance</h4>
                            <p className="text-[9px] sm:text-[10px] font-bold text-text-muted uppercase tracking-widest leading-tight">Orders beyond this distance will not be accepted.</p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                            <input
                                type="number" min="0" step="0.5" value={retailerMaxDeliveryKm}
                                onChange={e => setRetailerMaxDeliveryKm(parseFloat(e.target.value) || 0)}
                                className="w-20 sm:w-24 px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-blue-200 outline-none text-xs sm:text-sm font-bold focus:border-blue-400 transition-colors text-center"
                            />
                            <span className="text-xs font-bold text-blue-500 uppercase">km</span>
                        </div>
                    </div>

                    {/* Slabs editor */}
                    <div className="space-y-3">
                        {deliverySlabs.length === 0 && (
                            <div className="text-center py-6 text-text-muted text-xs sm:text-sm font-bold bg-blue-50/50 rounded-xl sm:rounded-2xl border border-blue-100">
                                No delivery slabs set. Add a slab below.
                            </div>
                        )}
                        {deliverySlabs.map((slab, index) => {
                            const isPreset = availableSlabOptions.some(opt => opt.minKm === slab.minKm && opt.maxKm === slab.maxKm);
                            const selectValue = isPreset ? `${slab.minKm}-${slab.maxKm}` : "custom";

                            return (
                                <div key={index} className="grid gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50/50 border border-blue-100 relative pt-8 sm:pt-4">
                                    <button
                                        onClick={() => setDeliverySlabs(prev => prev.filter((_, i) => i !== index))}
                                        className="absolute right-2 top-2 sm:right-3 sm:top-3 p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-3 sm:gap-4 items-stretch sm:items-end sm:pr-8">
                                        <div className="space-y-1">
                                            <label className="text-[9px] sm:text-xs font-medium text-text-muted">Distance Slab</label>
                                            <select
                                                value={selectValue}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val !== "custom") {
                                                        const [min, max] = val.split('-').map(Number);
                                                        setDeliverySlabs(prev => prev.map((s, i) => i === index ? { ...s, minKm: min, maxKm: max } : s));
                                                    } else {
                                                        // Convert to custom by slightly altering maxKm so it doesn't match preset, or just leave it and let them edit inputs
                                                        setDeliverySlabs(prev => prev.map((s, i) => i === index ? { ...s, maxKm: s.maxKm + 0.1 } : s));
                                                    }
                                                }}
                                                className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-blue-100 outline-none text-xs sm:text-sm font-bold focus:border-blue-400 transition-colors appearance-none"
                                            >
                                                <option value="" disabled>Select a distance range</option>
                                                {availableSlabOptions.map((opt, i) => (
                                                    <option key={i} value={`${opt.minKm}-${opt.maxKm}`}>
                                                        {opt.minKm} to {opt.maxKm} km
                                                    </option>
                                                ))}
                                                <option value="custom">Custom Distance...</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[9px] sm:text-xs font-medium text-text-muted">My Charge (₹)</label>
                                            <input
                                                type="number" min="0" step="1" value={slab.charge}
                                                onChange={e => setDeliverySlabs(prev => prev.map((s, i) => i === index ? { ...s, charge: parseFloat(e.target.value) || 0 } : s))}
                                                className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-blue-100 outline-none text-xs sm:text-sm font-bold focus:border-blue-400 transition-colors"
                                                placeholder="e.g. 50"
                                            />
                                        </div>
                                    </div>

                                    {!isPreset && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1 border-t border-blue-100/50 pt-3">
                                            <div className="space-y-1">
                                                <label className="text-[9px] sm:text-xs font-medium text-text-muted">From (km)</label>
                                                <input
                                                    type="number" min="0" step="0.5" value={slab.minKm}
                                                    onChange={e => setDeliverySlabs(prev => prev.map((s, i) => i === index ? { ...s, minKm: parseFloat(e.target.value) || 0 } : s))}
                                                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-blue-100 outline-none text-xs sm:text-sm font-bold focus:border-blue-400 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] sm:text-xs font-medium text-text-muted">To (km)</label>
                                                <input
                                                    type="number" min="0" step="0.5" value={slab.maxKm}
                                                    onChange={e => setDeliverySlabs(prev => prev.map((s, i) => i === index ? { ...s, maxKm: parseFloat(e.target.value) || 0 } : s))}
                                                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-blue-100 outline-none text-xs sm:text-sm font-bold focus:border-blue-400 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => {
                            const last = deliverySlabs[deliverySlabs.length - 1]
                            setDeliverySlabs(prev => [...prev, { minKm: last?.maxKm || 0, maxKm: (last?.maxKm || 0) + 5, charge: 0 }])
                        }}
                        className="w-full py-2.5 sm:py-3 border-2 border-dashed border-blue-300 rounded-xl sm:rounded-2xl text-blue-500 font-bold text-xs sm:text-sm hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Another Slab
                    </button>

                    <button
                        onClick={async () => {
                            let highestMaxKm = 0;
                            for (const s of deliverySlabs) {
                                if (s.minKm >= s.maxKm) { toast.error("Each slab's Min km must be less than Max km"); return }
                                if (s.charge < 0) { toast.error("Charge cannot be negative"); return }
                                if (s.maxKm > highestMaxKm) highestMaxKm = s.maxKm;
                            }
                            if (highestMaxKm > retailerMaxDeliveryKm) {
                                toast.error(`Your slabs go up to ${highestMaxKm} km, which is more than your Max Delivery Distance (${retailerMaxDeliveryKm} km).`);
                                return;
                            }

                            setSavingDelivery(true)
                            try {
                                const res = await retailerService.updateDeliveryCharges(deliverySlabs, retailerMaxDeliveryKm)
                                if (res.success) toast.success("Delivery charges saved!")
                            } catch (e: any) {
                                toast.error(e?.response?.data?.message || "Failed to save delivery charges")
                            } finally {
                                setSavingDelivery(false)
                            }
                        }}
                        disabled={savingDelivery}
                        className="w-full py-3 sm:py-4 bg-blue-500 text-white rounded-xl sm:rounded-xl font-semibold text-sm hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
                    >
                        <Save size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                        <span>{savingDelivery ? "Saving..." : "Save My Delivery Charges"}</span>
                    </button>
                </div>
            )}

            {/* Unsaved Changes Confirmation Modal */}
            {showExitModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-xl shadow-md overflow-hidden animate-in zoom-in-95 duration-300 p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-warning-50 text-warning rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 shrink-0">
                            <AlertTriangle size={24} className="sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-text">Discard unsaved changes?</h3>
                            <p className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-2">
                                You have pending changes in your store settings. Switching pages now will discard these changes.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <button
                                onClick={handleConfirmSave}
                                disabled={saving}
                                className="w-full py-3 sm:py-3.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin shrink-0" /> : <Save size={16} className="shrink-0" />}
                                <span>Save Changes</span>
                            </button>
                            <button
                                onClick={handleConfirmDiscard}
                                className="w-full py-3 sm:py-3.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs sm:text-sm hover:bg-red-100 transition-all"
                            >
                                Discard
                            </button>
                            <button
                                onClick={() => {
                                    setShowExitModal(false)
                                    setPendingPath(null)
                                }}
                                className="text-[10px] sm:text-xs font-bold text-text-muted/60 uppercase tracking-widest pt-1 sm:pt-2 hover:text-primary transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
