import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewSpecialty.css"; // External CSS
import BulkUploadSpecialty from "./BulkUploadSpecialty";

const ViewSpecialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ✅ Define fetchSpecialties once, outside useEffect
  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE_URL}/api/admin/specialties`, {
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

  // ✅ Call fetchSpecialties when component mounts
  useEffect(() => {
    fetchSpecialties();
  }, []);

  if (loading) return <p className="loading-text">Loading specialties...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="specialty-container">
      <h2 className="specialty-title">Specialties</h2>

      {/* ✅ Pass fetchSpecialties so BulkUpload can refresh the list */}
      <BulkUploadSpecialty onUploadSuccess={fetchSpecialties} />

      {specialties.length === 0 ? (
        <p>No specialties found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="responsive-table">
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
        </div>
      )}
    </div>
  );
};

export default ViewSpecialty;
