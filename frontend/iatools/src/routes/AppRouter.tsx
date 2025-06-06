import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuraMixPage from '../pages/AuraMixPage';
import LandingPage from '../pages/LandingPage';


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/AppointmentOptions" element={<LandingPage />} />
        <Route path="/AuraChat" element={<AuraMixPage />} />


      </Routes>
    </Router>
  );
}