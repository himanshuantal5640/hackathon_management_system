import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="hackathons" element={<HackathonListing />} />
            <Route path="hackathons/:id" element={<HackathonDetails />} />

            {/* Authenticated Profile */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
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

            {/* Phase 4 Participant Submissions */}
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

            {/* Organizer Role Protected Routes */}
            <Route
              path="organizer/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerDashboard />
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

            {/* Phase 4 Organizer Submissions */}
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

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
