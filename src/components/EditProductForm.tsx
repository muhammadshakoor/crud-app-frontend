import React, { useState } from 'react';
// import axios from 'axios';
import { Product } from '../types';
import {useAuth} from '../auth/AuthContext'
import api from '../api/axiosInstance';

interface Props {
    product: Product;
    onCancel: () => void;
    onUpdate: () => void;
}

const EditProductForm: React.FC<Props> = ({ product, onCancel, onUpdate }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState<Product>({ ...product });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // await api.put(`http://localhost:8080/api/update/products/${formData.id}`, formData, {
            await api.put(`/update/products/${formData.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 <del>mb-6</del>">
            <h3 className="text-lg font-semibold">Edit Product</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formData.name ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Name" />
                <input name="description" value={formData.description ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Description" />
                <input name="category" value={formData.category ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Category" />
                <input name="brand" value={formData.brand ?? ''} onChange={handleChange} className="p-2 border rounded" placeholder="Brand" />
                <input type="number" name="sale_price" value={formData.sale_price ?? 0} onChange={handleChange} className="p-2 border rounded" placeholder="Sale Price" />
                <input type="number" name="tax_rate" value={formData.tax_rate ?? 0} onChange={handleChange} className="p-2 border rounded" placeholder="Tax Rate" />
            </div>

            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
            </div>
        </form>
    );
};

export default EditProductForm;