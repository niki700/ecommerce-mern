import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    country: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      toast.success('Item removed');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.country) {
      toast.error('Please fill in all address fields');
      return;
    }
    try {
      await API.post('/orders', { shippingAddress: address });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <h3 className="text-xl font-semibold text-gray-600">
            Your cart is empty
          </h3>
          <p className="text-gray-400 mt-2">Add some products first!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.product?.name || 'Product'}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.quantity} × Rs. {item.price}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-500">
                    Rs. {item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => handleRemove(item.product?._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-900 text-white rounded-2xl p-5 flex justify-between items-center mb-6">
            <span className="text-lg">Total Amount</span>
            <span className="text-2xl font-bold text-red-400">
              Rs. {cart.totalPrice}
            </span>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Street</label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;