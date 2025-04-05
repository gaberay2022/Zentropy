import { useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';


interface Project {
  image_id: string;
  image_data: string;
  title: string;
  created_at: string;
}

export const Dashboard = () => {
  const { currentDrawings } = useGlobalState();

  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { signInDetails } = await getCurrentUser();
        if (signInDetails?.loginId) {
          try {
            const response = await fetch(`/api/users?email=${encodeURIComponent(signInDetails.loginId)}`);
            if (!response.ok) {
              if (response.status === 404) {
                const createResponse = await fetch('/api/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: signInDetails.loginId }),
                });
                
                if (!createResponse.ok) {
                  throw new Error('Failed to create user');
                }
                const newUser = await createResponse.json();
                setUserId(newUser.user_id);
              } else {
                throw new Error('Failed to fetch user');
              }
            } else {
              const user = await response.json();
              setUserId(user.user_id);
            }
          } catch (error) {
            console.error('Error fetching/creating user:', error);
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRecentProjects(userId);
    }
  }, [userId]);

  const fetchRecentProjects = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/images`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const projects = await response.json();
      setRecentProjects(projects.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent projects:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Background Clouds */}
      <div className="dashboard-clouds">
        <img src="/svgs/Cloud 1.svg" alt="" className="dashboard-cloud dashboard-cloud-left" style={{ top: '5%', left: '5%', '--cloud-duration': '80s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 2.svg" alt="" className="dashboard-cloud dashboard-cloud-right" style={{ top: '25%', right: '10%', '--cloud-duration': '100s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 3.svg" alt="" className="dashboard-cloud dashboard-cloud-left" style={{ top: '45%', left: '15%', '--cloud-duration': '90s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 4.svg" alt="" className="dashboard-cloud dashboard-cloud-right" style={{ top: '65%', right: '5%', '--cloud-duration': '110s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 5.svg" alt="" className="dashboard-cloud dashboard-cloud-left" style={{ top: '85%', left: '10%', '--cloud-duration': '95s' } as React.CSSProperties} />
      </div>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        right: '24px',
        background: 'transparent',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo and Sun Guy */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div className="flex items-center dashboard-logo">
              {['Z', 'E', 'N', 'T', 'R', 'O', 'P', 'Y'].map((letter, index) => (
                <div key={letter} className="logo-letter">
                  <div className="logo-letter-inner">
                    <img src={`/svgs/Logo ${letter}.svg`} alt={letter} style={{ height: '24px' }} />
                  </div>
                </div>
              ))}
            </div>
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
          <button
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(to bottom, #FFB347, #FF9000)',
              border: '2px solid #940F12',
              borderRadius: '6px',
              color: '#940F12',
              fontFamily: 'Delius Unicase',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              position: 'absolute',
              top: '24px',
              right: '24px'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '120px 24px 24px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '48px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '800px'
        }}>
          <button 
            onClick={() => navigate('/friendly-canvas')}
            className="dashboard-button"
          >
            New Project
          </button>
          <button 
            onClick={() => navigate('/community')}
            className="dashboard-button"
          >
            Community
          </button>
        </div>

        {/* Recent Projects */}
        <section style={{ width: '100%', maxWidth: '800px' }}>
          <h2 style={{ 
            color: '#940F12', 
            fontFamily: 'Delius Unicase', 
            fontSize: '24px', 
            marginBottom: '24px',
            textAlign: 'center' 
          }}>
            Recent Projects
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {currentDrawings.map((project, i) => (
              <div key={i} className="project-card">
                <img 
                  src={project.data}
                  alt={"example"}
                  className="project-image"
                />
                <div className="project-details">
                  <button
                    onClick={() => navigate(`/comments/${i}`)}
                    className="project-comments"
                  >
                    Comments
                  </button>
                </div>
              </div>
            ))}
            {currentDrawings.length === 0 && (
              <div className="dashboard-projects-empty">
                No projects yet. Create your first project!
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};