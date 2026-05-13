import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/myorders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📦</p>
          <h3 className="text-xl font-semibold text-gray-600">No orders yet</h3>
          <p className="text-gray-400 mt-2">Place your first order!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="text-sm font-mono text-gray-600">{order._id}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span className="text-gray-500">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-bold text-red-500">
                  Total: Rs. {order.totalPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;