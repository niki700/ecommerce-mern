import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/admin/orders');
            setOrders(res.data.data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Manage Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">📋</p>
                    <h3 className="text-xl font-semibold text-gray-600">No orders yet</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-gray-400">Order ID</p>
                                    <p className="text-sm font-mono">{order._id}</p>
                                    <p className="text-sm font-medium text-gray-700 mt-1">
                                        👤 {order.user?.name} — {order.user?.email}
                                    </p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className="border-t border-gray-100 pt-3 mb-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm py-1">
                                        <span className="text-gray-600">
                                            {item.product?.name} × {item.quantity}
                                        </span>
                                        <span className="text-gray-500">
                                            Rs. {item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Update Status:</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-red-400"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <span className="font-bold text-red-500">
                                    Rs. {order.totalPrice}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;