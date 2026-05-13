import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold text-red-400 hover:text-red-300 transition">
        🛒 ShopNow
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm hover:text-red-400 transition">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/cart" className="text-sm hover:text-red-400 transition">
              🛒 Cart
            </Link>
            <Link to="/orders" className="text-sm hover:text-red-400 transition">
              📦 Orders
            </Link>

            {/* Show admin link only if user is admin */}
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
              >
                ⚙️ Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:text-red-400 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;