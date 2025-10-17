import React, { useState, useEffect } from "react";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import appointmentService from "@/services/api/appointmentService";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

const filteredAppointments = appointments.filter(appointment => {
    if (selectedFilter === "all") return true;
    return appointment.status_c?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const filterOptions = [
    { value: "all", label: "All", count: appointments.length },
{ value: "scheduled", label: "Scheduled", count: appointments.filter(a => a.status_c === "Scheduled").length },
    { value: "confirmed", label: "Confirmed", count: appointments.filter(a => a.status_c === "Confirmed").length },
    { value: "completed", label: "Completed", count: appointments.filter(a => a.status_c === "Completed").length }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600">Manage patient appointments and schedules</p>
        </div>
        <Button icon="Plus" className="w-full sm:w-auto">
          Schedule New
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedFilter === option.value
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

      {filteredAppointments.length === 0 ? (
        <Empty
          title="No appointments found"
          description="Get started by scheduling your first appointment."
          actionLabel="Schedule Appointment"
          icon="Calendar"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.Id}
              appointment={appointment}
              onClick={(appt) => console.log("Appointment clicked:", appt)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;