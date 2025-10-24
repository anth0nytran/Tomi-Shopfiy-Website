import React from 'react'

export function Footer() {
  return (
    <footer className="footer" data-section-type="footer" data-anim="fade-in" data-delay="400">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-newsletter">
            <h3 className="footer-title">Join The Legacy Club</h3>
            <p className="footer-description">Sign up to be the first to know about new arrivals &amp; exclusive offers.</p>
            <form className="newsletter-form" data-newsletter-form>
              <input type="email" placeholder="ENTER EMAIL ADDRESS" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-column-title">INFO</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link" data-link-slot="footer-info-1">Account</a></li>
                <li><a href="/guide" className="footer-link" data-link-slot="footer-info-2">Jewelry Care Guide</a></li>
                <li><a href="#" className="footer-link" data-link-slot="footer-info-3">Terms &amp; Privacy</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">SUPPORT</h4>
              <ul className="footer-list">
                <li><a href="/contact" className="footer-link" data-link-slot="footer-support-1">Contact</a></li>
                <li><a href="#" className="footer-link" data-link-slot="footer-support-2">FAQ</a></li>
                <li><a href="#" className="footer-link" data-link-slot="footer-support-3">Shipping</a></li>
                <li><a href="#" className="footer-link" data-link-slot="footer-support-4">Accessibility</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">SERVICES</h4>
              <ul className="footer-list">
                <li><a href="/repair" className="footer-link" data-link-slot="footer-services-1">Repairs</a></li>
                <li><a href="#" className="footer-link" data-link-slot="footer-services-2">Recycle</a></li>
                <li><a href="/returns" className="footer-link" data-link-slot="footer-services-3">Returns</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">CONNECT</h4>
              <ul className="footer-list">
                <li><a href="https://www.instagram.com/tomijewelry" className="footer-link" data-link-slot="footer-connect-1" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://pin.it/1hAqAmari" className="footer-link" data-link-slot="footer-connect-2" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
                <li><a href="https://www.tiktok.com/@tomijewelry" className="footer-link" data-link-slot="footer-connect-3" target="_blank" rel="noopener noreferrer">TikTok</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
