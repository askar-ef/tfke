import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

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

  const linkCls =
    'px-4 py-2 rounded-lg text-sm font-medium text-[#5f6066] hover:text-[#15161a] hover:bg-black/[0.04] transition-colors';
  const sans = { fontFamily: 'var(--font-sans)' };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbfbf8]/90 backdrop-blur-sm border-b border-[rgba(20,21,26,0.10)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="wordmark text-lg tracking-wide">Tfke.id</Link>

          <div className="hidden md:flex items-center gap-1" style={sans}>
            {user ? (
              <>
                <Link to="/dashboard" className={`${linkCls} flex items-center gap-2`}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className={`${linkCls} flex items-center gap-2 hover:text-[#d23b3b]`}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkCls}>Login</Link>
                <Link to="/create" className="btn-primary px-5 py-2 rounded-lg text-sm">Create</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-black/[0.04]">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(20,21,26,0.10)] px-4 py-4 space-y-2" style={sans}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm hover:bg-black/[0.04]">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-[#d23b3b] hover:bg-black/[0.04]">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm hover:bg-black/[0.04]">Login</Link>
              <Link to="/create" onClick={() => setMobileOpen(false)} className="btn-primary block px-4 py-3 rounded-lg text-sm text-center">Create</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
