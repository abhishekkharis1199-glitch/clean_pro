import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { allHomeServices } from '../data/serviceCatalog'

const ratings = ['4.9', '4.8', '4.7']
const reviewCounts = ['1.2k', '860', '540']
const experienceYears = ['2+', '4+', '3+']
const customerCounts = ['1000+', '760+', '520+']
const providerLocations = [
  { locality: 'Indiranagar, Bengaluru', distanceKm: 2.4 },
  { locality: 'Koramangala, Bengaluru', distanceKm: 6.8 },
  { locality: 'Whitefield, Bengaluru', distanceKm: 11.2 },
]
const appointmentSlots = [
  ['09:00 AM', '01:30 PM'],
  ['10:30 AM', '04:00 PM'],
  ['11:00 AM', '03:30 PM'],
]
const availableWeekdays = [
  [0, 1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5],
  [0, 6],
]

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getProviderPrice(rate: string, index: number) {
  const startingRate = Number(rate.replace(/[^\d]/g, ''))
  const adjustments = [200, 0, 100]
  return `₹${(startingRate + adjustments[index]).toLocaleString('en-IN')}`
}

export default function ServiceProvidersPage() {
  const { service: serviceValue, providerId } = useParams()
  const [showFilters, setShowFilters] = useState(false)
  const [locationFilter, setLocationFilter] = useState('')
  const [radiusFilter, setRadiusFilter] = useState('any')
  const [ratingFilter, setRatingFilter] = useState('any')
  const [today] = useState(() => getLocalDateString(new Date()))
  const [dateFilter, setDateFilter] = useState(today)
  const [availabilityFilter, setAvailabilityFilter] = useState('any')
  const service = allHomeServices.find((item) => item.value === serviceValue)

  if (!service) {
    return (
      <main className="service-marketplace-page">
        <div className="service-marketplace-message">
          <h1>We couldn't find that service</h1>
          <Link to="/">Back to home services</Link>
        </div>
      </main>
    )
  }

  const providers = service.providers.map((name, index) => ({
    id: `${service.value}-${index + 1}`,
    name,
    rating: ratings[index],
    reviews: reviewCounts[index],
    experience: experienceYears[index],
    customers: customerCounts[index],
    price: getProviderPrice(service.rate, index),
    locality: providerLocations[index].locality,
    distanceKm: providerLocations[index].distanceKm,
    slots: appointmentSlots[index],
    availableWeekdays: availableWeekdays[index],
  }))
  const selectedProvider = providers.find((provider) => provider.id === providerId)
  const selectedDate = new Date(`${dateFilter}T00:00:00`)
  const selectedWeekday = selectedDate.getDay()
  const filteredProviders = providers.filter((provider) => {
    const matchesLocation = provider.locality.toLowerCase().includes(locationFilter.trim().toLowerCase())
    const matchesRadius = radiusFilter === 'any' || provider.distanceKm <= Number(radiusFilter)
    const matchesRating = ratingFilter === 'any' || Number(provider.rating) >= Number(ratingFilter)
    const isAvailable = provider.availableWeekdays.includes(selectedWeekday)
    const matchesAvailability = availabilityFilter !== 'available' || isAvailable
    return matchesLocation && matchesRadius && matchesRating && matchesAvailability
  })

  if (providerId && !selectedProvider) {
    return (
      <main className="service-marketplace-page">
        <div className="service-marketplace-message">
          <h1>We couldn't find that provider</h1>
          <Link to={`/services/${service.value}`}>Back to {service.name} providers</Link>
        </div>
      </main>
    )
  }

  if (selectedProvider) {
    return (
      <main className="service-marketplace-page">
        <div className="service-marketplace-wrap">
          <Link className="provider-back-link" to={`/services/${service.value}`}>
            ← Back to Results
          </Link>
          <article className="provider-detail-card">
            <div className="provider-detail-main">
              <img className="provider-detail-photo" src={service.image} alt={service.alt} />
              <div className="provider-detail-copy">
                <span className="provider-service-label">{service.name}</span>
                <div className="provider-name-row">
                  <h1>{selectedProvider.name}</h1>
                  <span className="provider-verified">✓ Verified</span>
                </div>
                <p className="provider-rating">
                  <span aria-hidden="true">★</span> <strong>{selectedProvider.rating}</strong>
                  <span>({selectedProvider.reviews} reviews)</span>
                </p>
                <p className="provider-description">
                  Trusted {service.name.toLowerCase()} with professional care and reliable service.
                </p>
                <div className="provider-stats">
                  <div><strong>{selectedProvider.experience}</strong><span>Years Experience</span></div>
                  <div><strong>{selectedProvider.customers}</strong><span>Happy Customers</span></div>
                  <div><strong>Flexible</strong><span>Appointment Slots</span></div>
                </div>
                <section className="provider-offerings" aria-labelledby="provider-offerings-title">
                  <h2 id="provider-offerings-title">Services Offered</h2>
                  <ul>
                    {service.offeredServices.map((offering) => (
                      <li key={offering}><span aria-hidden="true">✓</span>{offering}</li>
                    ))}
                  </ul>
                </section>
              </div>
              <aside className="provider-booking-panel">
                <span>Starting Price</span>
                <strong>{selectedProvider.price}<small> / visit</small></strong>
                <Link className="provider-book-button" to="/register">Book Now</Link>
                <Link className="provider-message-button" to="/login">Message Provider</Link>
              </aside>
            </div>
            <section className="provider-about">
              <h2>About Us</h2>
              <p>
                {selectedProvider.name} is committed to delivering high-quality {service.name.toLowerCase()}.
                Their experienced team takes care of every visit with attention, clear communication,
                and a focus on your home.
              </p>
              <Link to={`/services/${service.value}`}>View other {service.name.toLowerCase()} providers</Link>
            </section>
          </article>
        </div>
      </main>
    )
  }

  return (
    <main className="service-marketplace-page">
      <div className="service-marketplace-wrap">
        <Link className="provider-back-link" to="/#services">← Back to Services</Link>
        <header className="provider-results-heading">
          <img className="provider-results-image" src={service.image} alt={service.alt} />
          <div>
            <span className="provider-results-kicker">TRUSTED LOCAL PROFESSIONALS</span>
            <h1>{service.name}</h1>
            <p>Choose a verified provider for your home. Compare ratings, services, and starting prices.</p>
          </div>
        </header>
        <div className="provider-filter-toolbar">
          <button
            className="provider-filter-toggle"
            type="button"
            aria-expanded={showFilters}
            aria-controls="provider-filters"
            onClick={() => setShowFilters((show) => !show)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16l-6.2 7.1v5.1l-3.6 1.8v-6.9L4 5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Filter By'}
          </button>
        </div>
        <section
          className="provider-filters"
          id="provider-filters"
          aria-label="Filter providers"
          hidden={!showFilters}
        >
          <div className="provider-filter-heading">
            <div>
              <h2>Find the right provider</h2>
              <p>Adjust these demo filters to explore sample providers and appointment times.</p>
            </div>
            <span>{filteredProviders.length} of {providers.length} providers</span>
          </div>
          <div className="provider-filter-controls">
            <label>
              Location
              <input
                type="search"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Area or city"
              />
            </label>
            <label>
              Nearby radius
              <select value={radiusFilter} onChange={(event) => setRadiusFilter(event.target.value)}>
                <option value="any">Any distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
              </select>
            </label>
            <label>
              Minimum rating
              <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
                <option value="any">Any rating</option>
                <option value="4.5">4.5 and above</option>
                <option value="4.8">4.8 and above</option>
              </select>
            </label>
            <label>
              Appointment date
              <input
                type="date"
                min={today}
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value || today)}
              />
            </label>
            <label>
              Availability
              <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)}>
                <option value="any">Show all providers</option>
                <option value="available">Available on this date</option>
              </select>
            </label>
          </div>
          <p className="provider-filter-note">Demo locations and provider schedules are sample data and can be connected to live availability later.</p>
        </section>
        {filteredProviders.length > 0 ? (
          <div className="provider-results-list">
            {filteredProviders.map((provider) => {
              const isAvailable = provider.availableWeekdays.includes(selectedWeekday)
              return (
                <Link
                  className="provider-result-card"
                  key={provider.id}
                  to={`/services/${service.value}/${provider.id}`}
                >
                  <img className="provider-result-photo" src={service.image} alt={service.alt} />
                  <div className="provider-result-copy">
                    <span className="provider-result-service">{service.name}</span>
                    <h2>{provider.name}<span className="provider-verified">✓ Verified</span></h2>
                    <p className="provider-rating">
                      <span aria-hidden="true">★</span> <strong>{provider.rating}</strong>
                      <span>({provider.reviews} reviews)</span>
                    </p>
                    <p className="provider-result-description">
                      Professional {service.name.toLowerCase()} with care and trust.
                    </p>
                    <p className="provider-location">
                      <span aria-hidden="true">⌖</span> {provider.locality}
                      <span>About {provider.distanceKm} km away</span>
                    </p>
                    <div className="provider-result-offerings">
                      {service.offeredServices.slice(0, 2).map((offering) => (
                        <span key={offering}>{offering}</span>
                      ))}
                    </div>
                    <div className="provider-available-slots">
                      <strong>{isAvailable ? 'Available slots' : 'No slots on this date'}</strong>
                      {isAvailable && provider.slots.map((slot) => <span key={slot}>{slot}</span>)}
                    </div>
                  </div>
                  <div className="provider-result-price">
                    <span>Starting from</span>
                    <strong>{provider.price}</strong>
                    <span className="provider-view-details">View details ↗</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="provider-empty-state">
            <h2>No providers match these filters</h2>
            <p>Try a wider nearby radius, another rating, or a different date or location.</p>
            <button
              type="button"
              onClick={() => {
                setLocationFilter('')
                setRadiusFilter('any')
                setRatingFilter('any')
                setDateFilter(today)
                setAvailabilityFilter('any')
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
