import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = '/products?';
      if (search) query += `search=${search}&`;
      if (category) query += `category=${category}`;
      const res = await API.get(query);
      setProducts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-10 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to ShopNow</h1>
        <p className="text-gray-300 text-lg">
          Find the best products at the best prices
        </p>
      </div>

      {/* Search and Filter */}
      <form
        onSubmit={handleSearch}
        className="flex gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Food">Food</option>
        </select>
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Search
        </button>
      </form>

      {/* Products */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-lg">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <h3 className="text-xl font-semibold text-gray-600">
            No products found
          </h3>
          <p className="text-gray-400 mt-2">
            Try a different search or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;