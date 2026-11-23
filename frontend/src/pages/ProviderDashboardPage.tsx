import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type BookingStatus = 'New request' | 'Accepted' | 'Declined'
type EarningsPeriod = 'Today' | 'This week' | 'This month'
type CalendarView = 'Month' | 'Week' | 'Day'

type Booking = {
  id: number
  customer: string
  service: string
  date: Date
  time: string
  address: string
  price: number
  status: BookingStatus
}

type DashboardLocationState = {
  applicationSubmitted?: boolean
  providerName?: string
  profilePhotoUrl?: string
  businessName?: string
  category?: string
  customCategory?: string
  categoryNeedsReview?: boolean
  teamSize?: string
}

function getNextPayoutDate() {
  const date = new Date()
  const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7
  date.setDate(date.getDate() + daysUntilFriday)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

const initialBookings: Booking[] = [
  {
    id: 1,
    customer: 'Olivia Bennett',
    service: 'Deep home cleaning',
    date: plusDays(1),
    time: '9:00 AM – 12:00 PM',
    address: 'Westwood, Los Angeles',
    price: 180,
    status: 'New request',
  },
  {
    id: 2,
    customer: 'Noah Williams',
    service: 'Regular home cleaning',
    date: plusDays(3),
    time: '1:30 PM – 3:30 PM',
    address: 'Santa Monica, Los Angeles',
    price: 120,
    status: 'Accepted',
  },
  {
    id: 3,
    customer: 'Emma Chen',
    service: 'Move-out cleaning',
    date: plusDays(6),
    time: '10:00 AM – 1:00 PM',
    address: 'Culver City, Los Angeles',
    price: 220,
    status: 'New request',
  },
]

const earnings: Record<EarningsPeriod, { amount: string; jobs: string; change: string }> = {
  Today: { amount: '$240', jobs: '2 jobs completed', change: '+12% vs. yesterday' },
  'This week': { amount: '$1,180', jobs: '9 jobs completed', change: '+8% vs. last week' },
  'This month': { amount: '$4,620', jobs: '34 jobs completed', change: '+16% vs. last month' },
}

const earningsCharts: Record<EarningsPeriod, { labels: string[]; values: number[] }> = {
  Today: { labels: ['8a', '10a', '12p', '2p', '4p', '6p'], values: [24, 42, 34, 68, 51, 82] },
  'This week': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [38, 72, 54, 91, 63, 82, 45] },
  'This month': { labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], values: [48, 77, 62, 94] },
}

const initialNotifications = [
  { id: 1, title: 'New booking request', message: 'Olivia requested a deep home cleaning.', time: '12 min ago', type: 'booking' },
  { id: 2, title: 'New customer review', message: '“Very thorough and right on time. Thank you!”', time: '2 hours ago', type: 'review' },
  { id: 3, title: 'Payout processed', message: '$320 has been sent to your payout method.', time: 'Yesterday', type: 'payout' },
]

function plusDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(12, 0, 0, 0)
  return date
}

function formatBookingDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date)
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function addDays(date: Date, amount: number) {
  const updated = new Date(date)
  updated.setDate(updated.getDate() + amount)
  return updated
}

function getWeekStart(date: Date) {
  const start = new Date(date)
  start.setDate(start.getDate() - start.getDay())
  start.setHours(0, 0, 0, 0)
  return start
}

