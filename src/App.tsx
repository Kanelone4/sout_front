import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';
import Settings from '../src/pages/settings';
import NotFound from '../src/pages/NotFoud';


function App() {
  return (
    <Router>
      <Routes>
          {/* Route par défaut - redirige vers dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Routes principales */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          
          
          {/* Route pour les pages non trouvées */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;