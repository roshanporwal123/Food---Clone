"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.signup(form);
      router.push("/login");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="font-display text-3xl mb-6 text-center">Sign up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-charcoal/20 rounded-lg p-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full border border-charcoal/20 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-charcoal/20 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full border border-charcoal/20 rounded-lg p-3"
        />
        {error && <p className="text-chili text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-chili text-cream py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Create account
        </button>
      </form>
    </div>
  );
}
