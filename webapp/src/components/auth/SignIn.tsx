import { useState } from 'react';

interface SignInProps {
  onSubmit: (identifier: string, password: string) => Promise<string | void>;
  onSwitchToSignUp: () => void;
}

export const SignIn = ({ onSubmit, onSwitchToSignUp }: SignInProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onSubmit(identifier, password);
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
          <label htmlFor="identifier">Email</label>
          <input
            type="email"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="email"
            placeholder="Enter your email address"
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
            placeholder="Enter your password"
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