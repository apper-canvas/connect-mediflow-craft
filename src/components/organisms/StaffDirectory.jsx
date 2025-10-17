import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import doctorService from "@/services/api/doctorService";

const StaffDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await doctorService.getAll();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError("Failed to load staff directory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

const departments = [...new Set(doctors.map(doctor => doctor.department_c))];
  const handleSearch = (term) => {
    let filtered = doctors;
    
    if (term.trim()) {
      filtered = filtered.filter(doctor => 
doctor.name_c?.toLowerCase().includes(term.toLowerCase()) ||
        doctor.specialization_c?.toLowerCase().includes(term.toLowerCase()) ||
        doctor.department_c?.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (selectedDepartment !== "all") {
filtered = filtered.filter(doctor => doctor.department_c === selectedDepartment);
    }

    setFilteredDoctors(filtered);
  };

  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    let filtered = doctors;

    if (department !== "all") {
filtered = filtered.filter(doctor => doctor.department_c === department);
    }

    setFilteredDoctors(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'on duty': return 'primary';
      case 'off duty': return 'error';
      default: return 'default';
    }
  };

const departmentOptions = [
    { value: "all", label: "All Departments", count: doctors.length },
    ...departments.map(dept => ({
      value: dept,
      label: dept,
      count: doctors.filter(d => d.department_c === dept).length
    }))
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDoctors} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
        <p className="text-gray-600">Find and contact medical staff members</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search doctors by name, specialization..."
          onSearch={handleSearch}
          className="flex-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {departmentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleDepartmentFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedDepartment === option.value
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {option.label}
            <Badge variant="default" className="ml-2 bg-gray-100 text-gray-600">
              {option.count}
            </Badge>
          </button>
        ))}
      </div>

      {filteredDoctors.length === 0 ? (
        <Empty
          title="No staff members found"
          description="Try adjusting your search terms or department filter."
          icon="UserCheck"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.Id} className="hover:scale-105 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={24} className="text-primary" />
                    </div>
                    <div>
<h3 className="font-semibold text-gray-900">{doctor.name_c}</h3>
                      <p className="text-sm text-gray-500">{doctor.doctor_id_c}</p>
                    </div>
                  </div>
<Badge variant={getStatusColor(doctor.status_c)}>
                    {doctor.status_c}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
<ApperIcon name="Stethoscope" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{doctor.specialization_c}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
<ApperIcon name="Building2" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{doctor.department_c}</span>
                  </div>

                  <div className="flex items-center space-x-2">
<ApperIcon name="Phone" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{doctor.phone_c}</span>
                  </div>

                  <div className="flex items-center space-x-2">
<ApperIcon name="Mail" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{doctor.email_c}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Users" size={16} className="text-gray-400" />
<span className="text-gray-600">
                      {doctor.current_patients_c} current patients
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
<ApperIcon name="Award" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{doctor.experience_c} experience</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <button className="flex-1 text-xs py-2 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    View Schedule
                  </button>
                  <button className="flex-1 text-xs py-2 px-3 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors">
                    Contact
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;