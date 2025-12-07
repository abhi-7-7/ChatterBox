import React from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border-t border-light-border dark:border-dark-border mt-10 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
            About
          </h2>
          <p className="text-sm leading-6 text-light-muted dark:text-dark-muted">
            A modern chat dashboard for seamless communication.
            Secure, fast, and built for teams & communities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-light-text dark:text-dark-text">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Home</a></li>
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Chats</a></li>
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Community</a></li>
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Settings</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-light-text dark:text-dark-text">
            Support
          </h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Help Center</a></li>
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Report an Issue</a></li>
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-light-primary dark:hover:text-dark-primary">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-light-text dark:text-dark-text">
            Connect
          </h2>
          <div className="flex space-x-4 mt-2">
            {[Github, Instagram, Linkedin, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-light-primary dark:hover:text-dark-primary transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="text-center py-4 border-t border-light-border dark:border-dark-border text-sm text-light-muted dark:text-dark-muted">
        © {new Date().getFullYear()} Chat Dashboard — All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;
