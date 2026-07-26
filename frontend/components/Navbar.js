"use client";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-10 bg-charcoal text-cream">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl tracking-wide text-saffron">
          TastyTrail
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/orders" className="hover:text-saffron transition-colors">
            Orders
          </Link>
          <Link href="/cart" className="relative hover:text-saffron transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-chili text-cream text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="hover:text-saffron transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
