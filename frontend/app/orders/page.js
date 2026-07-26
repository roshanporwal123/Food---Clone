"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .myOrders()
      .then(setOrders)
      .catch((e) => setError("Login karo orders dekhne ke liye."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-charcoal/60">Loading...</p>;
  if (error) return <p className="text-chili">{error}</p>;
  if (orders.length === 0) return <p className="text-charcoal/60">Koi order nahi hai abhi.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-charcoal/10 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Order #{order.id}</p>
              <span className="text-xs bg-saffron/20 text-saffron px-2 py-1 rounded-full uppercase">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-charcoal/60">{order.delivery_address}</p>
            <p className="text-saffron mt-2">Total: ₹{order.total_amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
