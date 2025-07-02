import React, { useEffect, useState } from "react";
import axios from "axios";

const VisitRoom = () => {
  const [labourRooms, setLabourRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get("http://localhost:8000/api/admin/labour-rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLabourRooms(res.data.labourRooms || []);
      } catch (err) {
        console.error("Failed to fetch labour rooms:", err);
        setError("Failed to load data.");
      }
    };

    fetchRooms();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Visit Labour Rooms</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {labourRooms.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {labourRooms.map((room, index) => (
              <tr key={room._id}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{room.name}</td>
                <td style={tdStyle}>{room.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No labour rooms found.</p>
      )}
    </div>
  );
};

// Table styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  fontWeight: "bold",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
   backgroundColor: "#f2f2f2",
};

export default VisitRoom;
