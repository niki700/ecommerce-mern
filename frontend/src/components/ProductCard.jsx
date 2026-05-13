import API from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart', {
        productId: product._id,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between">

      {/* Product Image — shows real image or placeholder */}
      <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-4 overflow-hidden">
        {product.images &&
          product.images.length > 0 &&
          product.images[0].url ? (
          // Real image from Cloudinary
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          // Placeholder if no image
          <span className="text-5xl">📦</span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-gray-800 font-semibold text-lg mt-1 mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-red-500 font-bold text-xl">
            Rs. {product.price}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`w-full py-2 rounded-xl font-medium transition text-white ${product.stock === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 cursor-pointer'
          }`}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;