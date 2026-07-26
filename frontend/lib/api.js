const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  getRestaurants: (city) => request(`/restaurants/${city ? `?city=${city}` : ""}`),
  getRestaurant: (id) => request(`/restaurants/${id}`),
  getMenu: (restaurantId) => request(`/restaurants/${restaurantId}/menu/`),
  signup: (data) => request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: async (email, password) => {
    const body = new URLSearchParams({ username: email, password });
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
  placeOrder: (data) => request("/orders/", { method: "POST", body: JSON.stringify(data) }),
  myOrders: () => request("/orders/"),
  createPayment: (orderId) => request(`/orders/${orderId}/create-payment`, { method: "POST"}),
  verifyPayment: (orderId, data) => request(`/orders/${orderId}/verify-payment`, {method: "POST", body: JSON.stringify(data) }),
};
