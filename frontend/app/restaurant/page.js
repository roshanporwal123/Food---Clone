"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "@/lib/CartContext";

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([api.getRestaurant(id), api.getMenu(id)])
      .then(([r, m]) => {
        setRestaurant(r);
        setMenu(m);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-charcoal/60">Loading menu...</p>;
  if (!restaurant) return <p className="text-chili">Restaurant not found.</p>;

  const categories = [...new Set(menu.map((m) => m.category || "Other"))];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl">{restaurant.name}</h1>
        <p className="text-charcoal/60">{restaurant.cuisine_type} · {restaurant.address}</p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="font-display text-xl text-chili mb-3">{cat}</h2>
          <div className="space-y-3">
            {menu
              .filter((m) => (m.category || "Other") === cat)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-charcoal/10 rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">
                      <span className={item.is_veg ? "text-leaf" : "text-chili"}>●</span>{" "}
                      {item.name}
                    </p>
                    <p className="text-sm text-charcoal/60">{item.description}</p>
                    <p className="text-saffron mt-1">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => addItem(item, restaurant.id)}
                    className="bg-chili text-cream px-4 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
