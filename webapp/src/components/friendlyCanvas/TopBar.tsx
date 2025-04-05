import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import '../../styles/animations.css';

const LogoLetter: React.FC<{ letter: string; index: number }> = ({ letter, index }) => {
  return (
    <div className="logo-letter">
      <div className="logo-letter-inner">
        <img src={`/svgs/Logo ${letter}.svg`} alt={letter} style={{ height: '24px' }} />
      </div>
    </div>
  );
};

function TopBar() {
  const navigate = useNavigate();
  const letters = ['Z', 'E', 'N', 'T', 'R', 'O', 'P', 'Y'];

  return (
    <div className="TopBar2">
      <div className="logo-section">
        {/* Logo */}
        <div className="dashboard-logo">
          {letters.map((letter, index) => (
            <LogoLetter key={letter} letter={letter} index={index} />
          ))}
        </div>

        {/* Sun Guy */}
        <div className="dashboard-sun-container" style={{ width: '32px', height: '32px', marginLeft: '8px' }}>
          <div className="dashboard-sun-guy-wrapper">
            <img
              src="/svgs/Bald sun guy 1.svg"
              alt="Sun Guy"
              className="dashboard-sun-guy"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="dashboard-sun-beams-container">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="dashboard-sun-beam"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  width: '60px',
                  height: '4px'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button 
          className="dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button 
          className="dashboard-button"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
        <button 
          className="dashboard-button"
          onClick={() => navigate('/gallery')}
        >
          Gallery
        </button>
      </div>
    </div>
  );
}

export default TopBar;