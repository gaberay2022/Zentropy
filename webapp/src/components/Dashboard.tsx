import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    
    <div className="dashboard">
      <h1>Welcome to the Dashboard</h1>
      
    </div>
  );
};