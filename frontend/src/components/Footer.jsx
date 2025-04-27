"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim() && email.includes("@")) {
      // In a real app, we would send this to the backend
      console.log(`Subscribing email: ${email}`)
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>News Stream</h3>
          <p>
            Your source for real-time news updates from around the world. Stay informed with our comprehensive coverage.
          </p>
          <div className="social-icons">
            <a href="#" title="Facebook">
              <i className="social-icon facebook"></i>
            </a>
            <a href="#" title="Twitter">
              <i className="social-icon twitter"></i>
            </a>
            <a href="#" title="Instagram">
              <i className="social-icon instagram"></i>
            </a>
            <a href="#" title="YouTube">
              <i className="social-icon youtube"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li>
              <Link to="/category/politics">Politics</Link>
            </li>
            <li>
              <Link to="/category/sports">Sports</Link>
            </li>
            <li>
              <Link to="/category/business">Business</Link>
            </li>
            <li>
              <Link to="/category/technology">Technology</Link>
            </li>
            <li>
              <Link to="/category/entertainment">Entertainment</Link>
            </li>
            <li>
              <Link to="/category/health">Health</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Subscribe to Newsletter</h3>
          <p>Stay updated with our latest news and updates.</p>
          {subscribed ? (
            <div className="subscribe-success">Thank you for subscribing!</div>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} News Stream. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
