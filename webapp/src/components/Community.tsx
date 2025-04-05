import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';


export const Community = () => {
  const navigate = useNavigate();

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       navigate('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

  return (
    <div>
    <div className = "navigation">
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
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>12</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>2</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>200</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>34</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>13</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            
            
        </div>
      
      {/* <button onClick={handleSignOut}>Sign Out</button> */}
    </div>
    </div>
  );
};