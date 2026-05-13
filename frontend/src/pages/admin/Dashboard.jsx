import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error('Admin access only!');
            navigate('/');
            return;
        }
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await API.get('/admin/stats');
            setStats(res.data.data);
        } catch (error) {
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-400">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Admin Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                        {stats?.totalUsers}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-400">Total Products</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                        {stats?.totalProducts}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                        {stats?.totalOrders}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500">
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                        Rs. {stats?.totalRevenue}
                    </p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-gray-900 text-white rounded-2xl p-6 text-left hover:bg-gray-800 transition"
                >
                    <p className="text-3xl mb-2">📦</p>
                    <p className="font-semibold text-lg">Manage Products</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Add, edit or delete products
                    </p>
                </button>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="bg-gray-900 text-white rounded-2xl p-6 text-left hover:bg-gray-800 transition"
                >
                    <p className="text-3xl mb-2">🛒</p>
                    <p className="font-semibold text-lg">Manage Orders</p>
                    <p className="text-gray-400 text-sm mt-1">
                        View and update order status
                    </p>
                </button>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="bg-gray-900 text-white rounded-2xl p-6 text-left hover:bg-gray-800 transition"
                >
                    <p className="text-3xl mb-2">👥</p>
                    <p className="font-semibold text-lg">Manage Users</p>
                    <p className="text-gray-400 text-sm mt-1">
                        View all registered users
                    </p>
                </button>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">Recent Orders</h2>
                {stats?.recentOrders?.length === 0 ? (
                    <p className="text-gray-400 text-sm">No orders yet</p>
                ) : (
                    <div className="space-y-3">
                        {stats?.recentOrders?.map((order) => (
                            <div
                                key={order._id}
                                className="flex justify-between items-center border-b pb-3"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {order.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-red-500">
                                        Rs. {order.totalPrice}
                                    </p>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Recent Users</h2>
                <div className="space-y-3">
                    {stats?.recentUsers?.map((u) => (
                        <div
                            key={u._id}
                            className="flex justify-between items-center border-b pb-3"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-700">{u.name}</p>
                                <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                {u.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;