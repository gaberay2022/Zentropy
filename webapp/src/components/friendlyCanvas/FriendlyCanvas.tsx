import './FriendlyCanvas.css'
import Canvas from "./paintingCanvas.tsx"
import TopBar from "./TopBar.tsx";
import Encouragement from './Encouragement';
import '../../styles/animations.css';

export const FriendlyCanvas = () => {
  return (
    <div className="App">
      {/* Background Clouds */}
      <div className="clouds-container">
        <img src="/svgs/Cloud 1.svg" alt="" className="cloud cloud-left" style={{ top: '5%', left: '5%', '--cloud-duration': '80s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 2.svg" alt="" className="cloud cloud-right" style={{ top: '25%', right: '10%', '--cloud-duration': '100s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 3.svg" alt="" className="cloud cloud-left" style={{ top: '45%', left: '15%', '--cloud-duration': '90s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 4.svg" alt="" className="cloud cloud-right" style={{ top: '65%', right: '5%', '--cloud-duration': '110s' } as React.CSSProperties} />
        <img src="/svgs/Cloud 5.svg" alt="" className="cloud cloud-left" style={{ top: '85%', left: '10%', '--cloud-duration': '95s' } as React.CSSProperties} />
      </div>

      {/* Fixed TopBar */}
      <div className="top-bar-container">
        <TopBar />
      </div>

      {/* Main Content */}
      <div style={{display: "flex", flexDirection: "row", height: "calc(100% - 5rem)", marginTop: "5rem"}}>
        <Canvas />
        <Encouragement />
      </div>
    </div>
  )
}
