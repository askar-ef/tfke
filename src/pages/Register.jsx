import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createUser } from '../data/mockUsers';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
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
      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }
      const user = createUser(username, displayName || username, password);
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
          <h1 className="display text-2xl text-[#15161a]">Create account</h1>
          <p className="text-[#5f6066] text-sm mt-2">Get your payment info page in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="card rounded-2xl p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-[#d23b3b]/10 border border-[#d23b3b]/20 text-[#d23b3b] text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label-mono block mb-2">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="field w-full px-4 py-3 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="label-mono block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
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
                placeholder="Create password"
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
            {loading ? 'Creating…' : <><span>Create account</span><ArrowRight size={16} /></>}
          </button>

          <p className="text-center text-sm text-[#9a9ba1]">
            Already have an account? <Link to="/login" className="text-[#2d4bff]">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
