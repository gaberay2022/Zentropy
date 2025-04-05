import './FriendlyCanvas.css'
import Canvas  from "./paintingCanvas.tsx"
import TopBar from "./TopBar.tsx";
import Encouragement from './Encouragement';


function App() {

  return (
    <div className = "App">

        <TopBar>

        </TopBar>
        <div style={{display: "flex", flexDirection: "row", height: "calc(100% - 5rem)"}}>
            <Canvas>

            </Canvas>
            <Encouragement>

            </Encouragement>
        </div>


    </div>
  )
}

export default App