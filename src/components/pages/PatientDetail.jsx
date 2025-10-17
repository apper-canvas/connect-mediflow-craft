import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import visitService from "@/services/api/visitService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientData, appointmentData, visitData] = await Promise.all([
        patientService.getById(id),
        appointmentService.getByPatientId(`PAT${String(id).padStart(3, '0')}`),
        visitService.getByPatientId(`PAT${String(id).padStart(3, '0')}`)
      ]);

      if (!patientData) {
        setError("Patient not found");
        return;
      }

      setPatient(patientData);
      setAppointments(appointmentData || []);
      setVisits(visitData || []);
    } catch (err) {
      setError("Failed to load patient information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const handleScheduleAppointment = () => {
    toast.success("Redirecting to appointment scheduling...");
    navigate("/appointments");
  };

  const handleCheckIn = async () => {
    try {
      await visitService.create({
        patientId: patient.patientId,
        patientName: patient.name,
        department: "General Medicine",
        reason: "Walk-in visit",
        attendingDoctor: "Dr. Smith",
        diagnosis: "Pending",
        prescription: "Pending",
        billAmount: 0
      });
      toast.success("Patient checked in successfully!");
      loadPatientData();
    } catch (err) {
      toast.error("Failed to check in patient");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatientData} />;
  if (!patient) return <Error message="Patient not found" />;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'primary';
      case 'confirmed': return 'success';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getVisitStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'error';
      case 'in progress': return 'warning';
      case 'completed': return 'success';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate("/patients")}
            className="p-2"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Patient ID: {patient.patientId}</p>
          </div>
          <Badge variant={getStatusColor(patient.status)}>
            {patient.status}
          </Badge>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleScheduleAppointment} icon="Calendar">
            Schedule Appointment
          </Button>
          <Button onClick={handleCheckIn} variant="success" icon="UserCheck">
            Check In
          </Button>
        </div>
      </div>

      {/* Patient Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="User" size={20} className="text-primary" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Age</span>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <span className="text-gray-500">Gender</span>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <span className="text-gray-500">Blood Group</span>
                <p className="font-medium text-error">{patient.bloodGroup}</p>
              </div>
              <div>
                <span className="text-gray-500">Registration</span>
                <p className="font-medium">
                  {format(new Date(patient.registrationDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <span className="text-gray-500 text-sm">Phone</span>
              <p className="font-medium">{patient.phone}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Email</span>
              <p className="font-medium">{patient.email}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Address</span>
              <p className="font-medium text-sm">{patient.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Heart" size={20} className="text-primary" />
              <span>Medical Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-500 text-sm">Medical History</span>
              <p className="font-medium text-sm">
                {patient.medicalHistory || "No medical history recorded"}
              </p>
            </div>
            
            {patient.allergies && patient.allergies.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm">Allergies</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="warning" className="flex items-center space-x-1">
                      <ApperIcon name="AlertTriangle" size={12} />
                      <span>{allergy}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <span className="text-gray-500 text-sm">Total Visits</span>
              <p className="font-medium">{patient.totalVisits || 0}</p>
            </div>

            <div>
              <span className="text-gray-500 text-sm">Last Visit</span>
              <p className="font-medium">
                {patient.lastVisit 
                  ? format(new Date(patient.lastVisit), 'MMM dd, yyyy') 
                  : "No visits recorded"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Phone" size={20} className="text-primary" />
              <span>Emergency Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.emergencyContact ? (
              <>
                <div>
                  <span className="text-gray-500 text-sm">Name</span>
                  <p className="font-medium">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Relationship</span>
                  <p className="font-medium">{patient.emergencyContact.relation}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Phone</span>
                  <p className="font-medium">{patient.emergencyContact.phone}</p>
                </div>
                <Button variant="outline" className="w-full mt-4" icon="Phone">
                  Call Emergency Contact
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <ApperIcon name="Phone" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No emergency contact information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appointments and Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
              <span>Recent Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{appointment.reason}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                      </p>
                      <p className="text-xs text-gray-500">{appointment.doctorName}</p>
                    </div>
                    <Badge variant={getAppointmentStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visit History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Activity" size={20} className="text-primary" />
              <span>Visit History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visits.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No visits found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.slice(0, 5).map((visit) => (
                  <div key={visit.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{visit.reason}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(visit.checkInTime), 'MMM dd, yyyy HH:mm')}
                      </p>
                      <p className="text-xs text-gray-500">{visit.department}</p>
                      {visit.diagnosis && visit.diagnosis !== "Pending" && (
                        <p className="text-xs text-gray-700 mt-1">{visit.diagnosis}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={getVisitStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        ${visit.billAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetail;