import React from 'react';
import { Product } from '../types';

interface ViewProductModalProps {
    product: Product;
    onClose: () => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ product, onClose }) => {
    if (!product) return null;

    // Lock background scrolling while modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        // <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        //     <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-[70vh]">
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose(); // Close modal if clicked on overlay
                }
            }}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-[70vh]"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
                <h2 className="text-2xl font-bold mb-4">Product Details</h2>

                <div className="grid grid-cols-2 gap-4">
                    <p><strong>Name:</strong> {product.name || 'N/A'}</p>
                    <p><strong>Description:</strong> {product.description || 'N/A'}</p>
                    <p><strong>Category:</strong> {product.category || 'N/A'}</p>
                    <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                    <p><strong>Supplier:</strong> {product.supplier || 'N/A'}</p>
                    <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
                    <p><strong>Barcode:</strong> {product.barcode || 'N/A'}</p>
                    <p><strong>Purchase Price:</strong> {product.purchase_price ?? 'N/A'}</p>
                    <p><strong>Sale Price:</strong> {product.sale_price ?? 'N/A'}</p>
                    <p><strong>Wholesale Price:</strong> {product.wholesale_price ?? 'N/A'}</p>
                    <p><strong>Distributor Price:</strong> {product.distributor_price ?? 'N/A'}</p>
                    <p><strong>Unit of Measure:</strong> {product.unit_of_measure || 'N/A'}</p>
                    <p><strong>Weight:</strong> {product.weight || 'N/A'}</p>
                    <p><strong>Dimensions:</strong> {product.dimensions || 'N/A'}</p>
                    <p><strong>Color:</strong> {product.color || 'N/A'}</p>
                    <p><strong>Size:</strong> {product.size || 'N/A'}</p>
                    <p><strong>Material:</strong> {product.material || 'N/A'}</p>
                    <p><strong>Tax Rate:</strong> {product.tax_rate ?? 'N/A'}</p>
                    <p><strong>Tax Category:</strong> {product.tax_category || 'N/A'}</p>
                    <p><strong>Track Inventory:</strong> {product.track_inventory ? 'Yes' : 'No'}</p>
                    <p><strong>Allow Backorder:</strong> {product.allow_backorder ? 'Yes' : 'No'}</p>
                    <p><strong>Min Stock Level:</strong> {product.min_stock_level ?? 'N/A'}</p>
                    <p><strong>Max Stock Level:</strong> {product.max_stock_level ?? 'N/A'}</p>
                    <p><strong>Reorder Point:</strong> {product.reorder_point ?? 'N/A'}</p>
                    <p><strong>Reorder Quantity:</strong> {product.reorder_quantity ?? 'N/A'}</p>
                    <p><strong>Is Active:</strong> {product.is_active ? 'Yes' : 'No'}</p>
                    <p><strong>Is Featured:</strong> {product.is_featured ? 'Yes' : 'No'}</p>
                    <p><strong>Is New:</strong> {product.is_new ? 'Yes' : 'No'}</p>
                    <p><strong>Is On Sale:</strong> {product.is_on_sale ? 'Yes' : 'No'}</p>
                    <p><strong>Age Restricted:</strong> {product.age_restricted ? 'Yes' : 'No'}</p>
                    <p><strong>Min Age Required:</strong> {product.min_age_required ?? 'N/A'}</p>
                    {/* <p><strong>Created At:</strong> {product.created_at || 'N/A'}</p>
                    <p><strong>Updated At:</strong> {product.updated_at || 'N/A'}</p> */}
                    <p><strong>Created At:</strong> {product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}</p>
                    <p><strong>Updated At:</strong> {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}</p>

                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewProductModal;
