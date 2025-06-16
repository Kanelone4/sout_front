import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard'
import CatalogueProduit from '../src/pages/commerciaux/catalogueProduit'
import OperationsCommerciales from '../src/pages/commerciaux/operationsCommerciales'
import Rapports from '../src/pages/Rapports'
import Activites from '../src/pages/Activites'
import Stock from '../src/pages/Stock'
import Settings from './pages/Settings';
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
          <Route path="/activities" element={<Activites />} />
          <Route path="/reports" element={<Rapports />} />
           <Route path="/commerciaux/catalogue" element={<CatalogueProduit />} />
           <Route path="/commerciaux/operations" element={<OperationsCommerciales />} />
          <Route path="/stocks" element={<Stock />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;