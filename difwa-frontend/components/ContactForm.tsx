"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [sent, setSent] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSent(true)
    }

    if (sent) {
        return (
            <div className="p-8 rounded-2xl text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#DCFCE7" }}>
                    <Send size={24} className="text-status-success" />
                </div>
                <h3 className="text-base font-bold mb-2 text-text-title">Message sent!</h3>
                <p className="text-sm text-text-muted">
                    Thanks for reaching out. We'll get back to you within a few hours.
                </p>
                <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                    className="mt-5 text-sm font-semibold text-primary">
                    Send another message
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold mb-1.5 text-gray-700">Your name</label>
                    <input
                        type="text" required placeholder="Rahul Sharma"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full text-sm px-4 py-3 rounded-xl outline-none"
                        style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", background: "white" }}
                        onFocus={e => e.currentTarget.style.borderColor = "#D97706"}
                        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1.5 text-gray-700">Email address</label>
                    <input
                        type="email" required placeholder="rahul@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full text-sm px-4 py-3 rounded-xl outline-none"
                        style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", background: "white" }}
                        onFocus={e => e.currentTarget.style.borderColor = "#D97706"}
                        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-700">Subject</label>
                <select
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full text-sm px-4 py-3 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E2E8F0", color: form.subject ? "#0F172A" : "#94A3B8", background: "white" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#D97706"}
                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
                    <option value="" disabled>Select a topic…</option>
                    <option value="order">Order / Delivery issue</option>
                    <option value="vendor">Vendor partnership</option>
                    <option value="billing">Billing / Payment</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-700">Message</label>
                <textarea
                    required rows={5} placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full text-sm px-4 py-3 rounded-xl outline-none resize-none"
                    style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", background: "white" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#D97706"}
                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                />
            </div>
            <button
                type="submit"
                className="flex items-center gap-2 text-sm font-bold text-white px-7 py-3 rounded-xl w-full justify-center bg-primary">
                <Send size={15} />
                Send Message
            </button>
        </form>
    )
}
