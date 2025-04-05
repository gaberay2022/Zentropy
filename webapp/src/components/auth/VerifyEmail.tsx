import { useState } from 'react';
import { confirmSignUp, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

export const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createUserInDb = async (email: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user in database');
      }
    } catch (error) {
      console.error('Error creating user in database:', error);
      // Don't throw here - we still want to proceed with sign-in even if DB creation fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username,
        confirmationCode: code
      });

      // After successful verification, get the user's email and create DB entry
      try {
        const { signInDetails } = await getCurrentUser();
        if (signInDetails?.loginId) {
          await createUserInDb(signInDetails.loginId);
        }
      } catch (err) {
        console.error('Error getting user details:', err);
      }

      navigate('/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification');
    }
  };

  return (
    <div className="auth-container">
      <h2>Verify Email</h2>
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
        <button type="submit">Verify Email</button>
      </form>
      <p>
        Back to <button className="sign-in-link" onClick={() => navigate('/signin')}>Sign In</button>
      </p>
    </div>
  );
};