// // import React from 'react';
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import { AuthProvider } from './auth/AuthContext';
// import ProtectedRoute from './auth/ProtectedRoute';
// import ProductList from './components/ProductList';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import NotAuthorized from './pages/NotAuthorized';
// import Dashboard from './pages/Dashboard';

// // function App() {
// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <header className="bg-blue-600 text-white p-4 flex justify-center" >
// //         <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
// //       </header>
// //       <main className="container mx-auto p-4">
// //         <ProductList />
// //       </main>
// //     </div>
// //   );
// // }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-100">
//           <header className="bg-blue-600 text-white p-4 flex justify-center">
//             <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
//           </header>
//           <main className="container mx-auto p-4  max-w-[95vw]">
//             <Routes>
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'user']}><Dashboard /></ProtectedRoute>} />
//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute allowedRoles={['admin', 'user']}>
//                     <ProductList />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="/not-authorized" element={<NotAuthorized />} />
//             </Routes>
//           </main>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import ProductList from './components/ProductList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotAuthorized from './pages/NotAuthorized';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          {/* Fixed Sidebar */}
          <div className="w-64 bg-teal-700 text-white p-4 fixed h-full overflow-y-auto">
            <nav>
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-teal-600 ${isActive ? 'bg-teal-800' : ''}`
                    }
                  >
                    <span className="mr-2">📊</span> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-teal-600 ${isActive ? 'bg-teal-800' : ''}`
                    }
                  >
                    <span className="mr-2">📦</span> Products Inventory
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content with Margin for Fixed Sidebar */}
          <div className="flex-1 ml-64 p-4">
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center mb-4 rounded">
              <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded">Bulk Create</button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded">Export All Barcodes</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
              </div>
            </header>
            <main className="container mx-auto p-4 max-w-[95vw]">
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'user']}><Dashboard /></ProtectedRoute>} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'user']}>
                      <ProductList />
                    </ProtectedRoute>
                  }
                />
                <Route path="/not-authorized" element={<NotAuthorized />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;