export default function ProviderDashboardPage() {
  const location = useLocation()
  const signupState = (location.state ?? {}) as DashboardLocationState
  const [bookings, setBookings] = useState(initialBookings)
  const [period, setPeriod] = useState<EarningsPeriod>('This week')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [calendarView, setCalendarView] = useState<CalendarView>('Month')
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    return date
  })
  const [today] = useState(() => new Date())
  const [nextPayoutDate] = useState(getNextPayoutDate)
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  })

  const providerName = signupState.providerName || 'Jordan Taylor'
  const currentEarnings = earnings[period]
  const chartData = earningsCharts[period]
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const calendarCells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  const bookingsForDay = (day: number) =>
    bookings.filter((booking) => dateKey(booking.date) === `${month.getFullYear()}-${month.getMonth()}-${day}`)

  const updateBooking = (bookingId: number, status: BookingStatus) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
    )
  }

  const changeMonth = (amount: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  const changeCalendarPeriod = (amount: number) => {
    if (calendarView === 'Month') {
      changeMonth(amount)
      setSelectedDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, Math.min(current.getDate(), 28)))
      return
    }

    setSelectedDate((current) => addDays(current, amount * (calendarView === 'Week' ? 7 : 1)))
  }

  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(month)
  const weekStart = getWeekStart(selectedDate)
  const visibleWeek = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const selectedDayBookings = bookings.filter((booking) => dateKey(booking.date) === dateKey(selectedDate))

  return (
    <main className="provider-dashboard-page">
      <div className="provider-dashboard">
        <header className="dashboard-welcome">
          <div className="provider-identity">
            <div className="provider-avatar">
              {signupState.profilePhotoUrl ? (
                <img src={signupState.profilePhotoUrl} alt={`${providerName} profile`} />
              ) : (
                <span aria-hidden="true">{providerName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
              )}
            </div>
            <div>
              <span className="section-kicker">PROVIDER WORKSPACE</span>
              <h1>{greeting}, {providerName.split(' ')[0]}</h1>
              <p>Here’s what’s happening with your business today.</p>
            </div>
          </div>
          <div className="provider-profile-status">
            <span className="kyc-status"><span aria-hidden="true" />KYC under review</span>
            <Link className="profile-link" to="/provider/signup">Complete profile <span aria-hidden="true">→</span></Link>
          </div>
        </header>

        {signupState.applicationSubmitted && (
          <div className="application-banner" role="status">
            <span aria-hidden="true">✓</span>
            Your application has been submitted in this demo. KYC review is pending; no files were sent to a server.
          </div>
        )}

        {signupState.categoryNeedsReview && signupState.customCategory && (
          <div className="custom-category-review" role="status">
            <div>
              <span className="section-kicker">CUSTOM SERVICE CATEGORY</span>
              <strong>{signupState.customCategory}</strong>
              <span className="custom-category-business">{signupState.businessName}</span>
            </div>
            <span className="review-required-badge"><span aria-hidden="true" />Needs admin review</span>
          </div>
        )}

        <section className="earnings-card" aria-labelledby="earnings-heading">
          <div className="section-heading earnings-heading">
            <div>
              <span className="section-kicker">YOUR BUSINESS AT A GLANCE</span>
              <h2 id="earnings-heading">Earnings overview</h2>
            </div>
            <div className="period-switch" role="group" aria-label="Earnings period">
              {(['Today', 'This week', 'This month'] as EarningsPeriod[]).map((value) => (
                <button className={period === value ? 'is-selected' : ''} key={value} type="button" onClick={() => setPeriod(value)}>
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="earnings-overview">
            <article className="earning-metric earning-main">
              <span>Gross earnings</span>
              <strong>{currentEarnings.amount}</strong>
              <small className="positive-change">{currentEarnings.change}</small>
            </article>
            <article className="earning-metric">
              <span>Jobs completed</span>
              <strong>{currentEarnings.jobs.split(' ')[0]}</strong>
              <small>{currentEarnings.jobs}</small>
            </article>
            <article className="earning-metric">
              <span>Next payout</span>
              <strong>$486</strong>
              <small>Arrives Friday, {nextPayoutDate}</small>
            </article>
          </div>
          <div className="earnings-chart" key={period} role="img" aria-label={`${period} earnings activity chart`}>
            <div className="chart-y-labels" aria-hidden="true"><span>$250</span><span>$125</span><span>$0</span></div>
            <div className="chart-bars">
              {chartData.values.map((value, index) => (
                <div className="chart-column" key={`${chartData.labels[index]}-${value}`}>
                  <div className="chart-bar-track"><span className="chart-bar" style={{ height: `${value}%`, animationDelay: `${index * 45}ms` }} /></div>
                  <span>{chartData.labels[index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="payout-track">
            <div className="payout-track-icon" aria-hidden="true">↗</div>
            <div className="payout-track-copy">
              <strong>Payout on the way</strong>
              <span>$320 · Scheduled payout ·•••• 4821</span>
            </div>
            <span className="payout-chip">Processing</span>
          </div>
        </section>

        <div className="provider-dashboard-grid">
          <section className="dashboard-card bookings-card" aria-labelledby="bookings-heading">
            <div className="section-heading">
              <div>
                <span className="section-kicker">STAY ON TOP OF YOUR SCHEDULE</span>
                <h2 id="bookings-heading">Upcoming jobs</h2>
              </div>
              <span className="count-pill">{bookings.filter((booking) => booking.status !== 'Declined').length} bookings</span>
            </div>
            <div className="booking-list">
              {bookings.map((booking) => (
                <article className="booking-row" key={booking.id}>
                  <div className="booking-date-box">
                    <strong>{booking.date.getDate()}</strong>
                    <span>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(booking.date)}</span>
                  </div>
                  <div className="booking-details">
                    <div className="booking-title-row">
                      <h3>{booking.service}</h3>
                      <span className={`status-badge status-${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
                    </div>
                    <p>{booking.customer} · {formatBookingDate(booking.date)}</p>
                    <p>{booking.time} · {booking.address}</p>
                  </div>
                  <div className="booking-actions">
                    <strong>${booking.price}</strong>
                    {booking.status === 'New request' ? (
                      <div>
                        <button className="accept-action" type="button" onClick={() => updateBooking(booking.id, 'Accepted')}>Accept</button>
                        <button className="reject-action" type="button" onClick={() => updateBooking(booking.id, 'Declined')}>Decline</button>
                      </div>
                    ) : (
                      <span className="booking-confirmation">{booking.status === 'Accepted' ? 'Added to schedule' : 'Request declined'}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-card calendar-card" aria-labelledby="calendar-heading">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PLAN AHEAD</span>
                <h2 id="calendar-heading">Job calendar</h2>
              </div>
              <div className="calendar-toolbar">
                <div className="calendar-view-switch" role="group" aria-label="Calendar view">
                  {(['Month', 'Week', 'Day'] as CalendarView[]).map((view) => (
                    <button className={calendarView === view ? 'is-selected' : ''} type="button" key={view} onClick={() => setCalendarView(view)}>{view}</button>
                  ))}
                </div>
                <div className="calendar-controls">
                  <button type="button" aria-label={`Previous ${calendarView.toLowerCase()}`} onClick={() => changeCalendarPeriod(-1)}>‹</button>
                  <button type="button" aria-label={`Next ${calendarView.toLowerCase()}`} onClick={() => changeCalendarPeriod(1)}>›</button>
                </div>
              </div>
            </div>
            <div className="calendar-month">
              {calendarView === 'Month'
                ? monthLabel
                : calendarView === 'Week'
                  ? `${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(visibleWeek[0])} – ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(visibleWeek[6])}`
                  : new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(selectedDate)}
            </div>
            <div className="calendar-view-content" key={calendarView}>
              {calendarView === 'Month' && (
                <div className="calendar-grid" role="grid" aria-label="Bookings calendar">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span className="calendar-weekday" role="columnheader" key={day}>{day}</span>)}
                  {calendarCells.map((day, index) => {
                    if (day === null) return <span className="calendar-empty" key={`empty-${index}`} />
                    const dayBookings = bookingsForDay(day)
                    const isToday = today.getDate() === day && today.getMonth() === month.getMonth() && today.getFullYear() === month.getFullYear()
                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month.getMonth() && selectedDate.getFullYear() === month.getFullYear()
                    return (
                      <button
                        className={`calendar-day${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}${dayBookings.length ? ' has-job' : ''}`}
                        type="button"
                        aria-label={`${day} ${dayBookings.length ? `, ${dayBookings.length} booking${dayBookings.length > 1 ? 's' : ''}` : ''}`}
                        key={day}
                        onClick={() => setSelectedDate(new Date(month.getFullYear(), month.getMonth(), day, 12))}
                      >
                        {day}<i />
                      </button>
                    )
                  })}
                </div>
              )}
              {calendarView === 'Week' && (
                <div className="calendar-week-list">
                  {visibleWeek.map((date) => {
                    const dayBookings = bookings.filter((booking) => dateKey(booking.date) === dateKey(date))
                    return (
                      <button className={`calendar-week-day${dateKey(date) === dateKey(selectedDate) ? ' is-selected' : ''}`} type="button" key={dateKey(date)} onClick={() => setSelectedDate(date)}>
                        <span>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}</span>
                        <strong>{date.getDate()}</strong>
                        {dayBookings.length > 0 && <i aria-label={`${dayBookings.length} jobs`} />}
                      </button>
                    )
                  })}
                </div>
              )}
              {calendarView === 'Day' && (
                <div className="calendar-day-agenda">
                  {selectedDayBookings.length ? selectedDayBookings.map((booking) => (
                    <article className="agenda-booking" key={booking.id}>
                      <span>{booking.time.split('–')[0].trim()}</span>
                      <div><strong>{booking.service}</strong><small>{booking.customer} · {booking.address}</small></div>
                      <span className={`status-badge status-${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
                    </article>
                  )) : <p className="calendar-empty-state">No jobs scheduled for this day.</p>}
                </div>
              )}
            </div>
            <div className="calendar-legend"><span /> Scheduled jobs</div>
          </section>

          <section className="dashboard-card notifications-card" aria-labelledby="notifications-heading">
            <div className="section-heading">
              <div>
                <span className="section-kicker">LATEST UPDATES</span>
                <h2 id="notifications-heading">Notifications</h2>
              </div>
              {notifications.length > 0 && <span className="notification-count">{notifications.length} new</span>}
            </div>
            <div className="notification-list">
              {notifications.length ? notifications.map((notification) => (
                <article className="notification-row" key={notification.id}>
                  <span className={`notification-icon notification-${notification.type}`} aria-hidden="true">
                    {notification.type === 'booking' ? '＋' : notification.type === 'review' ? '★' : '↗'}
                  </span>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </div>
                  <button type="button" aria-label={`Dismiss ${notification.title}`} onClick={() => setNotifications((current) => current.filter((item) => item.id !== notification.id))}>×</button>
                </article>
              )) : <p className="empty-notifications">You’re all caught up.</p>}
            </div>
          </section>

          <section className="dashboard-card ratings-card" aria-labelledby="ratings-heading">
            <div className="section-heading">
              <div>
                <span className="section-kicker">CUSTOMER FEEDBACK</span>
                <h2 id="ratings-heading">Your ratings</h2>
              </div>
              <Link className="text-link" to="/provider">All reviews →</Link>
            </div>
            <div className="rating-summary">
              <strong>4.9</strong>
              <div>
                <div className="rating-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span>Based on 128 reviews</span>
              </div>
            </div>
            <article className="customer-review">
              <div className="review-avatar">OB</div>
              <div>
                <div className="review-author"><strong>Olivia B.</strong><span>★★★★★</span></div>
                <p>“Wonderful service. The team was punctual, friendly, and left everything sparkling.”</p>
                <small>Deep home cleaning · 2 days ago</small>
              </div>
            </article>
          </section>
        </div>
        <p className="dashboard-demo-note">Preview dashboard with sample data · <Link to="/provider/signup">Set up a provider profile</Link></p>
      </div>
    </main>
  )
}
