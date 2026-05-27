import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import EphemeralCreate from './pages/EphemeralCreate';
import EphemeralView from './pages/EphemeralView';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<EphemeralCreate />} />
        <Route path="/p/:token" element={<EphemeralView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/u/:username" element={<PublicProfile />} />
      </Routes>
    </div>
  );
}
