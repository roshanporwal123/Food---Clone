"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .getRestaurants()
      .then(setRestaurants)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="mb-8">
        <h1 className="font-display text-4xl text-charcoal mb-2">
          Order the good stuff.
        </h1>
        <p className="text-charcoal/70 mb-4">
          Restaurants near you, ready to cook.
        </p>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-charcoal/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
        />
      </section>

      {loading && <p className="text-charcoal/60">Loading restaurants...</p>}
      {error && (
        <p className="text-chili">
          Couldn't load restaurants: {error}. Backend chal raha hai check karo.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/restaurant/${r.id}`}
            className="block bg-white border border-charcoal/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-32 bg-leaf/20 flex items-center justify-center text-charcoal/40 text-sm">
              {r.image_url ? (
                <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                "No image"
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display text-xl">{r.name}</h3>
              <p className="text-sm text-charcoal/60">{r.cuisine_type} · {r.city}</p>
              <p className="text-sm text-saffron mt-1">★ {r.rating.toFixed(1)}</p>
            </div>
          </Link>
        ))}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <p className="text-charcoal/60 mt-6">Koi restaurant nahi mila.</p>
      )}
    </div>
  );
}
