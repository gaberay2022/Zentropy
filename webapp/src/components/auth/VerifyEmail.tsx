import { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate, Link } from 'react-router-dom';

export const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username,
        confirmationCode: code
      });
      navigate('/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification');
    }
  };

  return (
    <div className="auth-container">
      <h2>Verify Email</h2>
      <p className="verification-info">
        Please check your email for the verification code and enter it below.
      </p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="code">Verification Code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="one-time-code"
            placeholder="Enter verification code"
            required
          />
        </div>
        <button type="submit" className="waves-effect waves-light btn">Verify Email</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>
        Back to <Link to="/signin" className="teal-text">Sign In</Link>
      </p>
    </div>
  );
};