import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import api from '../api/axiosInstance';
import { useAuth } from '../auth/AuthContext';

interface BulkUploadModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { token } = useAuth();
    //Handle click outside
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select an Excel file');
            return;
        }

        setUploading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            //   const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const rawData = XLSX.utils.sheet_to_json<any>(worksheet);

            // Clean & validate each row
            const cleanedData = rawData
                .filter((item) => item.name && item.sale_price) // require essential fields
                .map((item) => ({
                    name: item.name?.toString().trim(),
                    description: item.description?.toString().trim() || '',
                    category: item.category?.toString().trim() || '',
                    brand: item.brand?.toString().trim() || '',
                    supplier: item.supplier?.toString().trim() || '',
                    sku: item.sku?.toString().trim() || '',
                    barcode: item.barcode?.toString().trim() || '',
                    sale_price: parseFloat(item.sale_price) || 0,
                    tax_rate: parseFloat(item.tax_rate) || 0,
                    track_inventory: item.track_inventory?.toString().toLowerCase() === 'yes',
                    min_stock_level: parseInt(item.min_stock_level) || 0,
                }));

            if (cleanedData.length === 0) {
                alert('No valid products found in file.');
                return;
            }



            // POST to backend
            await api.post('/bulk-create/products', cleanedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Bulk upload successful!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Bulk upload failed:', error);
            alert('Failed to upload. Please check file format or try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            {/* <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"> */}
                <div
                    ref={modalRef}
                    className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                >
                <h2 className="text-xl font-bold mb-4">Bulk Upload Products</h2>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="mb-4"
                />
                <div className="flex justify-end gap-3">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={onClose}
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkUploadModal;
