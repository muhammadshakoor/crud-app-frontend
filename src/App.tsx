import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProductList from "./components/ProductList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotAuthorized from "./pages/NotAuthorized";
import Dashboard from "./pages/Dashboard";
import { useState, useRef, useEffect } from "react";

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(220); // Default width in pixels
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Menu button on sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { logout, token, role } = useAuth();
  const navigate = useNavigate();

  const handleMouseDown = () => {
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && sidebarRef.current) {
      const newWidth =
        e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth >= 180 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside
          ref={sidebarRef}
          className="bg-teal-700 text-white flex-shrink-0 relative transition-all duration-300"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Menu Button inside Sidebar */}
          <div className="flex justify-end p-2">
            <button
              onClick={toggleSidebar}
              className="text-white bg-teal-800 hover:bg-teal-600 p-2 rounded"
              title="Hide Menu"
            >
              ❌
            </button>
          </div>

          <div className="p-4 h-full overflow-y-auto">
            <nav>
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg hover:bg-teal-600 ${isActive ? "bg-teal-800 border-l-4 border-teal-300" : ""
                      }`
                    }
                  >
                    <span className="mr-3 text-lg">📊</span>
                    <span className="font-medium">Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg hover:bg-teal-600 ${isActive ? "bg-teal-800 border-l-4 border-teal-300" : ""
                      }`
                    }
                  >
                    <span className="mr-3 text-lg">📦</span>
                    <span className="font-medium">Products Inventory</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Drag Handle */}
          <div
            ref={dragRef}
            onMouseDown={handleMouseDown}
            className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-teal-800 hover:bg-teal-500"
          />
        </aside>
      )}

      {/* Toggle Button (when sidebar is hidden) */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-50 bg-teal-700 text-white p-2 rounded hover:bg-teal-600 shadow-md"
          title="Open Menu"
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`bg-blue-600 text-white px-6 py-4 shadow-lg transition-all duration-300 ${!isSidebarOpen ? "pl-16" : ""}`}>
          <div className="flex items-center justify-center relative">
            <h1 className="text-3xl font-bold text-yellow-400">
              Product Management System
            </h1>

            {/* Logout */}
            {token && (role === "admin" || role === "user") && (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 absolute right-0"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin", "user"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={["admin", "user"]}>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;


// import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./auth/AuthContext";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import ProductList from "./components/ProductList";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import NotAuthorized from "./pages/NotAuthorized";
// import Dashboard from "./pages/Dashboard";
// import { useState, useRef, useEffect, useCallback } from "react";

// function App() {
//   const [sidebarWidth, setSidebarWidth] = useState(220); // Default sidebar width
//   const [isDragging, setIsDragging] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   const { logout, token, role } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Hide sidebar & header for auth pages
//   const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

//   // Toggle sidebar visibility
//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   // Handle dragging for resizing sidebar
//   const handleMouseDown = useCallback(() => {
//     setIsDragging(true);
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (isDragging && sidebarRef.current) {
//         const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
//         if (newWidth >= 180 && newWidth <= 400) {
//           setSidebarWidth(newWidth);
//         }
//       }
//     },
//     [isDragging]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//     document.body.style.cursor = "";
//     document.body.style.userSelect = "";
//   }, []);

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, handleMouseMove, handleMouseUp]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       {!hideLayout && (
//         <>
//           {isSidebarOpen && (
//             <aside
//               ref={sidebarRef}
//               className={`bg-teal-700 text-white flex-shrink-0 relative transition-all duration-300 transform ${
//                 isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//               } md:translate-x-0`}
//               style={{ width: `${sidebarWidth}px` }}
//             >
//               {/* Sidebar Header */}
//               <div className="flex justify-end p-2">
//                 <button
//                   aria-label="Toggle Sidebar"
//                   onClick={toggleSidebar}
//                   className="text-white bg-teal-800 hover:bg-teal-600 p-2 rounded"
//                   title="Hide Menu"
//                 >
//                   ❌
//                 </button>
//               </div>

//               {/* Sidebar Navigation */}
//               <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
//                 <nav>
//                   <ul className="space-y-2">
//                     <li>
//                       <NavLink
//                         to="/dashboard"
//                         className={({ isActive }) =>
//                           `flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-teal-600 ${
//                             isActive ? "bg-teal-800 border-l-4 border-yellow-400" : ""
//                           }`
//                         }
//                       >
//                         <span className="mr-3 text-lg">📊</span>
//                         <span className="font-medium">Dashboard</span>
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink
//                         to="/"
//                         className={({ isActive }) =>
//                           `flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-teal-600 ${
//                             isActive ? "bg-teal-800 border-l-4 border-yellow-400" : ""
//                           }`
//                         }
//                       >
//                         <span className="mr-3 text-lg">📦</span>
//                         <span className="font-medium">Products Inventory</span>
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>

//               {/* Drag Handle */}
//               <div
//                 onMouseDown={handleMouseDown}
//                 role="separator"
//                 aria-orientation="vertical"
//                 className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-teal-800 hover:bg-teal-500"
//               />
//             </aside>
//           )}

//           {/* Sidebar Toggle Button (when hidden) */}
//           {!isSidebarOpen && (
//             <button
//               onClick={toggleSidebar}
//               className="fixed top-20 left-4 z-50 bg-teal-700 text-white p-2 rounded hover:bg-teal-600 shadow-md"
//               title="Open Menu"
//             >
//               ☰
//             </button>
//           )}
//         </>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         {!hideLayout && (
//           <header
//             className={`bg-blue-600 text-white px-6 py-4 shadow-lg sticky top-0 z-50 ${
//               !isSidebarOpen ? "pl-16" : ""
//             }`}
//           >
//             <div className="flex items-center justify-center relative">
//               <h1 className="text-3xl font-bold text-yellow-400">Product Management System</h1>

//               {/* Show username & role and logout button */}
//               {token && (role === "admin" || role === "user") && (
//                 <div className="flex items-center gap-4 absolute right-0">
//                   <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded">
//                     {role.toUpperCase()}
//                   </span>
//                   <button
//                     aria-label="Logout"
//                     onClick={() => {
//                       logout();
//                       navigate("/login");
//                     }}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </header>
//         )}

//         {/* Routes */}
//         <main className="flex-1 overflow-auto bg-white">
//           <div className="container mx-auto p-6">
//             <Routes>
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute allowedRoles={["admin", "user"]}>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute allowedRoles={["admin", "user"]}>
//                     <ProductList />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="/not-authorized" element={<NotAuthorized />} />
//             </Routes>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;



// import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// import { AuthProvider } from './auth/AuthContext';
// import ProtectedRoute from './auth/ProtectedRoute';
// import ProductList from './components/ProductList';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import NotAuthorized from './pages/NotAuthorized';
// import Dashboard from './pages/Dashboard';
// import { useState, useRef, useEffect, useCallback } from 'react';

// // Throttle function to improve performance
// const throttle = (func: Function, delay: number) => {
//   let timeoutId: NodeJS.Timeout;
//   let lastExecTime = 0;
//   return function (...args: any[]) {
//     const currentTime = Date.now();

//     if (currentTime - lastExecTime > delay) {
//       func(...args);
//       lastExecTime = currentTime;
//     } else {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         func(...args);
//         lastExecTime = Date.now();
//       }, delay - (currentTime - lastExecTime));
//     }
//   };
// };

// function App() {
//   const [sidebarWidth, setSidebarWidth] = useState(220); // Default width in pixels
//   const [isDragging, setIsDragging] = useState(false);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const dragRef = useRef<HTMLDivElement>(null);

//   const handleMouseDown = useCallback(() => {
//     setIsDragging(true);
//     document.body.style.cursor = 'col-resize';
//     document.body.style.userSelect = 'none'; // Prevent text selection while dragging
//   }, []);

//   const handleMouseMove = useCallback(
//     throttle((e: MouseEvent) => {
//       if (isDragging && sidebarRef.current) {
//         const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
//         // Constrain width between 180px and 400px for better usability
//         if (newWidth >= 180 && newWidth <= 400) {
//           setSidebarWidth(newWidth);
//         }
//       }
//     }, 16), // ~60fps for smooth resizing
//     [isDragging]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//     document.body.style.cursor = '';
//     document.body.style.userSelect = '';
//   }, []);

//   // Add event listeners when dragging starts and clean up when it stops
//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging, handleMouseMove, handleMouseUp]);

//   // Handle keyboard navigation for accessibility
//   const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
//     if (e.key === 'ArrowLeft' && sidebarWidth > 180) {
//       setSidebarWidth(prev => Math.max(prev - 10, 180));
//     } else if (e.key === 'ArrowRight' && sidebarWidth < 400) {
//       setSidebarWidth(prev => Math.min(prev + 10, 400));
//     }
//   }, [sidebarWidth]);

//   return (
//     <AuthProvider>
//       <Router>
//         <div className="flex min-h-screen bg-gray-100">
//           {/* Resizable Sidebar */}
//           <aside
//             ref={sidebarRef}
//             className="bg-teal-700 text-white flex-shrink-0 relative transition-all duration-200 ease-in-out"
//             style={{ width: `${sidebarWidth}px` }}
//           >
//             {/* Sidebar Content */}
//             <div className="p-4 h-full overflow-y-auto">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold text-teal-100">Navigation</h2>
//               </div>
//               <nav>
//                 <ul className="space-y-2">
//                   <li>
//                     <NavLink
//                       to="/dashboard"
//                       className={({ isActive }) =>
//                         `flex items-center p-3 rounded-lg hover:bg-teal-600 transition-colors duration-200 ${
//                           isActive ? 'bg-teal-800 border-l-4 border-teal-300' : ''
//                         }`
//                       }
//                     >
//                       <span className="mr-3 text-lg">📊</span>
//                       <span className="font-medium">Dashboard</span>
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink
//                       to="/"
//                       className={({ isActive }) =>
//                         `flex items-center p-3 rounded-lg hover:bg-teal-600 transition-colors duration-200 ${
//                           isActive ? 'bg-teal-800 border-l-4 border-teal-300' : ''
//                         }`
//                       }
//                     >
//                       <span className="mr-3 text-lg">📦</span>
//                       <span className="font-medium">Products Inventory</span>
//                     </NavLink>
//                   </li>
//                 </ul>
//               </nav>
//             </div>

//             {/* Drag Handle */}
//             <div
//               ref={dragRef}
//               onMouseDown={handleMouseDown}
//               onKeyDown={handleKeyDown}
//               tabIndex={0}
//               role="separator"
//               aria-label="Resize sidebar"
//               aria-orientation="vertical"
//               className={`absolute right-0 top-0 w-1 h-full cursor-col-resize bg-teal-800 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none transition-colors duration-200 ${
//                 isDragging ? 'bg-teal-500 w-2' : ''
//               }`}
//               style={{
//                 boxShadow: isDragging ? '0 0 10px rgba(0,0,0,0.3)' : 'none'
//               }}
//             />
//           </aside>

//           {/* Main Content Area */}
//           <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 prevents flex child overflow */}
//             {/* Header */}
//             <header className="bg-blue-600 text-white px-6 py-4 shadow-lg z-10">
//               <div className="flex items-center justify-center">
//                 <h1 className="text-3xl font-bold text-yellow-400">
//                   Product Management System
//                 </h1>
//               </div>
//             </header>

//             {/* Main Content */}
//             <main className="flex-1 overflow-auto bg-white">
//               <div className="container mx-auto p-6 max-w-none">
//                 <Routes>
//                   <Route path="/signup" element={<Signup />} />
//                   <Route path="/login" element={<Login />} />
//                   <Route
//                     path="/dashboard"
//                     element={
//                       <ProtectedRoute allowedRoles={['admin', 'user']}>
//                         <Dashboard />
//                       </ProtectedRoute>
//                     }
//                   />
//                   <Route
//                     path="/"
//                     element={
//                       <ProtectedRoute allowedRoles={['admin', 'user']}>
//                         <ProductList />
//                       </ProtectedRoute>
//                     }
//                   />
//                   <Route path="/not-authorized" element={<NotAuthorized />} />
//                 </Routes>
//               </div>
//             </main>
//           </div>
//         </div>

//         {/* Resize Indicator */}
//         {isDragging && (
//           <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm z-50">
//             Width: {sidebarWidth}px
//           </div>
//         )}
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

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
