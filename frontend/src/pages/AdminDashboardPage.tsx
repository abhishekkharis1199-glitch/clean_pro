export default function AdminDashboardPage() {
  return (
    <main className="page-shell">
      <h2>Admin dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Active users</span>
          <strong>1,245</strong>
        </div>
        <div className="stat-card">
          <span>Bookings today</span>
          <strong>64</strong>
        </div>
        <div className="stat-card">
          <span>Revenue</span>
          <strong>$12,980</strong>
        </div>
      </div>
    </main>
  )
}
