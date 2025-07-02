import React from 'react';

const AdminHome = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, Admin </h1>
      <p style={styles.subheading}>Hospital Management Overview</p>

      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <h3>👨‍⚕️ Doctors</h3>
          <p>Total: <strong>18</strong></p>
        </div>

        <div style={styles.card}>
          <h3>👩‍💼 Staff</h3>
          <p>Active: <strong>25</strong></p>
        </div>

        <div style={styles.card}>
          <h3>🏥 Departments</h3>
          <p>Count: <strong>12</strong></p>
        </div>

        <div style={styles.card}>
          <h3>📅 Appointments Today</h3>
          <p><strong>34</strong> Scheduled</p>
        </div>

        <div style={styles.card}>
          <h3>💰 Billing</h3>
          <p>Today: <strong>₹48,000</strong></p>
        </div>

        <div style={styles.card}>
          <h3>🧍‍♂️ Patients Admitted</h3>
          <p><strong>58</strong> Currently</p>
        </div>

        <div style={styles.card}>
          <h3>🛏️ Available Beds</h3>
          <p><strong>22</strong> Free</p>
        </div>

        <div style={styles.card}>
          <h3>🚑 Emergency Cases</h3>
          <p><strong>6</strong> Today</p>
        </div>

        <div style={styles.card}>
          <h3>💊 Medicine Stock</h3>
          <p><strong>154</strong> Items Available</p>
        </div>

        <div style={styles.card}>
          <h3>📈 Revenue (This Month)</h3>
          <p><strong>₹12.4L</strong></p>
        </div>

        <div style={styles.card}>
          <h3>👶 Births (This Week)</h3>
          <p><strong>11</strong> Recorded</p>
        </div>

        <div style={styles.card}>
          <h3>⚰️ Deaths (This Week)</h3>
          <p><strong>2</strong> Reported</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    color: '#111827',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subheading: {
    fontSize: '1.2rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
  },
};

export default AdminHome;
