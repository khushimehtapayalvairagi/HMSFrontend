// src/pages/lab/Appointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("jwt"); // get token from storage
        if (!token) {
          console.error("No token found, please login again");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/lab/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`, // send token
          },
        });

        setAppointments(res.data.appointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [BASE_URL]);

  return (
    <div>
      <h2>Appointments</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Test Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.patientId?.fullName}</td>
              <td>{a.testType}</td>
              <td>{new Date(a.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
