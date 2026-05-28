import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="wordmark text-lg">Tfke.id</Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="tag hover:text-blue">Dashboard</Link>
                <button onClick={handleLogout} className="tag hover:text-blue">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="tag hover:text-blue">Login</Link>
                <Link to="/create" className="btn-primary px-4 py-2">Create</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-ink">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line-soft px-5 py-4 space-y-3 bg-paper">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="tag block">Dashboard</Link>
              <button onClick={handleLogout} className="tag block">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="tag block">Login</Link>
              <Link to="/create" onClick={() => setMobileOpen(false)} className="btn-primary block px-4 py-2.5 text-center">Create</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
