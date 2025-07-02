import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewSpecialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get("http://localhost:8000/api/admin/specialties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSpecialties(res.data.specialties);
      } catch (err) {
        console.error("Failed to fetch specialties:", err);
        setError("Failed to load specialties");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  if (loading) return <p>Loading specialties...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Specialties</h2>
      {specialties.length === 0 ? (
        <p>No specialties found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Specialty Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {specialties.map((spec, index) => (
              <tr key={spec._id}>
                <td>{index + 1}</td>
                <td>{spec.name}</td>
                <td>{spec.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewSpecialty;
