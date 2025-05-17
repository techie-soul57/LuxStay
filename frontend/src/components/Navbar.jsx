"use client"

import { Link } from "react-router-dom"
import { useState } from "react"
import "./Navbar.css"

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>LuxStay</h1>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/rooms" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Rooms
            </Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link profile-link">
                  <i className="fas fa-user"></i>
                  <span>My Profile</span>
                </Link>
              </li>
              {user.isAdmin && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-user">Welcome, {user.name}</span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-logout"
                  onClick={() => {
                    onLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn btn-register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
