import { useLocation } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const location = useLocation();
  const getAnimationClass = () => {
    if (location.pathname === '/signin') {
      return 'slide-in-right';
    } else if (location.pathname === '/signup') {
      return 'slide-in-left';
    } else if (location.pathname === '/verify-email') {
      return 'slide-in-down';
    }
    return '';
  };

  return (
    <div className="auth-page">
      <div className={`auth-content ${getAnimationClass()}`}>
        {children}
      </div>
    </div>
  );
};