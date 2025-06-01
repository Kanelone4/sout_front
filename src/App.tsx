import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';
import Settings from '../src/pages/settings';
import NotFound from '../src/pages/NotFoud';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {
  return (
    <Router>
      <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          
          
          {/* Route pour les pages non trouvées */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;