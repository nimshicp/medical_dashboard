import React from "react";
import { useNavigate } from "react-router-dom";

const PatientTable = ({ patients }) => {
  const navigate = useNavigate();

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.id}</td>
            <td>
              <button onClick={() => navigate(`/patient/${p.id}`)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientTable;