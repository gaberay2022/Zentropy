import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Home } from './components/Home';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FriendlyCanvas } from './components/friendlyCanvas/FriendlyCanvas'
import {Community} from './components/Community'
import './App.css';
import './aws-config';
import { CommentPage } from './components/CommentPage';

interface CloudState {
  id: number;
  number: number;
  direction: 'left' | 'right';
  style: React.CSSProperties;
  zIndex: number;
}

interface CloudProps {
  number: number;
  direction: 'left' | 'right';
  style?: React.CSSProperties;
  zIndex: number;
}

const Cloud: React.FC<CloudProps> = ({ number, direction, style, zIndex }) => {
  return (
    <div 
      className={`cloud cloud-${direction}`} 
      style={{ 
        zIndex, 
        ...style,
        ['--cloud-duration' as string]: style?.animationDuration
      }}
    >
      <img src={`/svgs/Cloud ${number}.svg`} alt={`Cloud ${number}`} />
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup', '/verify-email'].includes(location.pathname);
  const [clouds, setClouds] = useState<CloudState[]>([]);
  const cloudCount = useRef(0);
  const lastCloudPosition = useRef<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isCommunityPage = location.pathname === '/community'; // Check if the current route is /community
  const isCommentsPage = location.pathname === '/comments';


  const addCloud = () => {
    if (isCommunityPage || isCommentsPage || clouds.length >= 4) return;

    const cloudNumber = Math.floor(Math.random() * 6) + 1;
    const direction = Math.random() > 0.5 ? 'left' as const : 'right' as const;
    
    let topPosition;
    do {
      topPosition = 10 + (Math.random() * 80);
    } while (
      lastCloudPosition.current !== null &&
      Math.abs(topPosition - lastCloudPosition.current) < 25
    );
    
    lastCloudPosition.current = topPosition;
    const duration = 45000 + Math.random() * 15000;
    const zIndex = Math.floor(Math.random() * 3);
    const newCloud: CloudState = {
      id: cloudCount.current++,
      number: cloudNumber,
      direction,
      zIndex,
      style: {
        top: `${topPosition}%`,
        [direction === 'left' ? 'right' : 'left']: '-200px',
        animationDuration: `${duration}ms`
      }
    };
    
    setClouds(prev => [...prev, newCloud]);

    setTimeout(() => {
      setClouds(prev => {
        const filtered = prev.filter(cloud => cloud.id !== newCloud.id);
        if (filtered.length < 4) {
          setTimeout(addCloud, 100);
        }
        return filtered;
      });
      if (clouds.length === 1) {
        lastCloudPosition.current = null;
      }
    }, duration);
  };

  useEffect(() => {
    if (isCommunityPage) return;
    if (isCommentsPage) return;
    const initialClouds = [0, 1, 2, 3].map(i => 
      setTimeout(() => addCloud(), i * 2000)
    );

    const interval = setInterval(() => {
      if (clouds.length < 4) {
        addCloud();
      }
    }, 2000);

    return () => {
      initialClouds.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isAuthPage) {
      setIsTransitioning(true);
      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAuthPage]);

  return (
    <div className="app">
      {/* Fixed background with clouds */}
      {!(isCommunityPage || isCommentsPage) && (
      <div className="background-layer">
        <div className="clouds-container">
        {clouds.map(cloud => (
            <Cloud
              key={cloud.id}
              number={cloud.number}
              direction={cloud.direction}
              style={cloud.style}
              zIndex={cloud.zIndex}
            />
          ))}
        </div>
      </div>
      )}

      {(isCommunityPage || isCommentsPage) && (
        <div className="background-layer2">
        </div>
      )}
      
      {/* Content layer */}
      <div className="content-layer">
        <div className="app-container">
          {/* Home content */}
          {(location.pathname === '/' || isTransitioning) && (
            <div className={`home-content${isAuthPage ? ' home-content-auth' : ''}`}>
              <Home isAuthPage={isAuthPage} currentPath={location.pathname} />
            </div>
          )}

          {/* Routes */}
          <Routes>
            <Route path="/" element={null} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/verify-email" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/community" element={<Community />} />
            <Route path="/comments/:id" element={<CommentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/friendly-canvas" element={<FriendlyCanvas/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
