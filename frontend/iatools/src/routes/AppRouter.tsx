import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AppointmentOptionsPage from '../pages/AppointmentOptionsPage';
import AuraMixPage from '../pages/AuraMixPage';
import AuraVoicePage from '../pages/AuraVoicePage';
import AuraImgPage from '../pages/AuraImgPage';
import LandingPage from '../pages/LandingPage';


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/AppointmentOptions" element={<LandingPage />} />
        <Route path="/text" element={<AuraMixPage />} />
        <Route path="/voice" element={<AuraVoicePage />} />
        <Route path="/images" element={<AuraImgPage />} />

      </Routes>
    </Router>
  );
}