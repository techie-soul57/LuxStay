import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./RoomDetails.css"

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`)
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
  }, [id])

  const handleReserve = () => {
    navigate(`/reservation/${id}`)
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

  return (
    <div className="room-details-page">
      <div className="container">
        <div className="room-details-container">
          <div className="room-image">
            <img
              src={
                room.image ||
                (room.type === 'deluxe' ? '/assets/deluxe_king_room.jpg'
                : room.type === 'suite' ? '/assets/executive_suite.jpeg'
                : room.type === 'family' ? '/assets/family-room.jpeg'
                : '/assets/standard_room.jpeg')
              }
              alt={room.name}
              style={{ width: '400px', height: '300px', objectFit: 'cover' }}
            />
          </div>

          <div className="room-info">
            <h1>{room.name}</h1>
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

            <div className="room-price">
              ${room.price}
              <span>/night</span>
            </div>

            <div className="room-description">
              <h2>Description</h2>
              <p>{room.description}</p>
            </div>

            <div className="room-amenities">
              <h2>Amenities</h2>
              <ul>
                <li>
                  <i className="fas fa-wifi"></i> Free WiFi
                </li>
                <li>
                  <i className="fas fa-tv"></i> Smart TV
                </li>
                <li>
                  <i className="fas fa-snowflake"></i> Air Conditioning
                </li>
                <li>
                  <i className="fas fa-coffee"></i> Coffee Maker
                </li>
                <li>
                  <i className="fas fa-shower"></i> Private Bathroom
                </li>
                <li>
                  <i className="fas fa-phone"></i> Room Service
                </li>
              </ul>
            </div>

            <button
              className="btn btn-reserve"
              onClick={handleReserve}
              disabled={!room.available}
            >
              {room.available ? "Reserve Now" : "Not Available"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails 