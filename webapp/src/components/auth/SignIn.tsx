import { useState } from 'react';

interface SignInProps {
  onSubmit: (username: string, password: string) => Promise<string | void>;
  onSwitchToSignUp: () => void;
}

export const SignIn = ({ onSubmit, onSwitchToSignUp }: SignInProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onSubmit(username, password);
    if (result) {
      setError(result);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="button">Sign In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp} className="sign-in-link">
          Sign Up
        </button>
      </p>
    </div>
  );
};