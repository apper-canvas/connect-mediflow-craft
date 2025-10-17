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
patient_id_c: patient.patient_id_c,
        patient_name_c: patient.name_c,
        department_c: "General Medicine",
        reason_c: "Walk-in visit",
        attending_doctor_c: "Dr. Smith",
        diagnosis_c: "Pending",
        prescription_c: "Pending",
        bill_amount_c: 0
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
<h1 className="text-3xl font-bold text-gray-900">{patient.name_c}</h1>
            <p className="text-gray-600">Patient ID: {patient.patient_id_c}</p>
          </div>
<Badge variant={getStatusColor(patient.status_c)}>
            {patient.status_c}
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
<p className="font-medium">{patient.age_c} years</p>
              </div>
              <div>
                <span className="text-gray-500">Gender</span>
                <p className="font-medium">{patient.gender_c}</p>
              </div>
              <div>
                <span className="text-gray-500">Blood Group</span>
                <p className="font-medium text-error">{patient.blood_group_c}</p>
              </div>
              <div>
                <span className="text-gray-500">Registration</span>
                <p className="font-medium">
                  {format(new Date(patient.registration_date_c), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <span className="text-gray-500 text-sm">Phone</span>
<p className="font-medium">{patient.phone_c}</p>
            </div>
            
            <div>
<span className="text-gray-500 text-sm">Email</span>
              <p className="font-medium">{patient.email_c}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500 text-sm">Address</span>
              <p className="font-medium">{patient.address_c}</p>
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
{patient.medical_history_c || "No medical history recorded"}
              </p>
            </div>
            
{patient.allergies_c && (
              <div>
                <span className="text-gray-500 text-sm">Allergies</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.allergies_c.split(',').map((allergy, index) => (
                    <Badge key={index} variant="warning" className="flex items-center space-x-1">
                      <ApperIcon name="AlertTriangle" size={12} />
                      <span>{allergy.trim()}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <span className="text-gray-500 text-sm">Total Visits</span>
<p className="font-medium">{patient.total_visits_c || 0}</p>
            </div>

            <div>
              <span className="text-gray-500 text-sm">Last Visit</span>
<p className="font-medium">
                {patient.last_visit_c 
                  ? format(new Date(patient.last_visit_c), 'MMM dd, yyyy') 
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
{patient.emergency_contact_name_c ? (
              <>
                <div>
                  <span className="text-gray-500 text-sm">Name</span>
                  <p className="font-medium">{patient.emergency_contact_name_c}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Relationship</span>
                  <p className="font-medium">{patient.emergency_contact_relation_c}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Phone</span>
                  <p className="font-medium">{patient.emergency_contact_phone_c}</p>
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
                      <p className="font-medium text-sm">{appointment.reason_c}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(appointment.date_c), 'MMM dd, yyyy')} at {appointment.time_c}
                      </p>
                      <p className="text-xs text-gray-500">{appointment.doctor_name_c}</p>
                    </div>
                    <Badge variant={getAppointmentStatusColor(appointment.status_c)}>
                      {appointment.status_c}
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
                      <p className="font-medium text-sm">{visit.reason_c}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(visit.check_in_time_c), 'MMM dd, yyyy HH:mm')}
                      </p>
                      <p className="text-xs text-gray-500">{visit.department_c}</p>
                      {visit.diagnosis_c && visit.diagnosis_c !== "Pending" && (
                        <p className="text-xs text-gray-700 mt-1">{visit.diagnosis_c}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={getVisitStatusColor(visit.status_c)}>
                        {visit.status_c}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        ${visit.bill_amount_c?.toFixed(2) || '0.00'}
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