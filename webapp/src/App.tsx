import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { Dashboard } from './components/Dashboard';
import { CreatePaintingFriendly} from './components/CreatePaintingFriendly';
import './App.css';
import './aws-config';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="app-content">
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Navigate to="/signin" replace />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/friendly-create-painting" element={<CreatePaintingFriendly/>}/>
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
