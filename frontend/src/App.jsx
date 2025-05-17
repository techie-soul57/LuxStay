"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Rooms from "./pages/Rooms"
import Reservation from "./pages/Reservation"
import AdminDashboard from "./pages/AdminDashboard"
import Footer from "./components/Footer"
import RoomDetails from "./pages/RoomDetails"
import ReservationSuccess from "./pages/ReservationSuccess"
import Profile from "./pages/Profile"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
            <Route path="/rooms" element={user ? <Rooms /> : <Navigate to="/login" />} />
            <Route path="/rooms/:id" element={user ? <RoomDetails /> : <Navigate to="/login" />} />
            <Route
              path="/reservation/:roomId"
              element={user ? <Reservation user={user} /> : <Navigate to="/login" />}
            />
            <Route path="/reservation-success" element={user ? <ReservationSuccess /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
