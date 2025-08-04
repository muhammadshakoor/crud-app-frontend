// // src/components/AddProductForm.tsx

// import React, { useState } from 'react';
// // import axios from 'axios';
// import { Product } from '../types';
// import { useAuth } from '../auth/AuthContext.tsx';
// import api from '../api/axiosInstance.ts';

// interface Props {
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// const AddProductForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
//   const { token } = useAuth();
//   const [formData, setFormData] = useState<Partial<Product>>({
//     name: '',
//     description: '',
//     category: '',
//     brand: '',
//     supplier: '',
//     sale_price: 0,
//     tax_rate: 0,
//     track_inventory: true,
//     min_stock_level: 0,
//     image_urls: [],
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'number' ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post('/add/products', formData, {
//         headers: {Authorization: `Bearer ${token}`},
//       });
//       onSuccess(); // Refresh list
//     } catch (err) {
//       console.error('Failed to add product:', err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
//       <h3 className="text-lg font-semibold">Add New Product</h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input name="name" value={formData.name ?? ''} onChange={handleChange} placeholder="Name" className="p-2 border rounded" />
//         <input name="description" value={formData.description ?? ''} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />
//         <input name="category" value={formData.category ?? ''} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
//         <input name="brand" value={formData.brand ?? ''} onChange={handleChange} placeholder="Brand" className="p-2 border rounded" />
//         <input name="supplier" value={formData.supplier ?? ''} onChange={handleChange} placeholder="Supplier" className="p-2 border rounded" />
//         <input type="number" name="sale_price" value={formData.sale_price ?? 0} onChange={handleChange} placeholder="Sale Price" className="p-2 border rounded" />
//         <input type="number" name="tax_rate" value={formData.tax_rate ?? 0} onChange={handleChange} placeholder="Tax Rate" className="p-2 border rounded" />
//         <input type="number" name="min_stock_level" value={formData.min_stock_level ?? 0} onChange={handleChange} placeholder="Min Stock" className="p-2 border rounded" />
//       </div>

//       <div className="flex justify-end space-x-2">
//         <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
//         <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add</button>
//       </div>
//     </form>
//   );
// };

// export default AddProductForm;

// src/components/AddProductForm.tsx

import React, { useState } from 'react';
import { Product } from '../types';
import { useAuth } from '../auth/AuthContext.tsx';
import api from '../api/axiosInstance.ts';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddProductForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const { token } = useAuth();

  // Use empty string for numeric fields to allow placeholders to show
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    supplier: '',
    sale_price: '',
    tax_rate: '',
    track_inventory: true,
    min_stock_level: '',
    image_urls: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert string numbers to actual numbers before sending
      const payload: Partial<Product> = {
        ...formData,
        sale_price: formData.sale_price ? Number(formData.sale_price) : 0,
        tax_rate: formData.tax_rate ? Number(formData.tax_rate) : 0,
        min_stock_level: formData.min_stock_level ? Number(formData.min_stock_level) : 0,
      };

      await api.post('/add/products', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(); // Refresh list or close modal
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Add New Product</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-2 border rounded"
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
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;

