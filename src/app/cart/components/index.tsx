'use client';

import { useEffect, useState } from 'react';
import { getCartProductsByIds } from '@/app/cart/actions';
import { ProductType } from '@/app/types';

export function Cart() {
  const [cartProducts, setCartProducts] = useState<(ProductType & { quantity: number })[]>([]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      const storedCart: string[] = JSON.parse(localStorage.getItem('cart') || '[]');

      if (storedCart.length === 0) {
        setCartProducts([]);
        return;
      }

      try {
        const products = await getCartProductsByIds(storedCart);

        // Count quantities
        const productMap: Record<string, number> = {};
        storedCart.forEach(id => {
          productMap[id] = (productMap[id] || 0) + 1;
        });

        const productsWithQuantities = products.map((product: ProductType) => ({
          ...product,
          quantity: productMap[product._id] || 1,
        }));

        setCartProducts(productsWithQuantities);
      } catch (error) {
        console.error('Error fetching cart products:', error);
        setCartProducts([]);
      }
    };

    fetchCartProducts();
  }, []);

  const handleQuantityChange = (productId: string, type: 'increase' | 'decrease') => {
    setCartProducts(prev =>
      prev.map(product => {
        if (product._id === productId) {
          let newQty = product.quantity + (type === 'increase' ? 1 : -1);
          newQty = Math.max(newQty, 1);
          return { ...product, quantity: newQty };
        }
        return product;
      })
    );
  };

  const totalAmount = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cartProducts.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col md:flex-row items-center gap-4 border-b pb-4"
              >
                <img
                  src={`/uploads/${product.productImages?.[0]?.thumb || ''}`}
                  alt={product.productTitle}
                  className="w-32 h-32 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleQuantityChange(product._id, 'decrease')}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium">{product.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, 'increase')}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <p className="mt-2 text-blue-600 font-bold text-md">
                    ₹{product.price} × {product.quantity} = ₹{product.price * product.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-8">
            <p className="text-xl font-semibold">
              Total: <span className="text-green-600">₹{totalAmount}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
