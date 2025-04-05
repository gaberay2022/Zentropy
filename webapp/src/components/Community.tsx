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
        <button>Home</button>
        <button>Account</button>
    </div>
    <div className="community">
        <div className='container'>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>234</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>234</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>234</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>234</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            <div className='container--card'>
                <div className="container--img">
                    <img src="/svgs/Bald sun guy 1.svg" alt="Sample Drawing"/>
                </div>
                <div className="container--card--content">
                    <p className='comment--number'>234</p>
                    <img src="/svgs/Logo P.svg" width="30px" className='flipped'></img>
                </div>
            </div>
            
            
        </div>
      
      {/* <button onClick={handleSignOut}>Sign Out</button> */}
    </div>
    </div>
  );
};