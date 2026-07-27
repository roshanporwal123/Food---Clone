import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "TastyTrail — Order food online",
  description: "Browse restaurants and order food, fast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <CartProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
