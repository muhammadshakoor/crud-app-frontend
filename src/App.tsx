// import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import ProductList from './components/ProductList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotAuthorized from './pages/NotAuthorized';
import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-blue-600 text-white p-4 flex justify-center" >
//         <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
//       </header>
//       <main className="container mx-auto p-4">
//         <ProductList />
//       </main>
//     </div>
//   );
// }

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white p-4 flex justify-center">
            <h1 className="text-3xl font-bold text-yellow-400">Product Management</h1>
          </header>
          <main className="container mx-auto p-4  max-w-[95vw]">
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
      </Router>
    </AuthProvider>
  );
}

export default App;