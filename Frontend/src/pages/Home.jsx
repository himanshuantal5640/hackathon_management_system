import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Trophy, 
  Users, 
  ShieldCheck, 
  Award, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Code2,
  Sparkles,
  Rocket
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const roleCards = [
    {
      role: 'Participant',
      icon: Users,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      gradient: 'from-indigo-500/20 to-indigo-600/5',
      title: 'Build & Showcase',
      description: 'Form teams, discover hackathons, submit innovative projects, and earn global recognition.',
    },
    {
      role: 'Organizer',
      icon: Trophy,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      gradient: 'from-purple-500/20 to-purple-600/5',
      title: 'Manage & Scale',
      description: 'Host hackathons, set up submission criteria, assign judges, and track real-time analytics.',
    },
    {
      role: 'Judge',
      icon: Award,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      gradient: 'from-amber-500/20 to-amber-600/5',
      title: 'Review & Grade',
      description: 'Evaluate submissions using automated rubrics, provide feedback, and select winners seamlessly.',
    },
    {
      role: 'Admin',
      icon: ShieldCheck,
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      gradient: 'from-red-500/20 to-red-600/5',
      title: 'Govern & Protect',
      description: 'Maintain system integrity, manage user access, enforce guidelines, and monitor platform health.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Next-Gen Hackathon Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Empowering Innovation Through <span className="gradient-text">Hackathons</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            The all-in-one platform for developers, organizers, and judges to connect, build revolutionary projects, and manage hackathons effortlessly.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard ({user?.role})</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Join the Platform</span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-slate-200 glass-card hover:bg-slate-800 transition-all border border-slate-700 flex items-center justify-center"
                >
                  <span>Sign In to Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Platform Role Breakdown */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Built For Every Role</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Role-based access control built directly into the core architecture with seamless JWT security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl glass-card border bg-gradient-to-b ${card.gradient} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-indigo-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${card.badgeColor}`}>
                      {card.role}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Features / Capabilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-indigo-400 text-sm font-semibold uppercase tracking-wider">
                Production-Ready Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Secure, Modular & Scalable MERN Stack Foundation
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Phase 1 includes robust password hashing with Bcrypt, HTTP-only JWT cookies, centralized error handling, and modular Express MVC controllers.
              </p>

              <ul className="space-y-3">
                {[
                  'Secure JWT Cookie & Header Authentication',
                  'Role-Based Authorization (Admin, Organizer, Participant, Judge)',
                  'Form validation with React Hook Form & custom schemas',
                  'Centralized Mongoose Error Handling & Status Codes',
                ].map((feat, index) => (
                  <li key={index} className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-700/60 bg-slate-900/90 font-mono text-xs text-slate-300 space-y-3 overflow-x-auto">
              <div className="flex items-center justify-between text-slate-500 pb-3 border-b border-slate-800">
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" /> API System Health
                </span>
                <span className="text-emerald-400 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  HTTP 200 OK
                </span>
              </div>
              <p className="text-purple-400">// Sample Auth Endpoint Response</p>
              <pre className="text-slate-200">
{`{
  "success": true,
  "message": "Authenticated successfully",
  "user": {
    "id": "669ab2e3...",
    "name": "Jane Developer",
    "email": "jane@hackpulse.dev",
    "role": "organizer",
    "isBlocked": false
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
