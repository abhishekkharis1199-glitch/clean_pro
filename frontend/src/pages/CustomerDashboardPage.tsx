export default function CustomerDashboardPage() {
  return (
    <main className="page-shell">
      <h2>Customer dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Bookings</span>
          <strong>12</strong>
        </div>
        <div className="stat-card">
          <span>Points</span>
          <strong>480</strong>
        </div>
        <div className="stat-card">
          <span>Favorites</span>
          <strong>4</strong>
        </div>
      </div>
    </main>
  )
}
