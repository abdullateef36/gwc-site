"use client";

import { useState } from "react";
import Image from "next/image";

interface CartItem {
  name: string;
  price: number;
  img: string;
  qty: number;
}

interface ShopItem {
  name: string;
  price: number;
  img: string;
}

export default function Shop() {
  const items: ShopItem[] = [
    { name: "GWC Hoodie", price: 45, img: "https://picsum.photos/400/400?random=1" },
    { name: "GWC Cap", price: 25, img: "https://picsum.photos/400/400?random=2" },
    { name: "GWC Jersey", price: 55, img: "https://picsum.photos/400/400?random=3" },
    { name: "GWC Polo", price: 15, img: "https://picsum.photos/400/400?random=4" },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item: ShopItem) => {
    const existing = cart.find((c) => c.name === item.name);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.name === item.name ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (item: CartItem) => {
    setCart(cart.filter((c) => c.name !== item.name));
  };

  const updateQty = (item: CartItem, delta: number) => {
    setCart(
      cart
        .map((c) =>
          c.name === item.name ? { ...c, qty: c.qty + delta } : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      <p className="text-gray-300 mb-8">
        Represent GWC with exclusive merchandise and apparel.
      </p>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:shadow-[0_0_15px_var(--gwc-red)] transition-all duration-300 group"
          >
            <div className="relative w-full h-48 rounded overflow-hidden">
              <Image
                src={item.img}
                alt={item.name}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <h3 className="mt-3 font-semibold text-lg">{item.name}</h3>
            <p className="mt-1 text-gray-300">${item.price.toFixed(2)}</p>
            <button
              className="mt-3 bg-(--gwc-red) px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors duration-200 w-full"
              onClick={() => addToCart(item)}
              aria-label={`Add ${item.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setCartOpen(!cartOpen)}
        className="fixed bottom-8 right-8 bg-(--gwc-red) text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:scale-105 transition-transform duration-200 z-50 flex items-center gap-2"
        aria-label={`Shopping cart, ${cartTotalItems} items`}
        aria-expanded={cartOpen}
      >
        <span className="text-xl">🛒</span>
        <span>Cart ({cartTotalItems})</span>
      </button>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setCartOpen(false)}
            aria-hidden="true"
          />
          
          {/* Cart Panel */}
          <div className="fixed bottom-20 right-8 bg-gray-900 p-6 rounded-lg border border-gray-800 w-80 sm:w-96 shadow-xl z-50 animate-slide-up">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
              <h4 className="font-bold text-lg">Your Cart</h4>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-(--gwc-red) hover:text-red-600"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm border-b border-gray-800 pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={item.img}
                            alt={item.name}
                            className="object-cover"
                            fill
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-400">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => updateQty(item, -1)}
                          className="bg-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-600"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item, 1)}
                          className="bg-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-600"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-red-500 hover:text-red-600 ml-2"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between font-semibold text-lg mb-4">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button 
                    className="w-full bg-(--gwc-red) py-3 rounded font-semibold hover:bg-red-700 transition-colors duration-200"
                    onClick={() => alert("Checkout functionality would be implemented here!")}
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button 
                    className="w-full mt-2 border border-gray-600 py-2 rounded font-semibold hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}