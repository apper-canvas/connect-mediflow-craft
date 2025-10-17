import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AppointmentCard = ({ appointment, onClick }) => {
  const getStatusColor = (status) => {
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
              <ApperIcon name={getDepartmentIcon(appointment.department)} size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
              <p className="text-sm text-gray-500">{appointment.appointmentId}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <ApperIcon name="User" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment.doctorName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment.time}</span>
          </div>

          <div className="flex items-center space-x-2">
            <ApperIcon name="Building2" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment.department}</span>
          </div>

          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" size={16} className="text-gray-400" />
            <span className="text-gray-600">{appointment.reason}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
          <button className="flex-1 text-xs py-2 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            View Details
          </button>
          {appointment.status === 'Scheduled' && (
            <button className="flex-1 text-xs py-2 px-3 bg-success text-white rounded-md hover:bg-success/90 transition-colors">
              Confirm
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;