"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function VendorRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ businessName: "", email: "", phone: "", category: "", description: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password })
      if (authError) throw authError
      if (data.user) {
        const { error: dbError } = await supabase.from("vendors").insert([{ user_id: data.user.id, business_name: form.businessName, phone: form.phone, category: form.category, description: form.description, status: "pending" }])
        if (dbError) throw dbError
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">Check your email to verify your account. We will review your application within 2-3 business days.</p>
        <button onClick={() => router.push("/")} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600">Back to Home</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
        <h1 className="text-2xl font-bold">Become a LEE Vendor</h1>
        <p className="text-orange-100 mt-1">Reach millions of customers across the UAE</p>
      </div>
      <div className="max-w-lg mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 mt-4 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} required placeholder="Your Store Name" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="business@example.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min 8 characters" minLength={8} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+971 50 000 0000" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion &amp; Apparel</option>
              <option value="home">Home &amp; Living</option>
              <option value="beauty">Beauty &amp; Health</option>
              <option value="sports">Sports &amp; Outdoors</option>
              <option value="food">Food &amp; Grocery</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Tell us about your business..." className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading ? "Submitting..." : "Apply to Sell on LEE"}
          </button>
          <p className="text-center text-sm text-gray-500">Already a vendor? <a href="/vendor/login" className="text-orange-500 font-medium">Sign In</a></p>
        </form>
      </div>
    </div>
  )
}
