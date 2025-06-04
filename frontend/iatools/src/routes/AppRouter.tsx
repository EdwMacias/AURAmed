import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppointmentPage from '../pages/AppointmentPage';
import LandingPage from '../pages/LandingPage';
import ChatComponent from '../ChatComponent';


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatComponent />} />
        <Route path="/AppointmentOptions" element={<AppointmentPage />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}