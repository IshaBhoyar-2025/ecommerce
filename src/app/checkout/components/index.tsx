 'use client';

;
import { getCurrentUser } from "../actions";
import Header from "@/app/components/Header";
import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getCartProductsByIds } from '@/app/cart/actions';
import { ProductType } from '@/app/types';


export  function CheckoutPage({  address,
}: {  address: {
  fullName: string;
  phone: string;
  address: string;
} }
) {
 


  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartProducts, setCartProducts] = useState<(ProductType & { quantity: number })[]>([]);
  const [savedForLater, setSavedForLater] = useState<ProductType[]>([]);

  

  useEffect(() => {
    // Check if user is logged in
    async function userLoggedIn() {
      const user = await getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }

    userLoggedIn();

    const fetchCartProducts = async () => {
      const storedCart: string[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const storedSaved: ProductType[] = JSON.parse(localStorage.getItem('savedForLater') || '[]');
      setSavedForLater(storedSaved);

      if (storedCart.length === 0) {
        setCartProducts([]);
        return;
      }

      try {
        const products = await getCartProductsByIds(storedCart);

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

  const updateLocalStorageCart = (cartItems: (ProductType & { quantity: number })[]) => {
    setCartProducts(cartItems);
    const flatIds = cartItems.flatMap(item => Array(item.quantity).fill(item._id));
    localStorage.setItem('cart', JSON.stringify(flatIds));
  };

  const handleQuantityChange = (productId: string, type: 'increase' | 'decrease') => {
    const updatedCart = cartProducts.map(product => {
      if (product._id === productId) {
        let newQty = product.quantity + (type === 'increase' ? 1 : -1);
        newQty = Math.max(newQty, 1);
        return { ...product, quantity: newQty };
      }
      return product;
    });
    updateLocalStorageCart(updatedCart);
  };

  const handleSaveForLater = (productId: string) => {
    const product = cartProducts.find(p => p._id === productId);
    if (!product) return;

    const updatedCart = cartProducts.filter(p => p._id !== productId);
    updateLocalStorageCart(updatedCart);

    const updatedSaved = [...savedForLater, product];
    setSavedForLater(updatedSaved);
    localStorage.setItem('savedForLater', JSON.stringify(updatedSaved));
  };

  const handleMoveToCart = (productId: string) => {
    const product = savedForLater.find(p => p._id === productId);
    if (!product) return;

    const updatedSaved = savedForLater.filter(p => p._id !== productId);
    setSavedForLater(updatedSaved);
    localStorage.setItem('savedForLater', JSON.stringify(updatedSaved));

    const updatedCart = [...cartProducts, { ...product, quantity: 1 }];
    updateLocalStorageCart(updatedCart);
  };

  const handleRemoveSaved = (productId: string) => {
    const updatedSaved = savedForLater.filter(p => p._id !== productId);
    setSavedForLater(updatedSaved);
    localStorage.setItem('savedForLater', JSON.stringify(updatedSaved));
  };

const handlePlaceOrder = () => {
  router.push('/payment');
};

 return (
  <>
    <Header />
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* LEFT SIDE: Address + Cart Items */}
      <div className="lg:col-span-2 space-y-6 bg-gray-50 p-4 rounded shadow-sm">
        {/* Delivery Address */}
        <div className="bg-white p-4 border rounded">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <a href="/shipping" className="text-blue-600">Change</a>
          </div>
          <p className="font-semibold">{address?.fullName}</p>
          <p>{address?.address}</p>
          <p>{address?.phone}</p>
        </div>

        {/* Cart Products */}
        {cartProducts.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartProducts.map((product) => (
                <div key={product._id} className="flex flex-col md:flex-row items-center gap-4 border-b pb-4">
                  <img
                    src={`/uploads/${product.productImages?.[0]?.thumb || ''}`}
                    alt={product.productTitle}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => handleQuantityChange(product._id, 'decrease')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">−</button>
                      <span className="text-lg font-medium">{product.quantity}</span>
                      <button onClick={() => handleQuantityChange(product._id, 'increase')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                      <button onClick={() => handleSaveForLater(product._id)} className="text-blue-600 hover:underline">SAVE FOR LATER</button>
                      <button onClick={() => updateLocalStorageCart(cartProducts.filter(p => p._id !== product._id))} className="text-blue-600 hover:underline">REMOVE</button>
                    </div>
                    <p className="mt-2 text-blue-600 font-bold text-md">₹{product.price * product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved For Later */}
            {savedForLater.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Saved For Later ({savedForLater.length})</h2>
                {savedForLater.map(product => (
                  <div key={product._id} className="flex gap-4 border rounded p-4 shadow-sm bg-white mb-4 items-center">
                    <img
                      src={`/uploads/${product.productImages?.[0]?.thumb || ''}`}
                      alt={product.productTitle}
                      className="w-28 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                      <div className="flex items-center gap-4 mt-4">
                        <button onClick={() => handleMoveToCart(product._id)} className="text-blue-600 font-medium hover:underline">MOVE TO CART</button>
                        <button onClick={() => handleRemoveSaved(product._id)} className="text-blue-600 font-medium hover:underline">REMOVE</button>
                      </div>
                      <p className="mt-2 text-blue-600 font-bold text-md">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Place Order Button */}
            <div className="text-right mt-8">
              <button
                onClick={handlePlaceOrder}
                className="bg-orange-500 text-white px-6 py-3 rounded font-semibold hover:bg-orange-600 transition"
              >
                PLACE ORDER
              </button>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDE: Price Details */}
      <div className="w-full border rounded-lg p-6 shadow-sm bg-white h-fit">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">PRICE DETAILS</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Price ({cartProducts.length} item{cartProducts.length > 1 ? 's' : ''})</span>
            <span>₹{cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹3</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className="text-green-600 line-through">₹40</span>
            <span className="text-green-600 ml-1">Free</span>
          </div>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-semibold text-md">
          <span>Total Amount</span>
          <span className="text-green-600">
            ₹{cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) + 3}
          </span>
        </div>
        <p className="text-green-600 mt-2 text-sm font-medium">
          You will save ₹40 on this order
        </p>
      </div>
    </div>
  </>
);

}
