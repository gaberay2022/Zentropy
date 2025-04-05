import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { VerifyEmail } from './VerifyEmail';

type FormType = 'signin' | 'signup' | 'verify';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for and sign out any existing user
    const checkAndSignOut = async () => {
      try {
        await getCurrentUser();
        // If we get here, there is a user signed in
        await signOut();
      } catch (error) {
        // No user is signed in, which is what we want
        console.log('No user currently signed in');
      }
    };
    checkAndSignOut();
  }, []);

  // Set initial form and slide direction based on route
  const getInitialForm = (): FormType => {
    switch (location.pathname) {
      case '/signup':
        return 'signup';
      case '/verify-email':
        return 'verify';
      case '/signin':
      default:
        return 'signin';
    }
  };

  const getInitialDirection = () => {
    switch (location.pathname) {
      case '/signup':
        return 'left';
      case '/verify-email':
        return 'up';
      case '/signin':
      default:
        return 'right';
    }
  };

  const [currentForm, setCurrentForm] = useState<FormType>(getInitialForm());
  const [slideDirection, setSlideDirection] = useState(getInitialDirection());

  useEffect(() => {
    // Update form and slide direction when route changes
    const newForm = getInitialForm();
    if (newForm !== currentForm) {
      setCurrentForm(newForm);
      setSlideDirection(getInitialDirection());
    }
  }, [location.pathname]);

  useEffect(() => {
    // Show auth page after logo exit animation starts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400); // Reduced from 600ms to better match exit animations

    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = async (identifier: string, password: string) => {
    try {
      await signIn({ username: identifier, password });
      navigate('/dashboard');
    } catch (err) {
      return err instanceof Error ? err.message : 'An error occurred during sign in';
    }
  };

  const handleSignUp = async (formData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    birthdate: string;
  }) => {
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
      return err instanceof Error ? err.message : 'An error occurred during sign up';
    }
  };

  const switchForm = (form: FormType, direction: 'left' | 'right' | 'up') => {
    setSlideDirection(direction);
    const path = form === 'signin' ? '/signin' : form === 'signup' ? '/signup' : '/verify-email';
    navigate(path);
  };

  return (
    <div className={`auth-page${isVisible ? ' visible' : ''}`}>
      <div className="auth-container">
        <div className="auth-content">
          {currentForm === 'signin' && (
            <SignIn 
              onSubmit={handleSignIn}
              onSwitchToSignUp={() => switchForm('signup', 'left')}
            />
          )}
          {currentForm === 'signup' && (
            <SignUp 
              onSubmit={handleSignUp}
              onSwitchToSignIn={() => switchForm('signin', 'right')}
            />
          )}
          {currentForm === 'verify' && (
            <VerifyEmail />
          )}
        </div>
      </div>
    </div>
  );
};