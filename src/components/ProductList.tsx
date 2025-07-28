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
            {products.length > 0 ? (
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



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Product } from '../types';
// import AddProductForm from './AddProductForm.tsx'
// import EditProductForm from './EditProductForm.tsx';
// import ViewProductModal from './ViewProductModal.tsx';


// const ProductList: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   const [nameFilter, setNameFilter] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [priceFilter, setPriceFilter] = useState('');
//   const [minStockFilter, setMinStockFilter] = useState('');



//   // Fetch products from backend
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/products');
//         setProducts(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch products');
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Handle delete product
//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await axios.delete(`http://localhost:8080/api/products/${id}`);
//         setProducts(products.filter(product => product.id !== id));
//       } catch (err) {
//         setError('Failed to delete product');
//       }
//     }
//   };

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   // Apply filters
//   const filteredProducts = products.filter(product => {
//     const matchesName = nameFilter === '' || (product.name && product.name.toLowerCase().includes(nameFilter.toLowerCase()));
//     const matchesCategory = categoryFilter === '' || (product.category && product.category.toLowerCase().includes(categoryFilter.toLowerCase()));
//     const matchesPrice = priceFilter === '' || (product.sale_price !== null && product.sale_price >= parseFloat(priceFilter));
//     const matchesMinStock = minStockFilter === '' || product.min_stock_level >= parseInt(minStockFilter);
//     return matchesName && matchesCategory && matchesPrice && matchesMinStock;
//   });


//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden">
//       <div className="p-4">
//         <h1 className="text-3xl font-semibold text-white mb-4 text-center bg-orange-900 p-4 rounded-xl">Products</h1>
//         <button
//           className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 content-center flex mx-auto"
//           onClick={() => setShowAddForm(true)} //alert('Create product functionality to be implemented'
//         >
//           Add Product
//         </button>

//         {/* Filter Inputs*/}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//           <input
//             type="text"
//             placeholder="Filter by Name"
//             className="border px-3 py-2 rounded w-full"
//             value={nameFilter}
//             onChange={(e) => setNameFilter(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Filter by Category"
//             className="border px-3 py-2 rounded w-full"
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Min Sale Price"
//             className="border px-3 py-2 rounded w-full"
//             value={priceFilter}
//             onChange={(e) => setPriceFilter(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Min Stock Level"
//             className="border px-3 py-2 rounded w-full"
//             value={minStockFilter}
//             onChange={(e) => setMinStockFilter(e.target.value)}
//           />
//         </div>


//         {showAddForm && (
//           <AddProductForm
//             onSuccess={() => {
//               setShowAddForm(false);
//               window.location.reload(); // Or refetch products if preferred
//             }}
//             onCancel={() => setShowAddForm(false)}
//           />
//         )}

//         {editingProduct && (
//           <EditProductForm
//             product={editingProduct}
//             onCancel={() => setEditingProduct(null)}
//             onUpdate={() => {
//               setEditingProduct(null);
//               window.location.reload(); // or re-fetch product list
//             }}
//           />
//         )}

//         {viewingProduct && (
//           <ViewProductModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
//         )}

//         {/*Table*/}
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-2 text-left">Name</th>
//                 <th className="px-4 py-2 text-left">Description</th>
//                 <th className="px-4 py-2 text-left">Category</th>
//                 <th className="px-4 py-2 text-left">Brand</th>
//                 <th className="px-4 py-2 text-left">Supplier</th>
//                 <th className="px-4 py-2 text-left">SKU</th>
//                 <th className="px-4 py-2 text-left">Barcode</th>
//                 <th className="px-4 py-2 text-left">Sale Price</th>
//                 <th className="px-4 py-2 text-left">Tax Rate</th>
//                 <th className="px-4 py-2 text-left">Track Inventory</th>
//                 <th className="px-4 py-2 text-left">Min Stock</th>
//                 <th className="px-4 py-2 text-left">Images</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* {products.length > 0 && products.map(product => ( */}
//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map(product => (
//                   <tr key={product.id} className="border-t">
//                     <td className="px-4 py-2">{product.name || 'N/A'}</td>
//                     <td className="px-4 py-2">{product.description || 'N/A'}</td>
//                     <td className="px-4 py-2">{product.category || 'N/A'}</td>
//                     <td className="px-4 py-2">{product.brand || 'N/A'}</td>
//                     <td className="px-4 py-2">{product.supplier || 'N/A'}</td>
//                     <td className="px-4 py-2">{product.sku || 'N/A'}</td>
//                     <td className="px-4 py-2">{product.barcode || 'N/A'}</td>
//                     <td className="px-4 py-2">
//                       {product.sale_price ? `$${Number(product?.sale_price)?.toFixed(2)}` : 'N/A'}
//                     </td>
//                     <td className="px-4 py-2">
//                       {product.tax_rate ? `${product.tax_rate}%` : 'N/A'}
//                     </td>
//                     <td className="px-4 py-2">
//                       {product.track_inventory ? 'Yes' : 'No'}
//                     </td>
//                     <td className="px-4 py-2">{product.min_stock_level}</td>

//                     <td className="px-4 py-2 text-center">
//                       <button
//                         onClick={() => setViewingProduct(product)}
//                         className="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition"
//                       >
//                         View
//                       </button>
//                     </td>
//                     <td className="px-4 py-2 flex space-x-2">
//                       <button
//                         className="text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition mt-5"
//                         onClick={() => setEditingProduct(product)} // alert('Edit product functionality to be implemented')
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition mt-5"
//                         onClick={() => handleDelete(product.id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={13} className="text-center py-4 text-gray-500">
//                     No products match the filter criteria.
//                   </td>
//                 </tr>
//               )
//               }
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;