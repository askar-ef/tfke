import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../data/api';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    try {
      await auth.register({
        username,
        display_name: displayName || username,
        password,
      });
      const loginRes = await auth.login({ username, password });
      localStorage.setItem('tfke_token', loginRes.token);
      localStorage.setItem('tfke_user', JSON.stringify(loginRes.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-7">
          <Link to="/" className="wordmark text-xl">Tfke.id</Link>
          <h1 className="head text-3xl mt-4">Create account</h1>
          <p className="tag mt-1">Get your payment info page in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="figure p-6 space-y-5">
          <span className="fig-tag">Fig. — register</span>
          {error && <div className="tag text-[#cc2b2b] border border-[#cc2b2b] px-3 py-2">{error}</div>}

          <div>
            <label className="tag block mb-2">Display name</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="field w-full px-3 py-2.5" required />
          </div>
          <div>
            <label className="tag block mb-2">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="field w-full px-3 py-2.5" required />
          </div>
          <div>
            <label className="tag block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="field w-full px-3 py-2.5 pr-11"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a82] hover:text-ink">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating…' : 'Create account →'}
          </button>
          <p className="tag text-center">Have an account? <Link to="/login" className="text-blue">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
