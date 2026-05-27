import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Zap, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('tfke_user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tfke_user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold font-[Space_Grotesk] tracking-tight">
              Tfke<span className="text-indigo-400">.id</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-white/[0.05]">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-4 space-y-2 animate-slide-in">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm hover:bg-white/[0.05]">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm hover:bg-white/[0.05]">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
