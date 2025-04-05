import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate, Link } from 'react-router-dom';

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    birthdate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            birthdate: formData.birthdate,
            preferred_username: formData.username
          },
          autoSignIn: true
        }
      });
      navigate('/verify-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    }
  };

  return (
    <div className="auth-container2">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className='form2'>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="Choose a username"
            required
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
            autoComplete="email"
            placeholder="Enter your email"
            required
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
            autoComplete="given-name"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthdate">Birthday</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            autoComplete="bday"
            required
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
            autoComplete="new-password"
            placeholder="Choose a password"
            required
          />
        </div>
        <button type="submit" className="waves-effect waves-light btn">Sign Up</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>
        Already have an account? <Link to="/signin" className="teal-text">Sign In</Link>
      </p>
    </div>
  );
};