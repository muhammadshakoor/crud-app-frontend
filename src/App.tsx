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
import { useState, useRef, useEffect } from 'react';

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(64); // Default width in pixels (4rem = 64px)
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 50 && newWidth < 300) { // Constrain width between 50px and 300px
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners when component mounts and clean up when unmounts
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          {/* Draggable Sidebar (starts at top) */}
          <div
            ref={sidebarRef}
            className="bg-teal-700 text-white p-4 fixed h-full overflow-y-auto transition-all duration-300 z-20"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div
              ref={dragRef}
              onMouseDown={handleMouseDown}
              className="absolute right-0 top-0 w-2 h-full cursor-col-resize bg-teal-800 hover:bg-teal-600"
            />
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

          {/* Fixed Header (starts after sidebar, centered title) */}
          <div className="flex-1" style={{ marginLeft: `${sidebarWidth}px` }}>
            <header className="bg-blue-600 text-white p-4 fixed top-0 z-30 flex justify-center items-center rounded-none" 
                    style={<ins>marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)`</ins><del>marginLeft: `${sidebarWidth}px`</del>}>
              <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
            </header>

            {/* Main Content (width matches header, starts after sidebar) */}
            <main className="container mx-auto p-4 pt-16" 
                  style={<ins>marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)`, maxWidth: `calc(100% - ${sidebarWidth}px)`</ins><del>marginLeft: `${sidebarWidth}px`, maxWidth: `calc(100% - ${sidebarWidth}px)`</del>}>
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