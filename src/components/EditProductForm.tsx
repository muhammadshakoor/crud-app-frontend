// import React, { useState } from 'react';
// // import axios from 'axios';
// import { Product } from '../types';
// import {useAuth} from '../auth/AuthContext'
// import api from '../api/axiosInstance';

// interface Props {
//     product: Product;
//     onCancel: () => void;
//     onUpdate: () => void;
// }

// const EditProductForm: React.FC<Props> = ({ product, onCancel, onUpdate }) => {
//     const { token } = useAuth();
//     const [formData, setFormData] = useState<Product>({ ...product });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'number' ? Number(value) : value,
//         }))
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             // await api.put(`http://localhost:8080/api/update/products/${formData.id}`, formData, {
//             await api.put(`/update/products/${formData.id}`, formData, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             onUpdate();
//         } catch (error) {
//             console.error('Error updating product:', error);
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 <del>mb-6</del>">
//             <h3 className="text-lg font-semibold">Edit Product</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input name="name" value={formData.name ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Name" />
//                 <input name="description" value={formData.description ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Description" />
//                 <input name="category" value={formData.category ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Category" />
//                 <input name="brand" value={formData.brand ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Brand" />
//                 <input type="number" name="sale_price" value={formData.sale_price ?? 0} onChange={handleChange} className="p-2 border rounded" placeholder="Sale Price" />
//                 <input type="number" name="tax_rate" value={formData.tax_rate ?? 0} onChange={handleChange} className="p-2 border rounded" placeholder="Tax Rate" />
//             </div>

//             <div className="flex justify-end space-x-2">
//                 <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//                 <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
//             </div>
//         </form>
//     );
// };

// export default EditProductForm;

import React, { useState } from 'react';
import { Product } from '../types';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axiosInstance';

interface Props {
  product: Product;
  onCancel: () => void;
  onUpdate: () => void;
}

const EditProductForm: React.FC<Props> = ({ product, onCancel, onUpdate }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    brand: product.brand || '',
    supplier: product.supplier || '',
    sale_price: product.sale_price ? product.sale_price.toString() : '',
    tax_rate: product.tax_rate ? product.tax_rate.toString() : '',
    min_stock_level: product.min_stock_level ? product.min_stock_level.toString() : '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.sale_price) {
      setError('Sale Price is required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload: Partial<Product> = {
        ...product, // keep existing properties like id
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        supplier: formData.supplier.trim(),
        sale_price: Number(formData.sale_price) || 0,
        tax_rate: Number(formData.tax_rate) || 0,
        min_stock_level: Number(formData.min_stock_level) || 0,
      };

      await api.put(`/update/products/${product.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onUpdate(); // refresh list or close modal
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold">Edit Product</h3>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-2 border rounded"
          required
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <input
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="p-2 border rounded"
        />
        <input
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          placeholder="Supplier"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="sale_price"
          value={formData.sale_price}
          onChange={handleChange}
          placeholder="Sale Price"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="tax_rate"
          value={formData.tax_rate}
          onChange={handleChange}
          placeholder="Tax Rate"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="min_stock_level"
          value={formData.min_stock_level}
          onChange={handleChange}
          placeholder="Min Stock"
          className="p-2 border rounded"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
