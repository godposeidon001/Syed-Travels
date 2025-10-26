import React, { useContext } from "react";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { showError, showSuccess } from "../../utility/toast";
import ThemeToggle from "../ThemeToogle";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        showSuccess("User Logged Out");
      })
      .catch((error) => {
        showError(error.message || "Logout failed");
      });
  };

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "nav-active active" : ""}`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
      </li>
      {!user && (
        <>
          <li>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </li>
        </>
      )}
      {user && (
        <>
          <li>
            <NavLink to="/mylist" className={linkClass}>
              My List
            </NavLink>
          </li>
          <li>
            <NavLink to="/addspot" className={linkClass}>
              Add Spot
            </NavLink>
          </li>
          <li>
            <NavLink to="/mybooking" className={linkClass}>
              My Bookings
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="work sticky top-0 z-50 bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 border-b border-base-300">
      <nav className="navbar mx-auto w-full max-w-7xl px-3 md:px-4">
        <div className="navbar-start gap-1 items-center">
          <div className="dropdown">
            <button
              aria-label="Open menu"
              tabIndex={0}
              className="btn btn-square btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow"
            >
              {links}
            </ul>
          </div>

          <Link
            to="/"
            className="btn btn-ghost px-2 text-base mr-10 md:mr-0 md:text-xl font-semibold tracking-tight normal-case"
          >
            <span className="playfair">Syed Travels</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">{links}</ul>
        </div>

        <div className="navbar-end gap-2">
          {user ? (
            <>
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100 overflow-hidden">
                  {(() => {
                    const photo =
                      user?.photoURL ||
                      user?.reloadUserInfo?.photoUrl ||
                      user?.providerData?.[0]?.photoURL ||
                      null;

                    return photo ? (
                      <img
                        key={photo}
                        src={photo}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement.innerHTML =
                            '<div class="grid h-10 w-10 place-items-center bg-base-200"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z"/></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center bg-base-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 opacity-80"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
                        </svg>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <button onClick={handleLogOut} className="btn btn-primary">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">
              Login
            </NavLink>
          )}
        </div>
        <ThemeToggle></ThemeToggle>
      </nav>
    </header>
  );
};

export default Navbar;
