import { Link } from "react-router-dom"
import "./Home.css"

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to LuxStay Hotel</h1>
          <p>Experience luxury and comfort at its finest</p>
          <Link to="/rooms" className="btn btn-hero">
            Explore Rooms
          </Link>
        </div>
      </section>


      <section className="features container">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-concierge-bell"></i>
            </div>
            <h3>Premium Service</h3>
            <p>Our staff is dedicated to providing exceptional service to make your stay memorable.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-bed"></i>
            </div>
            <h3>Comfortable Rooms</h3>
            <p>All our rooms are designed with your comfort in mind, featuring premium amenities.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <h3>Fine Dining</h3>
            <p>Enjoy exquisite cuisine prepared by our world-class chefs in our restaurant.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3>Prime Location</h3>
            <p>Located in the heart of the city with easy access to major attractions and transport.</p>
          </div>
        </div>
      </section>

      <section className="room-preview container">
        <h2 className="section-title">Featured Rooms</h2>
        <div className="room-preview-grid">
          <div className="preview-card">
            <img src="/assets/deluxe_king_room.jpg" alt="Deluxe Room" style={{ width: '400px', height: '300px', objectFit: 'cover' }} />
            <div className="preview-content">
              <h3>Deluxe Room</h3>
              <p>Spacious room with a king-size bed and city view</p>
              <p className="preview-price">From $199/night</p>
              <Link to="/rooms" className="btn">
                View Details
              </Link>
            </div>
          </div>

          <div className="preview-card">
            <img src="/assets/executive_suite.jpeg" alt="Executive Suite" style={{ width: '400px', height: '300px', objectFit: 'cover' }} />
            <div className="preview-content">
              <h3>Executive Suite</h3>
              <p>Luxury suite with separate living area and premium amenities</p>
              <p className="preview-price">From $299/night</p>
              <Link to="/rooms" className="btn">
                View Details
              </Link>
            </div>
          </div>

          <div className="preview-card">
            <img src="/assets/family_room.jpeg" alt="Family Room" style={{ width: '400px', height: '300px', objectFit: 'cover' }} />
            <div className="preview-content">
              <h3>Family Room</h3>
              <p>Perfect for families with two queen beds and extra space</p>
              <p className="preview-price">From $249/night</p>
              <Link to="/rooms" className="btn">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Experience Luxury?</h2>
          <p>Book your stay now and enjoy our special offers</p>
          <Link to="/rooms" className="btn btn-cta">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
