"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";

export default function CartPage() {
  const { items, restaurantId, updateQuantity, removeItem, total, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

 async function handlePlaceOrder() {
  if (!address.trim()) {
    setError("Delivery address daalo.");
    return;
  }
  setPlacing(true);
  setError(null);
  try {
    const order = await api.placeOrder({
      restaurant_id: restaurantId,
      delivery_address: address,
      items: items.map((i) => ({ menu_item_id: i.menuItem.id, quantity: i.quantity })),
    });

    const payment = await api.createPayment(order.id);

    const options = {
      key: payment.key_id,
      amount: payment.amount,
      currency: payment.currency,
      name: "TastyTrail",
      description: `Order #${order.id}`,
      order_id: payment.razorpay_order_id,
      handler: async function (response) {
        try {
          await api.verifyPayment(order.id, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          clearCart();
          router.push("/orders");
        } catch (e) {
          setError("Payment verify nahi hua: " + e.message);
        }
      },
      theme: { color: "#f97316" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (e) {
    setError(e.message + " — pehle login karo.");
  } finally {
    setPlacing(false);
  }
}

  if (items.length === 0) {
    return <p className="text-charcoal/60">Cart khaali hai. Kuch order karo!</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl mb-4">Your Cart</h1>
      <div className="space-y-3 mb-6">
        {items.map(({ menuItem, quantity }) => (
          <div
            key={menuItem.id}
            className="flex items-center justify-between bg-white border border-charcoal/10 rounded-lg p-3"
          >
            <div>
              <p className="font-medium">{menuItem.name}</p>
              <p className="text-sm text-saffron">₹{menuItem.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                className="w-7 h-7 rounded-full border border-charcoal/20"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                className="w-7 h-7 rounded-full border border-charcoal/20"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-lg font-medium mb-4">Total: ₹{total.toFixed(2)}</p>

      <textarea
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border border-charcoal/20 rounded-lg p-3 mb-3"
        rows={2}
      />

      {error && <p className="text-chili text-sm mb-3">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full bg-chili text-cream py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {placing ? "Placing order..." : "Place Order"}
      </button>
    </div>
  );
}
