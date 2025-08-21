import React from 'react';
import HeaderBar from './frontend/components/HeaderBar';
import Footer from './frontend/components/Footer';
import { Routes, Route } from 'react-router-dom';
import mrphish from './assets/images/Mr-Phish.png'
import HomePage from './frontend/pages/HomePage';
import GamePage from './frontend/pages/GamePage';
import LorePage from './frontend/pages/LorePage';
import HowToPlayPage from './frontend/pages/HowToPlayPage';
import LoginPage from './frontend/pages/LoginPage'; 
import RegisterPage from './frontend/pages/RegisterPage';
import LeaderboardsPage from './frontend/pages/LeaderboardsPage';
import DashboardPage from './frontend/pages/DashboardPage'; // User management dashboard
import EditProfilePage from './frontend/pages/EditProfilePage';
import AccountSettingsPage from './frontend/pages/AccountSettingsPage';
import AchievementsPage from './frontend/pages/AchievementsPage';
import TimedModeSelectPage from './frontend/pages/TimedModeSelect';
import TimedGamePage from './frontend/pages/TimedGame'; // Timed game logic page
import ReportPage from './frontend/pages/ReportPage'; // Report page
import GenerateProfilePicturePage from './frontend/pages/GenerateProfilePicturePage'; // Profile picture generation page
import GenerateMedalPage from './frontend/pages/GenerateMedalPage'; // Medal generation page
import ViewGameReports from './frontend/pages/ViewGameReports'; // View game reports page

function App() {
  return (
    <>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game-modes" element={<GamePage />} />
        <Route path="/lore" element={<LorePage />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> {/* User management dashboard */}
        <Route path="/edit-profile" element={<EditProfilePage />} /> {/* Edit profile page */}
        <Route path="/settings" element={<AccountSettingsPage />} /> {/* Account settings page */}
        <Route path="/view-achievements" element={<AchievementsPage />} /> {/* View achievements page */}
        <Route path="/play-timed" element={<TimedModeSelectPage />} /> {/* Select timed mode page */}
        <Route path="/timed-game" element={<TimedGamePage />} /> {/* Play timed game page */}
        <Route path="/report" element={<ReportPage />} /> {/* View report page */}
        <Route path="/generate-profile-picture" element={<GenerateProfilePicturePage />} /> {/* Profile picture generation page */}
        <Route path="/generate-medal" element={<GenerateMedalPage />} /> {/* Medal generation page */}
        <Route path="/view-game-reports" element={<ViewGameReports />} /> {/* View game reports page */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
