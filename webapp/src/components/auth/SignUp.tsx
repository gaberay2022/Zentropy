import { useState } from 'react';

interface SignUpProps {
  onSubmit: (formData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    birthdate: string;
  }) => Promise<string | void>;
  onSwitchToSignIn: () => void;
}

export const SignUp = ({ onSubmit, onSwitchToSignIn }: SignUpProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    birthdate: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onSubmit(formData);
    if (result) {
      setError(result);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthdate">Birthdate</label>
          <input
            type="text"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
            autoComplete="bday"
            placeholder="MM/DD/YYYY"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Create a password"
          />
        </div>
        <button type="submit" className="button">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToSignIn} className="sign-in-link">
          Sign In
        </button>
      </p>
    </div>
  );
};