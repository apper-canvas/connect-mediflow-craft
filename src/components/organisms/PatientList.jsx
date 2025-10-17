import React, { useState, useEffect } from "react";
import PatientCard from "@/components/molecules/PatientCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import patientService from "@/services/api/patientService";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPatients(patients);
      return;
    }

    try {
      const results = await patientService.search(term);
      setFilteredPatients(results);
    } catch (err) {
      setError("Search failed. Please try again.");
    }
  };

  const handlePatientClick = (patient) => {
    navigate(`/patients/${patient.Id}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        <Button
          icon="Plus"
          onClick={() => navigate("/patients/new")}
          className="w-full sm:w-auto"
        >
          Add New Patient
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search patients by name, ID, or phone..."
          onSearch={handleSearch}
          className="flex-1"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <Empty
          title="No patients found"
          description={searchTerm ? "Try adjusting your search terms." : "Get started by adding your first patient."}
          actionLabel="Add First Patient"
          icon="Users"
          onAction={() => navigate("/patients/new")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.Id}
              patient={patient}
              onClick={handlePatientClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;