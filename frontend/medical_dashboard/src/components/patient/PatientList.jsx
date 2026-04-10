import React, { useEffect, useState } from "react";
import { getPatients } from "../../api/patientApi";
import SearchBar from "./SearchBar";
import PatientTable from "./PatientTable";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    tag: "",
    date: "",
  });

  const fetchPatients = async () => {
    try {
      const res = await getPatients(filters);
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  return (
    <div>
      <h2>Patient List</h2>
      <SearchBar setFilters={setFilters} />
      <PatientTable patients={patients} />
    </div>
  );
};

export default PatientList;