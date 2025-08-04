import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { Product } from '../types';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import ViewProductModal from './ViewProductModal';
import { XCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import BulkUploadModal from './BulkUploadModal';
import { exportBarcodes } from '../utils/exportBarcodes';



const ProductList: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [minStockFilter, setMinStockFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [uniqueSuppliers, setUniqueSuppliers] = useState<string[]>([]);

  // Export all barcodes
  const handleExportAllBarcodes = async () => {
    try {
      const response = await api.get('/get/all-products', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          name: nameFilter,
          category: categoryFilter,
          min_price: priceFilter,
          min_stock: minStockFilter,
          brand: brandFilter,
          supplier: supplierFilter,
        },
      });

      const allProducts = response.data;
      await exportBarcodes(allProducts); // uses your utility
    } catch (err) {
      console.error('Failed to export all barcodes:', err);
      alert('Failed to export barcodes.');
    }
  };



  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // const hasFilters =
      //   nameFilter || categoryFilter || priceFilter || minStockFilter || brandFilter || supplierFilter;

      const response = await api.get(`/get/products`, { // http://localhost:8080/api/products
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          name: nameFilter,
          category: categoryFilter,
          min_price: priceFilter,
          min_stock: minStockFilter,
          brand: brandFilter,
          supplier: supplierFilter,
        },
      });

      // const response = await api.get(`/products`);
      // const { products, totalPages } = response.data;
      // setProducts(products);
      // setTotalPages(totalPages);
      const { products, totalPages, categories, brands, suppliers } = response.data;
      setProducts(products);
      setTotalPages(totalPages);
      setUniqueCategories(categories || []);
      setUniqueBrands(brands || []);
      setUniqueSuppliers(suppliers || []);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Session expired. Please log in again.');
        logout();
        navigate('/login') // Redirect here
      } else {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [nameFilter, categoryFilter, priceFilter, minStockFilter, brandFilter, supplierFilter, currentPage, itemsPerPage]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/delete/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error(err);
        setError('Failed to delete product');
      }
    }
  };

  const resetFilters = () => {
    setNameFilter('');
    setCategoryFilter('');
    setPriceFilter('');
    setMinStockFilter('');
    setBrandFilter('');
    setSupplierFilter('');
    setCurrentPage(1);
  };

  // if (loading) return <div className="text-center py-10">Loading...</div>;
  // if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  // Stop background scrolling when editproductmodal is open
  useEffect(() => {
    if (editingProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [editingProduct]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 ">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          📦
        </span>
        PRODUCTS
      </h1>

      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-4 items-stretch sm:items-center'>
        <button
          className="bg-blue-500 text-white border px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowAddForm(true)}
        >
          Add Product
        </button>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Create */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Filters</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
          >
            Bulk Create
          </button>

          <button
            onClick={handleExportAllBarcodes}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-200"
          >
            Export All Barcodes
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>



      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by Name"
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <select
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Stock"
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={minStockFilter}
          onChange={(e) => setMinStockFilter(e.target.value)}
        />
        <select
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="">All Brands</option>
          {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        >
          <option value="">All Suppliers</option>
          {uniqueSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 text-red-600 border border-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition duration-200"
          onClick={resetFilters}
        >
          <XCircle className="w-4 h-4" />
          Clear Filters
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-3">
        </div>
      </div>

      {/* Render Bulk Create */}
      {showBulkUploadModal && (
        <BulkUploadModal
          onClose={() => setShowBulkUploadModal(false)}
          onSuccess={fetchProducts}
        />
      )}


      {showAddForm && (
        <AddProductForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onUpdate={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )} */}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingProduct(null); // Close modal if clicked on overlay
            }
          }}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            <EditProductForm
              product={editingProduct}
              onCancel={() => setEditingProduct(null)}
              onUpdate={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {viewingProduct && (
        <ViewProductModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {error && (
        <div className="text-center text-red-500 py-2">
          {error}
        </div>
      )}

      {/* Product Table */}
      {loading ? <div className="overflow-x-auto">Loading...</div> : <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Brand</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Barcode</th>
              <th className="px-4 py-2 text-left">Sale Price</th>
              <th className="px-4 py-2 text-left">Tax Rate</th>
              <th className="px-4 py-2 text-left">Track Inventory</th>
              <th className="px-4 py-2 text-left">Min Stock</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="hover:bg-gray-100 transition-colors duration-200 border">
                  <td className="px-4 py-2">{product.name || 'N/A'}</td>
                  <td className="px-4 py-2">{product.description || 'N/A'}</td>
                  <td className="px-4 py-2">{product.category || 'N/A'}</td>
                  <td className="px-4 py-2">{product.brand || 'N/A'}</td>
                  <td className="px-4 py-2">{product.supplier || 'N/A'}</td>
                  <td className="px-4 py-2">{product.sku || 'N/A'}</td>
                  <td className="px-4 py-2">{product.barcode || 'N/A'}</td>
                  <td className="px-4 py-2">{product.sale_price ? `$${Number(product.sale_price).toFixed(2)}` : 'N/A'}</td>
                  <td className="px-4 py-2">{product.tax_rate ? `${product.tax_rate}%` : 'N/A'}</td>
                  <td className="px-4 py-2">{product.track_inventory ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{product.min_stock_level || 'N/A'}</td>
                  <td className="px-4 py-5 flex gap-2 justify-center items-center">
                    <button onClick={() => setViewingProduct(product)} className="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-2 py-1 text-sm rounded transition duration-200">👁️ {/*View*/}</button>
                    <button onClick={() => setEditingProduct(product)} className="text-green-600 border border-green-600 hover:bg-green-600 hover:text-white px-2 py-1 text-sm rounded transition duration-200">✏️ {/*Edit*/}</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white px-2 py-1 text-sm rounded transition duration-200">🗑️ {/*Delete*/}</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="text-center py-6 text-gray-500 animate-pulse">
                  <div className="flex flex-col items-center">
                    <XCircle className="w-8 h-8 text-red-400 mb-2" />
                    No products match the filter criteria.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>}

      {/* Pagination Button */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;


// import React, { useEffect, useState, useCallback } from 'react';
// import { Product } from '../types';
// import AddProductForm from './AddProductForm';
// import EditProductForm from './EditProductForm';
// import ViewProductModal from './ViewProductModal';
// import BulkUploadModal from './BulkUploadModal';
// import { useAuth } from '../auth/AuthContext';
// import api from '../api/axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { exportBarcodes } from '../utils/exportBarcodes';
// import { XCircle } from 'lucide-react';

// const ProductList: React.FC = () => {
//   const { token, logout } = useAuth();
//   const navigate = useNavigate();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

//   // Pagination & Filters
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const [filters, setFilters] = useState({
//     name: '',
//     category: '',
//     brand: '',
//     supplier: '',
//     price: '',
//     minStock: '',
//   });

//   const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
//   const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
//   const [uniqueSuppliers, setUniqueSuppliers] = useState<string[]>([]);

//   // Sorting
//   const [sortField, setSortField] = useState<string>('name');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   // Debounce function for filters
//   const debounce = (func: Function, delay: number) => {
//     let timer: NodeJS.Timeout;
//     return (...args: any[]) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => func(...args), delay);
//     };
//   };

//   const fetchProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/get/products`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           page: currentPage,
//           limit: itemsPerPage,
//           name: filters.name,
//           category: filters.category,
//           brand: filters.brand,
//           supplier: filters.supplier,
//           min_price: filters.price,
//           min_stock: filters.minStock,
//           sort_by: sortField,
//           order: sortOrder,
//         },
//       });

//       const { products, totalPages, categories, brands, suppliers } = response.data;
//       setProducts(products);
//       setTotalPages(totalPages);
//       setUniqueCategories(categories || []);
//       setUniqueBrands(brands || []);
//       setUniqueSuppliers(suppliers || []);
//     } catch (err: any) {
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         alert('Session expired. Please log in again.');
//         logout();
//         navigate('/login');
//       } else {
//         setError('Failed to fetch products');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [token, currentPage, itemsPerPage, filters, sortField, sortOrder, logout, navigate]);

//   // Debounced fetch for filters
//   const debouncedFetch = useCallback(debounce(fetchProducts, 500), [fetchProducts]);

//   useEffect(() => {
//     debouncedFetch();
//   }, [filters, currentPage, itemsPerPage, sortField, sortOrder, debouncedFetch]);

//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await api.delete(`/delete/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchProducts();
//       } catch {
//         setError('Failed to delete product');
//       }
//     }
//   };

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('asc');
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6">
//       <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
//         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">📦</span>
//         Products
//       </h1>

//       {/* Top Actions */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add Product
//         </button>

//         <div className="flex gap-2">
//           <select
//             value={itemsPerPage}
//             onChange={(e) => {
//               setItemsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border px-3 py-2 rounded"
//           >
//             {[5, 10, 20, 50].map((n) => (
//               <option key={n} value={n}>
//                 {n} per page
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={() => setShowBulkUploadModal(true)}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Bulk Upload
//           </button>
//           <button
//             onClick={() => exportBarcodes(products)}
//             className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//           >
//             Export Barcodes
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Filter by Name"
//           className="px-3 py-2 border rounded"
//           value={filters.name}
//           onChange={(e) => setFilters({ ...filters, name: e.target.value })}
//         />
//         <select
//           value={filters.category}
//           onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//           className="px-3 py-2 border rounded"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map((c) => (
//             <option key={c} value={c}>
//               {c}
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           placeholder="Min Price"
//           className="px-3 py-2 border rounded"
//           value={filters.price}
//           onChange={(e) => setFilters({ ...filters, price: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="Min Stock"
//           className="px-3 py-2 border rounded"
//           value={filters.minStock}
//           onChange={(e) => setFilters({ ...filters, minStock: e.target.value })}
//         />
//         <select
//           value={filters.brand}
//           onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
//           className="px-3 py-2 border rounded"
//         >
//           <option value="">All Brands</option>
//           {uniqueBrands.map((b) => (
//             <option key={b} value={b}>
//               {b}
//             </option>
//           ))}
//         </select>
//         <select
//           value={filters.supplier}
//           onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
//           className="px-3 py-2 border rounded"
//         >
//           <option value="">All Suppliers</option>
//           {uniqueSuppliers.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Product Table */}
//       <div className="overflow-x-auto">
//         {loading ? (
//           <div className="text-center py-6 animate-pulse text-gray-500">Loading products...</div>
//         ) : products.length > 0 ? (
//           <table className="min-w-full border border-gray-300 rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 {['Name', 'Description', 'Category', 'Brand', 'Price', 'Stock'].map((col) => (
//                   <th
//                     key={col}
//                     onClick={() => handleSort(col.toLowerCase())}
//                     className="px-4 py-2 text-left cursor-pointer hover:text-blue-600"
//                   >
//                     {col} {sortField === col.toLowerCase() && (sortOrder === 'asc' ? '▲' : '▼')}
//                   </th>
//                 ))}
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr key={product.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-2">{product.name}</td>
//                   <td className="px-4 py-2">{product.description || 'N/A'}</td>
//                   <td className="px-4 py-2">{product.category}</td>
//                   <td className="px-4 py-2">{product.brand}</td>
//                   <td className="px-4 py-2">${product.sale_price ? `$${Number(product.sale_price).toFixed(2)}` : 'N/A'}</td>
//                   <td className="px-4 py-2">{product.min_stock_level}</td>
//                   <td className="px-4 py-2 flex gap-2">
//                     <button
//                       onClick={() => setViewingProduct(product)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => setEditingProduct(product)}
//                       className="text-green-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="text-center py-6 text-gray-500">No products found</div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-4 mt-6">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Modals */}
//       {showAddForm && (
//         <AddProductForm
//           onSuccess={() => {
//             setShowAddForm(false);
//             fetchProducts();
//           }}
//           onCancel={() => setShowAddForm(false)}
//         />
//       )}

//       {editingProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <EditProductForm
//               product={editingProduct}
//               onCancel={() => setEditingProduct(null)}
//               onUpdate={() => {
//                 setEditingProduct(null);
//                 fetchProducts();
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {viewingProduct && (
//         <ViewProductModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
//       )}

//       {showBulkUploadModal && (
//         <BulkUploadModal onClose={() => setShowBulkUploadModal(false)} onSuccess={fetchProducts} />
//       )}
//     </div>
//   );
// };

// export default ProductList;
