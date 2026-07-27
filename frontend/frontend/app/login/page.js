"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const { access_token } = await api.login(email, password);
      localStorage.setItem("token", access_token);
      router.push("/");
    } catch (e) {
      setError("Login failed. Email/password check karo.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="font-display text-3xl mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-charcoal/20 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-charcoal/20 rounded-lg p-3"
        />
        {error && <p className="text-chili text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-chili text-cream py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-charcoal/60 text-center mt-4">
        Account nahi hai?{" "}
        <Link href="/signup" className="text-saffron">
          Sign up
        </Link>
      </p>
    </div>
  );
}
