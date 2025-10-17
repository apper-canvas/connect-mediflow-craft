import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const PatientCard = ({ patient, onClick, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card className="hover:scale-105 cursor-pointer" onClick={() => onClick?.(patient)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{patient?.name || 'Unknown'}</h3>
              <p className="text-sm text-gray-500">{patient?.patientId || 'N/A'}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(patient?.status)}>
            {patient?.status || 'Unknown'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={16} className="text-gray-400" />
            <span className="text-gray-600">
              Age: {patient?.age || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Phone" size={16} className="text-gray-400" />
            <span className="text-gray-600">
              {patient?.phone || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Droplet" size={16} className="text-gray-400" />
            <span className="text-gray-600">
              {patient?.bloodGroup || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" size={16} className="text-gray-400" />
            <span className="text-gray-600">
              Last Visit: {patient?.lastVisit 
                ? format(new Date(patient.lastVisit), 'MMM dd, yyyy')
                : 'N/A'}
            </span>
          </div>
        </div>

        {patient?.allergies && patient.allergies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-gray-700">Allergies:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <Badge key={index} variant="warning" size="sm">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
            <button className="flex-1 text-xs py-2 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              View Details
            </button>
            <button className="flex-1 text-xs py-2 px-3 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors">
              Schedule
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientCard;