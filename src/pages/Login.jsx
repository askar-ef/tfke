import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
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
      if (!user) {
        setError('User not found');
        setLoading(false);
        return;
      }
      if (password !== 'password' && password !== 'askar123') {
        setError('Wrong password');
        setLoading(false);
        return;
      }
      localStorage.setItem('tfke_user', JSON.stringify(user));
      navigate('/dashboard');
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="wordmark text-2xl inline-block mb-6">Tfke.id</Link>
          <h1 className="display text-2xl text-[#15161a]">Welcome back</h1>
          <p className="text-[#5f6066] text-sm mt-2">Login to manage your payment info</p>
        </div>

        <form onSubmit={handleSubmit} className="card rounded-2xl p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-[#d23b3b]/10 border border-[#d23b3b]/20 text-[#d23b3b] text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label-mono block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="field w-full px-4 py-3 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="label-mono block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="field w-full px-4 py-3 pr-12 rounded-lg text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9a9ba1] hover:text-[#15161a]"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2">
            {loading ? 'Logging in…' : <><span>Login</span><ArrowRight size={16} /></>}
          </button>

          <p className="text-center text-sm text-[#9a9ba1]">
            No account? <Link to="/register" className="text-[#2d4bff]">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
