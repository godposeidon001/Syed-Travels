import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import logo from "/logo.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 bg-base-100 text-base-content border-t border-base-300/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-10">
          <aside className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                className="w-14 h-14 object-contain"
                src={logo}
                alt="Syed Travels logo"
              />
              <div>
                <p className="playfair text-xl font-semibold leading-tight">
                  Syed Travels
                </p>
                <p className="work text-sm text-base-content/70">
                  Curated journeys. Honest guidance.
                </p>
              </div>
            </div>
            <p className="work text-sm text-base-content/70 max-w-sm">
              From weekend getaways to once-in-a-lifetime adventures, we help
              you find destinations that match your pace and budget.
            </p>
          </aside>

          <nav className="flex flex-col space-y-2">
            <h6 className="playfair text-lg font-semibold">Explore</h6>
            <NavLink className="link link-hover work" to="/">
              Home
            </NavLink>
            <NavLink className="link link-hover work" to="/destinations">
              Featured Destinations
            </NavLink>
            <NavLink className="link link-hover work" to="/stories">
              Travel Stories
            </NavLink>
            <NavLink className="link link-hover work" to="/bookings">
              Your Bookings
            </NavLink>
          </nav>

          <nav className="flex flex-col space-y-2">
            <h6 className="playfair text-lg font-semibold">Company</h6>
            <NavLink className="link link-hover work" to="/about">
              About us
            </NavLink>
            <NavLink className="link link-hover work" to="/contact">
              Contact
            </NavLink>
            <NavLink className="link link-hover work" to="/careers">
              Careers
            </NavLink>
            <NavLink className="link link-hover work" to="/press">
              Press
            </NavLink>
          </nav>

          <nav className="flex flex-col space-y-2">
            <h6 className="playfair text-lg font-semibold">Support</h6>
            <NavLink className="link link-hover work" to="/help">
              Help Center
            </NavLink>
            <NavLink className="link link-hover work" to="/terms">
              Terms of use
            </NavLink>
            <NavLink className="link link-hover work" to="/privacy">
              Privacy policy
            </NavLink>
            <NavLink className="link link-hover work" to="/cookies">
              Cookie policy
            </NavLink>
          </nav>
        </div>

        <div className="divider my-0" />

        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="btn btn-ghost btn-circle"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="btn btn-ghost btn-circle"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Twitter/X"
              className="btn btn-ghost btn-circle"
            >
              <FaXTwitter />
            </a>
          </div>

          <p className="work text-sm text-base-content/70 text-center">
            © {year} Syed Ali • All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
