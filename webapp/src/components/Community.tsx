import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../GlobalStateContext';

export const Community = () => {
  const navigate = useNavigate();
  const { currentDrawings } = useGlobalState();

  return (
    <div>
      <div className="navigation">
        <button
          onClick={() => navigate('/dashboard')}
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
          Dashboard
        </button>
      </div>
      <div className="community">
        <div className='container'>
          {currentDrawings.map((drawing, index) => (
            <div 
              key={index} 
              className='container--card' 
              onClick={() => navigate(`/comments/${index + 1}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="container--img">
                <img src={drawing.data} alt={`Drawing ${index + 1}`}/>
              </div>
              <div className="container--card--content">
                <p className='comment--number'>{drawing.comments.length}</p>
                <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
              </div>
            </div>
          ))}
          {currentDrawings.length === 0 && (
            <div className="no-drawings">
              <p>No drawings have been shared yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};