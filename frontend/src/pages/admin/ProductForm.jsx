import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams(); // if id exists = edit mode
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        // If edit mode fetch existing product data
        if (isEditMode) {
            fetchProduct();
        }
    }, [user, id]);

    const fetchProduct = async () => {
        try {
            const res = await API.get(`/products/${id}`);
            const p = res.data.data;
            setFormData({
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                stock: p.stock,
            });
            setExistingImages(p.images || []);
        } catch (error) {
            toast.error('Failed to load product');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Create preview URLs
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Use FormData because we are sending files
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);

            // Append each image file
            images.forEach((image) => {
                data.append('images', image);
            });

            if (isEditMode) {
                await API.put(`/products/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product updated successfully!');
            } else {
                await API.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product created successfully!');
            }

            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Price (Rs.)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                min="0"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                min="0"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                        >
                            <option value="">Select a category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Books">Books</option>
                            <option value="Food">Food</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Product Images
                        </label>

                        {/* Show existing images in edit mode */}
                        {isEditMode && existingImages.length > 0 && (
                            <div className="flex gap-2 mb-3">
                                {existingImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        alt="existing"
                                        className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                ))}
                                <p className="text-xs text-gray-400 self-end mb-1">
                                    Current images
                                </p>
                            </div>
                        )}

                        {/* File input */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition cursor-pointer">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="imageInput"
                            />
                            <label htmlFor="imageInput" className="cursor-pointer">
                                <p className="text-4xl mb-2">📷</p>
                                <p className="text-sm text-gray-500">
                                    Click to upload images
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    JPG, PNG, WebP up to 5 images
                                </p>
                            </label>
                        </div>

                        {/* Image previews */}
                        {previews.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {previews.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`preview ${index}`}
                                        className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        {loading
                            ? isEditMode ? 'Updating...' : 'Creating...'
                            : isEditMode ? 'Update Product' : 'Create Product'
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;