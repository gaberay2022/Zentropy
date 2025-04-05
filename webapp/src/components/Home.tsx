import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/animations.css';
import '../styles/styles.css';

interface HomeProps {
  isAuthPage: boolean;
  currentPath: string;
}

const SunBeam: React.FC<{ index: number }> = ({ index }) => {
  const angle = (index * 360) / 8;

  return (
    <div
      className="sun-beam"
      style={{
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

const LogoLetter: React.FC<{ letter: string; index: number }> = ({ letter, index }) => {
  return (
    <div
      className="logo-letter"
      style={{
        animationDelay: `${index * 0.15}s`
      }}
    >
      <div className="logo-letter-inner">
        <img
          src={`/svgs/Logo ${letter}.svg`}
          alt={letter}
        />
      </div>
    </div>
  );
};

const Logo: React.FC = () => {
  const letters = ['Z', 'E', 'N', 'T', 'R', 'O', 'P', 'Y'];

  return (
    <div className="logo-container">
      {letters.map((letter, index) => (
        <LogoLetter key={letter} letter={letter} index={index} />
      ))}
    </div>
  );
};

export const Home = ({ isAuthPage, currentPath }: HomeProps) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up'>('left');
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Reset animation state when returning to home
    if (!isAuthPage) {
      setIsNavigating(false);
      setShouldAnimate(false);
      setExitDirection('left');
    }
  }, [isAuthPage]);

  const handleButtonClick = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Set exit direction based on button clicked
    let direction: 'left' | 'right' | 'up' = 'left';
    switch (path) {
      case 'signin':
        direction = 'right';
        break;
      case 'signup':
        direction = 'left';
        break;
      case 'verify':
        direction = 'up';
        break;
    }
    setExitDirection(direction);
    setShouldAnimate(true);
    
    const button = document.querySelector(`.button-${path}`) as HTMLElement;
    if (button) {
      button.classList.add('clicked');
      // Wait for animation to start before navigating
      setTimeout(() => {
        navigate(`/${path}`);
      }, 300);
    }
  };

  const getContentClass = () => {
    if (!isAuthPage) return 'home-content';
    return `home-content home-content-auth exit-${exitDirection}`;
  };

  return (
    <div className={getContentClass()}>
      {/* Background Clouds */}
      <div className="clouds-container">
        <img src="/svgs/Cloud 1.svg" alt="" className="cloud cloud-left" style={{ top: '5%', left: '5%', '--cloud-duration': '80s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 2.svg" alt="" className="cloud cloud-right" style={{ top: '25%', right: '10%', '--cloud-duration': '100s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 3.svg" alt="" className="cloud cloud-left" style={{ top: '45%', left: '15%', '--cloud-duration': '90s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 4.svg" alt="" className="cloud cloud-right" style={{ top: '65%', right: '5%', '--cloud-duration': '110s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 5.svg" alt="" className="cloud cloud-left" style={{ top: '85%', left: '10%', '--cloud-duration': '95s' } as React.CSSProperties} />
      </div>

      {/* Sun Guy with Beams */}
      <div className="sun-container">
        <div className="sun-beams-container">
          {Array.from({ length: 8 }).map((_, index) => (
            <SunBeam key={index} index={index} />
          ))}
        </div>
        <div className="sun-guy-wrapper">
          <img
            src="/svgs/Bald sun guy 1.svg"
            alt="Sun Guy"
            className="sun-guy"
          />
        </div>
      </div>

      {/* Logo */}
      <Logo />

      {/* Only show buttons on home page */}
      {!isAuthPage && (
        <div className="buttons-container">
          <button
            className="button button-signin"
            onClick={() => handleButtonClick('signin')}
            disabled={isNavigating}
          >
            Sign In
          </button>
          <button
            className="button button-signup"
            onClick={() => handleButtonClick('signup')}
            disabled={isNavigating}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};