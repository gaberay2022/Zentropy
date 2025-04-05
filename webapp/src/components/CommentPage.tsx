import { useNavigate, useParams } from 'react-router-dom';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';

export const CommentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentDrawings } = useGlobalState();
  const [userId, setUserId] = useState<string | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(null);

  useEffect(() => {
    if (currentDrawings.length > 0 && id) {
      const index = parseInt(id) - 1;
      if (index >= 0 && index < currentDrawings.length) {
        setCurrentDrawing(currentDrawings[index].data);
      }
    }
  }, [currentDrawings, id]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCommentSubmission = async () => {
    try {
      const commentInput = document.getElementById("commentInput") as HTMLInputElement;
      var newComment = commentInput.value.trim();
      const commendWords = [
        'Amazing', 'Awesome', 'Brilliant', 'Incredible', 'Outstanding', 'Fantastic', 
        'Great', 'Good', 'Superb', 'Excellent', 'Exceptional', 'Phenomenal', 'Terrific', 
        'Wonderful', 'Impressive', 'Admirable', 'Incredible', 'Phenomenal', 'Top-notch', 
        'Perfect', 'Remarkable', 'Wonderful', 'Fabulous', 'Stellar', 'Exemplary', 
        'Masterful', 'Awe-inspiring', 'Terrific', 'Majestic', 'Inspirational', 'Brilliant', 
        'Clever', 'Creative', 'Dynamic', 'Positive', 'Motivating', 'Energetic', 'Inspiring', 
        'Skillful', 'Talented', 'Intelligent', 'Brilliant', 'Innovative', 'Resourceful', 
        'Outstanding', 'Marvelous', 'Exceptional', 'World-class', 'Spectacular', 'Remarkable', 
        'Unbelievable', 'Unique', 'Extraordinary', 'Phenomenal', 'Groundbreaking', 'Impressive', 
        'Effective', 'Productive', 'Efficient', 'Reliable', 'Hardworking', 'Dependable', 
        'Consistent', 'Sincere', 'Focused', 'Committed', 'Passionate', 'Diligent', 'Wise', 
        'Perceptive', 'Thoughtful', 'Knowledgeable', 'Experienced', 'Dedicated', 'Motivated', 
        'Respectable', 'Goal-oriented', 'Organized', 'Strategic', 'Visionary', 'Courageous', 
        'Brave', 'Confident', 'Determined', 'Adaptable', 'Ambitious', 'Bold', 'Creative', 
        'Intuitive', 'Supportive', 'Loyal', 'Honorable', 'Empathetic', 'Generous', 'Friendly', 
        'Approachable', 'Kind', 'Respectful', 'Patient', 'Helpful', 'Understanding', 'Loving', 
        'Considerate', 'Gracious', 'Humble', 'Genuine'
      ];

      const funnyNegativeComments = [
        'Did you use a spaghetti noodle for your pencil?',
        'It looks like a Picasso… if Picasso had a rough day.',
        'Did you accidentally draw that with your eyes closed?',
        'This is what happens when you ask a toddler to do a self-portrait.',
        'I think you’ve invented a whole new art style... it’s called "abstract confusion."',
        'Is this supposed to be art, or are we testing the limits of human patience?',
        'I’ve seen stick figures with more personality.',
        'I think the eraser is your best friend here.',
        'Is this a drawing, or did you just spill some paint and call it a day?',
        'Did you do this in MS Paint with a mouse?',
        'When you said "sketch," I thought you meant "art," not a game of Pictionary.',
        'It’s like the colors are fighting for attention, but none of them are winning.',
        'I can’t tell if this is a self-portrait or a map of Middle Earth.',
        'Your drawing looks like it’s having an identity crisis.',
        'I wouldn’t call this a masterpiece, but it could be a good start for a horror movie.',
        'Did the pencil attack the paper, or was this the result of a fierce battle?',
        'I think it’s beautiful… if abstract chaos is what you’re going for.',
        'If this is your final draft, I’m scared to see your first one.',
        'It looks like the paper is more confused than I am.',
        'It’s like your pencil was in a hurry, and the paper couldn’t keep up.'
      ];
      


      if (newComment) {
        // const result = await newTweet(newComment);
        if (commendWords.some(word => newComment.toLowerCase().includes(word.toLowerCase()))) {
            newComment = funnyNegativeComments[Math.floor(Math.random() * funnyNegativeComments.length)];
        }
        setComments((prevComments) => [...prevComments, newComment]);
        commentInput.value = ""; // Clear the input field
      }
    } catch (error) {
      console.error("error adding comment", error);
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
          width: '100%'
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
          <button 
            onClick={() => navigate('/gallery')}
            className="dashboard-button"
          >
            Gallery
          </button>
        </div>
        <div className='fullcontainer'>

        {/* Drawing Section */}
            <div className='comment--card'>
                <div className="comment--img">
                    {currentDrawing ? (
                        <img src={currentDrawing} alt="User Drawing" style={{ maxWidth: '100%', height: 'auto' }}/>
                    ) : (
                        <div>Loading drawing...</div>
                    )}
                </div>
                
                <div className="container--card--content">
                    <p className='comment--number'>{comments.length}</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>

        {/* Comments */}
            <div>
                <div className='comments-container'>
                    <div className='comments--list'>
                        <ul>
                            {comments.map((comment, index) => (
                            <li key={index}>{comment}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='writeComment'>
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            placeholder="Enter a comment"
                            id="commentInput"
                        />
                        <button
                            onClick={handleCommentSubmission}
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
                            }}
                        >
                            Submit Comment
                        </button>
                    </div>
                </div>
        </div>
      </main>

    </div>
  );
};