import { Link } from "react-router-dom"
import "./RoomCard.css"

const typeImageMap = {
  standard: "/assets/standard_room.jpeg",
  deluxe: "/assets/deluxe_king_room.jpg",
  suite: "/assets/executive_suite.jpeg",
  family: "/assets/family_room.jpeg",
  default: "/assets/deluxe_king_room.jpg"
}

const RoomCard = ({ room }) => {
  const imageSrc = room.image || typeImageMap[room.type] || typeImageMap.default
  return (
    <div className="room-card">
      <div className={`room-card-image${!room.available ? ' reserved' : ''}`}>
        <img
          src={imageSrc}
          alt={room.name}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          onError={e => { e.target.src = typeImageMap.default }}
        />
        {!room.available && <div className="room-reserved">Reserved</div>}
      </div>
      <div className="room-card-content">
        <h3>{room.name}</h3>
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
        <p className="room-description">{room.description}</p>
        <div className="room-card-footer">
          <div className="room-price">
            ${room.price}
            <span>/night</span>
          </div>
          {room.available ? (
            <Link to={`/reservation/${room.id}`} className="btn btn-book">
              Book Now
            </Link>
          ) : (
            <button className="btn btn-unavailable" disabled>
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomCard
