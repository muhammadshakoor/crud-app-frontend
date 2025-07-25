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
import { useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(64); // Default width in pixels (4rem = 64px)
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarWidth(isCollapsed ? 64 : 0); // Toggle between 64px and 0px
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          {/* Responsive Sidebar */}
          <div
            className={`bg-purple-700 text-white p-4 fixed h-full transition-all duration-300 overflow-y-auto ${
              isCollapsed ? 'w-0' : 'w-64'
            }`}
            style={{ width: `${sidebarWidth}px` }}
          >
            <button
              onClick={toggleSidebar}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              {isCollapsed ? '►' : '◄'}
            </button>
            <nav>
              <ul className="space-y-2 mt-8">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-purple-600 ${isActive ? 'bg-purple-800' : ''}`
                    }
                  >
                    <span className="mr-2">📊</span> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-purple-600 ${isActive ? 'bg-purple-800' : ''}`
                    }
                  >
                    <span className="mr-2">📦</span> Products Inventory
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Fixed Header with Logout Button */}
          <div className="flex-1" style={{ marginLeft: `${sidebarWidth}px` }}>
            <header className="bg-blue-600 text-white p-4 fixed top-0 left-0 right-0 z-10 flex justify-between items-center rounded-none">
              <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </header>

            {/* Main Content with Padding for Fixed Header */}
            <main className="container mx-auto p-4 pt-16 max-w-[95vw]" style={{ marginLeft: `${sidebarWidth}px` }}>
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