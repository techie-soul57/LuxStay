import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>LuxStay Hotel</h3>
          <p>Experience luxury and comfort at its finest.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/rooms">Rooms</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/register">Register</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>LuxStay Hotel Street, Sikar</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@luxstay.com</p>
        </div>
      </div>


    </footer>
  )
}

export default Footer
