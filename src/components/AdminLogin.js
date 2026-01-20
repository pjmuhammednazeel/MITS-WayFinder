import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    try {
      // Query the admins table with plain password
      const { data, error: queryError } = await supabase
        .from('admins')
        .select('id, username, password')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (queryError) {
        console.error('Login error:', queryError);
        setError(`Error: ${queryError.message}`);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }

      // Store session
      localStorage.setItem('adminSession', JSON.stringify({
        id: data.id,
        username: data.username
      }));

      // Redirect to dashboard
      window.location.href = '/admin-dashboard';
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="pill soft">Admin Access</div>
          <h1>Sign in to dashboard</h1>
          <p className="muted">Secure entry for campus navigation controls and content updates.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin1"
              disabled={loading}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <a href="/">Back to site</a>
          <span>Need access? Contact IT.</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
