import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Phase 1 Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Phase 2 Organizer Pages
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateHackathon from './pages/CreateHackathon';
import EditHackathon from './pages/EditHackathon';
import MyHackathons from './pages/MyHackathons';
import HackathonListing from './pages/HackathonListing';
import HackathonDetails from './pages/HackathonDetails';

// Phase 3 Participant & Organizer Pages
import ParticipantDashboard from './pages/ParticipantDashboard';
import RegisterHackathon from './pages/RegisterHackathon';
import MyRegistrations from './pages/MyRegistrations';
import CreateTeam from './pages/CreateTeam';
import MyTeam from './pages/MyTeam';
import JoinTeam from './pages/JoinTeam';
import OrganizerRegistrations from './pages/OrganizerRegistrations';
import OrganizerTeams from './pages/OrganizerTeams';

// Phase 4 Project Submission Pages
import CreateSubmission from './pages/CreateSubmission';
import EditSubmission from './pages/EditSubmission';
import MySubmission from './pages/MySubmission';
import SubmissionDetails from './pages/SubmissionDetails';
import OrganizerSubmissions from './pages/OrganizerSubmissions';

// Phase 5 Judge Evaluation Pages
import JudgeDashboard from './pages/JudgeDashboard';
import AssignedProjects from './pages/AssignedProjects';
import ReviewProject from './pages/ReviewProject';
import ReviewDetails from './pages/ReviewDetails';
import CompletedReviews from './pages/CompletedReviews';
import AssignJudges from './pages/AssignJudges';
import ReviewManagement from './pages/ReviewManagement';

// Phase 6 Leaderboard, Analytics & Results Pages
import Leaderboard from './pages/Leaderboard';
import WinnerAnnouncement from './pages/WinnerAnnouncement';
import PublicResults from './pages/PublicResults';
import AdminAnalytics from './pages/AdminAnalytics';
import OrganizerAnalytics from './pages/OrganizerAnalytics';
import JudgeAnalytics from './pages/JudgeAnalytics';
import ParticipantAnalytics from './pages/ParticipantAnalytics';
import Reports from './pages/Reports';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Only Home, Login, Signup are unauthenticated public pages */}
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />

              {/* Protected Directory & Leaderboard Routes (Requires Login) */}
              <Route
                path="hackathons"
                element={
                  <ProtectedRoute>
                    <HackathonListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hackathons/:id"
                element={
                  <ProtectedRoute>
                    <HackathonDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="leaderboard/:hackathonId"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="winner-announcement/:hackathonId"
                element={
                  <ProtectedRoute>
                    <WinnerAnnouncement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="results/:hackathonId"
                element={
                  <ProtectedRoute>
                    <PublicResults />
                  </ProtectedRoute>
                }
              />

              {/* Authenticated Profile & Reports */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Participant Role Routes */}
              <Route
                path="participant/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <ParticipantDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <ParticipantAnalytics />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/register/:id"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <RegisterHackathon />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/my-registrations"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <MyRegistrations />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/create-team"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <CreateTeam />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/my-team"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <MyTeam />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/join-team"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <JoinTeam />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/join-team/:code"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <JoinTeam />
                  </RoleBasedRoute>
                }
              />

              <Route
                path="participant/create-submission"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <CreateSubmission />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/submission/edit/:id"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <EditSubmission />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/my-submission"
                element={
                  <RoleBasedRoute allowedRoles={['participant', 'admin']}>
                    <MySubmission />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="participant/submission/:id"
                element={
                  <ProtectedRoute>
                    <SubmissionDetails />
                  </ProtectedRoute>
                }
              />

              {/* Judge Role Routes */}
              <Route
                path="judge/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['judge', 'admin']}>
                    <JudgeDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="judge/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['judge', 'admin']}>
                    <JudgeAnalytics />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="judge/assigned-projects"
                element={
                  <RoleBasedRoute allowedRoles={['judge', 'admin']}>
                    <AssignedProjects />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="judge/review/:submissionId"
                element={
                  <RoleBasedRoute allowedRoles={['judge', 'admin']}>
                    <ReviewProject />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="judge/review-details/:id"
                element={
                  <ProtectedRoute>
                    <ReviewDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="judge/completed-reviews"
                element={
                  <RoleBasedRoute allowedRoles={['judge', 'admin']}>
                    <CompletedReviews />
                  </RoleBasedRoute>
                }
              />

              {/* Admin Role Routes */}
              <Route
                path="admin/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminAnalytics />
                  </RoleBasedRoute>
                }
              />

              {/* Organizer Role Routes */}
              <Route
                path="organizer/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerAnalytics />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/create"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <CreateHackathon />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/edit/:id"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <EditHackathon />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/my-hackathons"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <MyHackathons />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/registrations"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerRegistrations />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/registrations/:hackathonId"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerRegistrations />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/teams"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerTeams />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/teams/:hackathonId"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerTeams />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/submissions"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerSubmissions />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/submissions/:id"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <SubmissionDetails />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/submissions/hackathon/:hackathonId"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerSubmissions />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/assign-judges"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <AssignJudges />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/assign-judges/:hackathonId"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <AssignJudges />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/review-management"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <ReviewManagement />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="organizer/review-details/:id"
                element={
                  <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                    <ReviewDetails />
                  </RoleBasedRoute>
                }
              />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
