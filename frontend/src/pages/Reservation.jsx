"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./Reservation.css"

const Reservation = ({ user }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    paymentMethod: "onsite",
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch room details")
        }

        setRoom(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [roomId])

  useEffect(() => {
    if (room && formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn)
      const checkOut = new Date(formData.checkOut)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

      if (nights > 0) {
        setTotalPrice(room.price * nights)
      } else {
        setTotalPrice(0)
      }
    }
  }, [room, formData.checkIn, formData.checkOut])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
// In Reservation.jsx file, fix the headers in the handleSubmit function
// Find this part:
// Update the handleSubmit function with debugging and proper token handling

const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")
  setSubmitting(true)
  
  // Check if user is logged in
  if (!user || !user.token) {
    setError("You must be logged in to make a reservation")
    setSubmitting(false)
    return
  }
  
  // Get token from user object or localStorage
  const token = user.token || localStorage.getItem("token")
  
  if (!token) {
    setError("Authentication token not found. Please log in again.")
    setSubmitting(false)
    return
  }

  // Debug: Log the token (in production, remove this or only show first few chars)
  console.log("Using token:", token.substring(0, 10) + "...")

  try {
    const requestBody = {
      roomId: parseInt(roomId),
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: parseInt(formData.guests),
      paymentMethod: formData.paymentMethod,
      totalPrice: totalPrice
    }
    
    // Debug: Log the request body
    console.log("Sending request:", requestBody)
    
    const response = await fetch(`http://localhost:5000/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
      credentials: "include" // Include cookies if your auth uses them
    })
    
    // Debug: Log the response status
    console.log("Response status:", response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error response:", errorData)
      throw new Error(errorData.message || `Failed with status ${response.status}`)
    }

    const data = await response.json()
    navigate("/reservation-success", {
      state: {
        reservation: data,
        room: room,
      },
    })
  } catch (err) {
    console.error("Reservation error:", err)
    setError(err.message || "An error occurred while making the reservation")
  } finally {
    setSubmitting(false)
  }
}

if (loading) {
    return <div className="loading">Loading room details...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!room) {
    return <div className="error">Room not found</div>
  }

  // Calculate minimum check-in and check-out dates
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const minCheckIn = today.toISOString().split("T")[0]
  const minCheckOut = tomorrow.toISOString().split("T")[0]

  return (
    <div className="reservation-page">
      <div className="container">
        <h1>Reserve Your Room</h1>

        <div className="reservation-container">
          <div className="room-summary">
            <img src={room.image || "/src/assets/standard-room.svg"} alt={room.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <div className="room-summary-details">
              <h2>{room.name}</h2>
              <div className="room-features">
                <span>
                  <i className="fas fa-user"></i> {room.capacity} Guests
                </span>
                <span>
                  <i className="fas fa-bed"></i> {room.beds} Beds
                </span>
                <span>
                  <i className="fas fa-bath"></i> {room.bathrooms} Bathrooms
                </span>
              </div>
              <p>{room.description}</p>
              <div className="room-price">
                ${room.price}
                <span>/night</span>
              </div>
            </div>
          </div>

          <div className="reservation-form-container">
            <h3>Booking Details</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="reservation-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in Date</label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={minCheckIn}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkOut">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || minCheckOut}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="onsite"
                      name="paymentMethod"
                      value="onsite"
                      checked={formData.paymentMethod === "onsite"}
                      onChange={handleChange}
                    />
                    <label htmlFor="onsite">Pay at Hotel</label>
                  </div>
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleChange}
                    />
                    <label htmlFor="online">Pay Online</label>
                  </div>
                </div>
              </div>

              <div className="reservation-summary">
                <h4>Reservation Summary</h4>
                <div className="summary-item">
                  <span>Room:</span>
                  <span>{room.name}</span>
                </div>
                {formData.checkIn && formData.checkOut && (
                  <div className="summary-item">
                    <span>Duration:</span>
                    <span>
                      {Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))}{" "}
                      nights
                    </span>
                  </div>
                )}
                <div className="summary-item">
                  <span>Guests:</span>
                  <span>{formData.guests}</span>
                </div>
                <div className="summary-item total">
                  <span>Total Price:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-reserve"
                disabled={submitting || !formData.checkIn || !formData.checkOut}
              >
                {submitting ? "Processing..." : "Confirm Reservation"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservation
