// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';

// export default function RestaurantPage() {
//   const { id } = useParams();
//   const [restaurant, setRestaurant] = useState(null);
//   const [menu, setMenu] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     Promise.all([
//       fetch(`http://127.0.0.1:8000/restaurants/${id}`).then((res) => res.json()),
//       fetch(`http://127.0.0.1:8000/restaurants/${id}/menu/`).then((res) => res.json()),
//     ])
//       .then(([restaurantData, menuData]) => {
//         setRestaurant(restaurantData);
//         setMenu(menuData);
//       })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-2">{restaurant?.name}</h1>
//       <p className="text-charcoal/70 mb-6">{restaurant?.city}</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {menu.map((item) => (
//           <div key={item.id} className="border rounded-lg overflow-hidden">
//             {item.image_url ? (
//               <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
//             ) : (
//               <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
//                 No image
//               </div>
//             )}
//             <div className="p-3">
//               <h2 className="font-semibold">{item.name}</h2>
//               <p className="text-charcoal/70">₹{item.price}</p>
//               <button onClick={() => {
//                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//                const existing = cart.find((c) => c.menu_item_id === item.id);
//             if (existing) {
//             existing.quantity += 1;
//             } else {
//            cart.push({
//            menu_item_id: item.id,
//            name: item.name,
//            price: item.price,
//            quantity: 1,
//            restaurant_id: id,
//          });
//       }
//         localStorage.setItem('cart', JSON.stringify(cart));
//         alert(`${item.name} cart mein add ho gaya`);
//      }}
//           className="mt-2 bg-orange-500 text-white px-4 py-1 rounded"
//     >
//     Add to Cart
//    </button>
//         </div>
//         </div>
//         ))}
//       </div>

//       {menu.length === 0 && <p className="mt-4">Koi menu item nahi mila.</p>}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "@/lib/CartContext";

export default function RestaurantPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.getRestaurant(id), api.getMenu(id)])
      .then(([restaurantData, menuData]) => {
        setRestaurant(restaurantData);
        setMenu(menuData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{restaurant?.name}</h1>
      <p className="text-charcoal/70 mb-6">{restaurant?.city}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                No image
              </div>
            )}
            <div className="p-3">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-charcoal/70">₹{item.price}</p>
              <button
                onClick={() => addItem(item, Number(id))}
                className="mt-2 bg-orange-500 text-white px-4 py-1 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {menu.length === 0 && <p className="mt-4">Koi menu item nahi mila.</p>}
    </div>
  );
}