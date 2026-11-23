import { useState } from 'react'
import { Link } from 'react-router-dom'
import { allHomeServices, featuredServices } from '../data/serviceCatalog'

const visibleServices = featuredServices.slice(0, 5)
const moreServices = allHomeServices.slice(visibleServices.length)

const benefits = [
  { label: 'Trusted Professionals', icon: 'shield' },
  { label: 'Instant Booking', icon: 'star' },
  { label: 'Transparent Pricing', icon: 'clock' },
  { label: '24/7 Support', icon: 'support' },
]

function CategoryIcon({ name }: { name: string }) {
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.7-3 8-7 10-4-2-7-5.3-7-10V6l7-3Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'star') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19v-2a7 7 0 0 1 14 0v2M5 19H3v-4h3v5H5Zm14 0h2v-4h-3v5h1ZM12 4a3 3 0 0 1 3 3v1H9V7a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

export default function LandingPage() {
  const [showAdditionalServices, setShowAdditionalServices] = useState(false)

  return (
    <div className="landing-page">
      <main>
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-hero-image" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=88"
              alt=""
            />
          </div>
          <div className="landing-intro">
            <h1 id="landing-title">
              Your One-Stop
              <br />
              Home Services
              <br />
              <span>Marketplace</span>
            </h1>
            <p>
              Book trusted professionals for Cleaning,
              <br className="desktop-break" /> Electricians, Plumbers, Painters and more.
            </p>
          </div>

        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="services-section-header">
            <h2 id="services-title">Our Services</h2>
            <button
              className="services-see-all"
              type="button"
              aria-expanded={showAdditionalServices}
              aria-controls="additional-services"
              onClick={() => setShowAdditionalServices((show) => !show)}
            >
              {showAdditionalServices ? 'Show Less' : 'See All'}
            </button>
          </div>
          <div className="service-categories" aria-label="Featured home services">
            {visibleServices.map((category) => (
              <Link
                className="service-category"
                key={category.value}
                to={`/services/${category.value}`}
              >
                <img className="category-photo" src={category.image} alt={category.alt} loading="lazy" />
                <span className="service-card-content">
                  <strong className="service-card-title">{category.name}</strong>
                  <span className="service-card-description">{category.description}</span>
                  <span className="service-card-footer">
                    <span><small>Starting from</small><strong>{category.rate}</strong></span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div
            className="additional-services"
            id="additional-services"
            hidden={!showAdditionalServices}
          >
            {moreServices.map((service) => (
              <Link
                className="service-category"
                key={service.value}
                to={`/services/${service.value}`}
              >
                <img
                  className="category-photo"
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                />
                <span className="service-card-content">
                  <strong className="service-card-title">{service.name}</strong>
                  <span className="service-card-description">{service.description}</span>
                  <span className="service-card-footer">
                    <span><small>Starting from</small><strong>{service.rate}</strong></span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="service-benefits" aria-label="Why book with CleanHome">
          {benefits.map((benefit) => (
            <div className="service-benefit" key={benefit.label}>
              <CategoryIcon name={benefit.icon} />
              <span>{benefit.label}</span>
            </div>
          ))}
        </section>

        <section className="how-it-works-section" id="how-it-works" aria-labelledby="how-it-works-title">
          <div className="how-it-works-inner">
            <div className="how-it-works-heading">
              <span className="landing-kicker">02 / SIMPLE BY DESIGN</span>
              <h2 id="how-it-works-title">A happier home,<br />in three easy steps.</h2>
            </div>
            <ol className="booking-steps">
              <li><span>01</span><strong>Choose the help you need</strong><span className="step-check" aria-hidden="true">✓</span></li>
              <li><span>02</span><strong>Pick a free appointment slot</strong><span className="step-check" aria-hidden="true">✓</span></li>
              <li><span>03</span><strong>Book online. We take it from here.</strong><span className="step-check" aria-hidden="true">✓</span></li>
            </ol>
          </div>
        </section>

        <section className="about-cleanhome" id="about-us" aria-labelledby="about-cleanhome-title">
          <span className="landing-kicker">03 / ABOUT CLEAN HOME</span>
          <h2 id="about-cleanhome-title">Home should feel like<br />a place to relax.<br /><span>Not a to-do list.</span></h2>
          <p>
            We bring home cleaning and essential maintenance together in one easy-to-use
            place. Our focus is simple: help you find a cleaning team, schedule a visit that
            fits your day, and give your space the care it deserves.
          </p>
          <Link className="about-booking-link" to="/register">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M7.5 3v4M16.5 3v4M4 9.5h16M8 13h2m4 0h2m-8 4h2m4 0h2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
            Make time for your home
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <Link className="footer-brand" to="/">CLEAN HOME</Link>
        <span className="footer-tagline">A little help. A happier home.</span>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#services">Services</a>
          <a href="#about-us">About us</a>
          <a href="#cookie-settings">Cookie settings</a>
        </nav>
        <span className="footer-copyright">© 2026 CLEAN HOME</span>
      </footer>
    </div>
  )
}
