import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Globe, Code, Share2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Platform Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Hack<span className="gradient-text">Pulse</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The end-to-end hackathon management platform empowering organizers, participants, judges, and admins worldwide.
            </p>
          </div>

          {/* Col 2: Platform Roles */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Roles
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-indigo-400 transition-colors">Participants Hub</span></li>
              <li><span className="hover:text-purple-400 transition-colors">Organizer Suite</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Judge Portal</span></li>
              <li><span className="hover:text-red-400 transition-colors">Admin Console</span></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Register Account</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Profile Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 4: Tech Stack & Community */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Tech Stack & Social
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Built with React, Express, MongoDB, Node.js, Tailwind CSS, & JWT Security.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="#community" className="p-2 rounded-lg bg-slate-900 hover:text-indigo-400 hover:bg-slate-800 transition-colors" title="Global Community">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#open-source" className="p-2 rounded-lg bg-slate-900 hover:text-purple-400 hover:bg-slate-800 transition-colors" title="Open Source">
                <Code className="w-5 h-5" />
              </a>
              <a href="#share" className="p-2 rounded-lg bg-slate-900 hover:text-pink-400 hover:bg-slate-800 transition-colors" title="Share Platform">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HackPulse. All rights reserved. Production Ready Phase 1.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for the Developer Ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
