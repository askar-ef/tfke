import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { getUser } from '../data/mockUsers';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = getUser(username);
      if (!user) { setError('User not found'); setLoading(false); return; }
      if (password !== 'password' && password !== 'askar123') { setError('Wrong password'); setLoading(false); return; }
      localStorage.setItem('tfke_user', JSON.stringify(user));
      navigate('/dashboard');
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-7">
          <Link to="/" className="wordmark text-xl">Tfke.id</Link>
          <h1 className="head text-3xl mt-4">Welcome back</h1>
          <p className="tag mt-1">Login to manage your payment info</p>
        </div>

        <form onSubmit={handleSubmit} className="figure p-6 space-y-5">
          <span className="fig-tag">Fig. — login</span>
          {error && <div className="tag text-[#cc2b2b] border border-[#cc2b2b] px-3 py-2">{error}</div>}

          <div>
            <label className="tag block mb-2">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="field w-full px-3 py-2.5" required />
          </div>

          <div>
            <label className="tag block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="field w-full px-3 py-2.5 pr-11"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a82] hover:text-ink">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Logging in…' : 'Login →'}
          </button>
          <p className="tag text-center">No account? <Link to="/register" className="text-blue">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
