import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const AppointmentCard = ({ appointment, onClick }) => {
  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'scheduled': return 'primary';
      case 'confirmed': return 'success';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getDepartmentIcon = (department) => {
    if (!department) return 'Stethoscope';
    switch (department.toLowerCase()) {
      case 'cardiology': return 'Heart';
      case 'neurology': return 'Brain';
      case 'orthopedics': return 'Bone';
      case 'pulmonology': return 'Stethoscope';
      case 'endocrinology': return 'Activity';
      case 'psychiatry': return 'Brain';
      default: return 'Stethoscope';
    }
  };

  return (
    <Card className="hover:scale-105 cursor-pointer" onClick={() => onClick?.(appointment)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
              <ApperIcon name={getDepartmentIcon(appointment?.department_c || appointment?.department)} size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{appointment?.patient_name_c || appointment?.patientName || 'N/A'}</h3>
              <p className="text-sm text-gray-500">{appointment?.appointment_id_c || appointment?.appointmentId || 'N/A'}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(appointment?.status_c || appointment?.status)}>
            {appointment?.status_c || appointment?.status || 'Unknown'}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <ApperIcon name="User" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment?.doctor_name_c || appointment?.doctorName || 'N/A'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={16} className="text-gray-400" />
            <span className="text-gray-600">
              {appointment?.date_c ? format(new Date(appointment.date_c), 'MMM dd, yyyy') : 'N/A'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment?.time_c || appointment?.time || 'N/A'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment?.reason_c || appointment?.reason || 'N/A'}</span>
          </div>

          {appointment?.notes && (
            <div className="flex items-start space-x-2 pt-2 border-t border-gray-100">
              <ApperIcon name="FileText" size={16} className="text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;