import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoicePage from './Pages/VoicePage';
// import ChatBot from './Pages/ChatBot';


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<ChatBot />} /> */}
        <Route path="/" element={<VoicePage />} />
      </Routes>
    </Router>
  );
}

export default App;
