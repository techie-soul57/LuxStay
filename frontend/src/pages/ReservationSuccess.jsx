import { useLocation, useNavigate } from "react-router-dom"
import "./ReservationSuccess.css"

const ReservationSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { reservation, room } = location.state || {}

  if (!reservation || !room) {
    return (
      <div className="reservation-success-page">
        <div className="container">
          <div className="success-message">
            <h1>Reservation Successful!</h1>
            <p>Your room has been reserved successfully.</p>
            <button className="btn btn-primary" onClick={() => navigate("/rooms")}>
              Back to Rooms
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reservation-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-header">
            <i className="fas fa-check-circle"></i>
            <h1>Reservation Confirmed!</h1>
          </div>

          <div className="reservation-details">
            <h2>Reservation Details</h2>
            <div className="detail-item">
              <span>Room:</span>
              <span>{room.name}</span>
            </div>
            <div className="detail-item">
              <span>Check-in:</span>
              <span>{new Date(reservation.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span>Check-out:</span>
              <span>{new Date(reservation.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span>Guests:</span>
              <span>{reservation.guests}</span>
            </div>
            <div className="detail-item">
              <span>Payment Method:</span>
              <span>{reservation.paymentMethod === "onsite" ? "Pay at Hotel" : "Online"}</span>
            </div>
            <div className="detail-item total">
              <span>Total Price:</span>
              <span>${reservation.totalPrice}</span>
            </div>
          </div>

          <div className="success-message">
            <p>Thank you for choosing LuxStay Hotel!</p>
            <p>A confirmation email has been sent to your registered email address.</p>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/rooms")}>
              Book Another Room
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationSuccess 