// import React from 'react';

// const AdminHome = () => {
//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>Welcome, Admin </h1>
//       <p style={styles.subheading}>Hospital Management Overview</p>

//       <div style={styles.cardsContainer}>
//         <div style={styles.card}>
//           <h3>👨‍⚕️ Doctors</h3>
//           <p>Total: <strong>18</strong></p>
//         </div>

//         <div style={styles.card}>
//           <h3>👩‍💼 Staff</h3>
//           <p>Active: <strong>25</strong></p>
//         </div>

//         <div style={styles.card}>
//           <h3>🏥 Departments</h3>
//           <p>Count: <strong>12</strong></p>
//         </div>

//         <div style={styles.card}>
//           <h3>📅 Appointments Today</h3>
//           <p><strong>34</strong> Scheduled</p>
//         </div>

//         <div style={styles.card}>
//           <h3>💰 Billing</h3>
//           <p>Today: <strong>₹48,000</strong></p>
//         </div>

//         <div style={styles.card}>
//           <h3>🧍‍♂️ Patients Admitted</h3>
//           <p><strong>58</strong> Currently</p>
//         </div>

//         <div style={styles.card}>
//           <h3>🛏️ Available Beds</h3>
//           <p><strong>22</strong> Free</p>
//         </div>

//         <div style={styles.card}>
//           <h3>🚑 Emergency Cases</h3>
//           <p><strong>6</strong> Today</p>
//         </div>

//         <div style={styles.card}>
//           <h3>💊 Medicine Stock</h3>
//           <p><strong>154</strong> Items Available</p>
//         </div>

//         <div style={styles.card}>
//           <h3>📈 Revenue (This Month)</h3>
//           <p><strong>₹12.4L</strong></p>
//         </div>

//         <div style={styles.card}>
//           <h3>👶 Births (This Week)</h3>
//           <p><strong>11</strong> Recorded</p>
//         </div>

//         <div style={styles.card}>
//           <h3>⚰️ Deaths (This Week)</h3>
//           <p><strong>2</strong> Reported</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     color: '#111827',
//   },
//   heading: {
//     fontSize: '2rem',
//     marginBottom: '0.5rem',
//   },
//   subheading: {
//     fontSize: '1.2rem',
//     color: '#6b7280',
//     marginBottom: '1.5rem',
//   },
//   cardsContainer: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//     gap: '20px',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '10px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
//     border: '1px solid #e5e7eb',
//   },
// };

// export default AdminHome;
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminHome = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalSpecialties: 0,
    totalDepartments: 0,
    totalWards: 0,
    totalOTs: 0,
    // opdCount: 0,
    // ipdCount: 0,
    billingTotal: 0,
    birthsCount: 0,
    paymentRecTotal: 0,
    // totalVisitsToday: 0,
  });

  const fetchStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [
        patientsRes,
        doctorsRes,
        specialtiesRes,
        departmentsRes,
        wardsRes,
        otsRes,
        // opdRes,
        // ipdRes,
        billRes,
        birthRes,
        paymentRecRes,
      ] = await Promise.all([
        axios.get(`${BASE_URL}/api/receptionist/patients`, { headers }),
        axios.get(`${BASE_URL}/api/receptionist/doctors`, { headers }),
        axios.get(`${BASE_URL}/api/admin/specialties`, { headers }),
        axios.get(`${BASE_URL}/api/admin/departments`, { headers }),
        axios.get(`${BASE_URL}/api/receptionist/wards`, { headers }),
        axios.get(`${BASE_URL}/api/admin/operation-theaters`, { headers }),
        // axios.get(`${BASE_URL}/api/reports/opd-register`, { headers }),
        // axios.get(`${BASE_URL}/api/reports/ipd-register/central`, { headers }),
        axios.get(`${BASE_URL}/api/reports/billing-summary`, { headers }),
        axios.get(`${BASE_URL}/api/reports/birth-records`, { headers }),
        axios.get(`${BASE_URL}/api/reports/payment-reconciliation`, { headers }),
      ]);

      setStats({
        totalDoctors: doctorsRes.data.doctors?.length || 0,
        totalPatients: patientsRes.data.patients?.length || 0,
        totalSpecialties: specialtiesRes.data.specialties?.length || 0,
        totalDepartments: departmentsRes.data.departments?.length || 0,
        totalWards: wardsRes.data.wards?.length || 0,
        totalOTs: otsRes.data.theaters?.length || 0,
        // opdCount: opdRes.data.total || 0,
        // ipdCount: ipdRes.data.total || 0,
        billingTotal: billRes.data.totalAmount || 0,
        birthsCount: birthRes.data.totalBirths || 0,
        // paymentRecTotal: paymentRecRes.data.total || 0,
        paymentRecTotal: paymentRecRes.data.totalReceived || 0,

        // totalVisitsToday: opdRes.data.today || 0, // adjust if your API returns differently
      });
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: "👨‍⚕️ Total Doctors", value: stats.totalDoctors },
    { title: "🧍‍♂️ Total Patients", value: stats.totalPatients },
    { title: "📚 Specialties", value: stats.totalSpecialties },
    { title: "🏢 Departments", value: stats.totalDepartments },
    { title: "🛏️ Total Wards", value: stats.totalWards },
    { title: "🏥 Operation Theaters", value: stats.totalOTs },
    // { title: "📋 OPD Visits", value: stats.opdCount },
    // { title: "🏥 IPD Admissions", value: stats.ipdCount },
    { title: "💰 Billing Total", value: `₹${stats.billingTotal}` },
    { title: "👶 Births", value: stats.birthsCount },
    { title: "💳 Payments Reconciled", value: stats.paymentRecTotal },
    // { title: "📅 Visits Today", value: stats.totalVisitsToday },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, Admin</h1>
      <p style={styles.subheading}>Anjuman - I - Islam's Dr. m. i. Jamkhanawala Tibbia Unani Medical
College & Haji A. R. Kalsekar Tibbia Hospital</p>

      <div style={styles.cardsContainer}>
        {cards.map((card, idx) => (
          <div key={idx} style={styles.card}>
            <h3>{card.title}</h3>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "1rem" },
  heading: { fontSize: "2rem", marginBottom: "0.5rem" },
  subheading: { fontSize: "1.2rem", color: "#666", marginBottom: "1rem" },
  cardsContainer: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
};

export default AdminHome;

