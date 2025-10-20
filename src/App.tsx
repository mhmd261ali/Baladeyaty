import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import ComplaintForm from './pages/ComplaintForm';
import SuggestionForm from './pages/SuggestionForm';
import PublicInfo from './pages/PublicInfo';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/complaint" element={<ComplaintForm />} />
              <Route path="/suggestion" element={<SuggestionForm />} />
              <Route path="/info" element={<PublicInfo />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              className: 'text-right',
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;