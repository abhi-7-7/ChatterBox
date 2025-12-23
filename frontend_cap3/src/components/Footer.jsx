import React from "react";
import { Github, Instagram, Linkedin, Mail, Info, Link, LifeBuoy, Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-white/30 dark:bg-slate-950/20 text-slate-500 dark:text-slate-500 border-t border-slate-200/10 dark:border-slate-800/10">

      <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

        {/* About */}
        <div>
          <h3 className="text-xs font-600 text-slate-600 dark:text-slate-500 uppercase tracking-[0.05em] mb-2">About</h3>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-600 font-400 opacity-80">
            A modern chat dashboard for teams. Secure, fast, built for real-time collaboration.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-600 text-slate-600 dark:text-slate-500 uppercase tracking-[0.05em] mb-2">Quick Links</h3>
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-600 opacity-80">
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Home</a></li>
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Chats</a></li>
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Community</a></li>
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Settings</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs font-600 text-slate-600 dark:text-slate-500 uppercase tracking-[0.05em] mb-2">Support</h3>
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-600 opacity-80">
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Help Center</a></li>
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Report an Issue</a></li>
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-400">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-xs font-600 text-slate-600 dark:text-slate-500 uppercase tracking-[0.05em] mb-2">Connect</h3>
          <div className="flex space-x-2.5 text-slate-500 dark:text-slate-600 opacity-80">
            {[Github, Instagram, Linkedin, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors p-1"
              >
                <Icon size={14} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="text-center py-1.5 border-t border-slate-200/10 dark:border-slate-800/10 text-xs text-slate-500 dark:text-slate-600 font-400 opacity-70">
        © {new Date().getFullYear()} ChatApp — All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
