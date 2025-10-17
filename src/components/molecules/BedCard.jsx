import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const BedCard = ({ bed, onClick }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'available';
      case 'occupied': return 'occupied';
      case 'reserved': return 'pending';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getBedIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'icu': return 'Monitor';
      case 'private': return 'Bed';
      default: return 'Bed';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'CheckCircle';
      case 'occupied': return 'User';
      case 'reserved': return 'Clock';
      case 'maintenance': return 'Tool';
      default: return 'Bed';
    }
  };

  return (
    <Card 
      className={`hover:scale-105 cursor-pointer ${
        bed.status === 'Available' ? 'border-success/30' : 
        bed.status === 'Occupied' ? 'border-error/30' : 
        'border-warning/30'
      }`} 
      onClick={() => onClick?.(bed)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              bed.status === 'Available' ? 'bg-gradient-to-br from-success/10 to-accent/20 text-success' :
              bed.status === 'Occupied' ? 'bg-gradient-to-br from-error/10 to-red-100 text-error' :
              'bg-gradient-to-br from-warning/10 to-yellow-100 text-warning'
            }`}>
              <ApperIcon name={getBedIcon(bed.type)} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bed {bed.number}</h3>
              <p className="text-sm text-gray-500">{bed.ward}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={getStatusColor(bed.status)}>
              <ApperIcon name={getStatusIcon(bed.status)} size={12} className="mr-1" />
              {bed.status}
            </Badge>
            <span className="text-xs text-gray-500">Floor {bed.floor}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Tag" size={16} className="text-gray-400" />
            <span className="text-gray-600">{bed.type} Bed</span>
          </div>

          {bed.status === 'Occupied' && bed.patientName && (
            <>
              <div className="flex items-center space-x-2">
                <ApperIcon name="User" size={16} className="text-gray-400" />
                <span className="text-gray-600">{bed.patientName}</span>
              </div>
              
              {bed.assignedDate && (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    Admitted: {format(new Date(bed.assignedDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}

              {bed.estimatedDischarge && (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CalendarCheck" size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    Est. Discharge: {format(new Date(bed.estimatedDischarge), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </>
          )}

          {bed.status === 'Reserved' && bed.patientName && (
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" size={16} className="text-gray-400" />
              <span className="text-gray-600">Reserved for {bed.patientName}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
          <button className="flex-1 text-xs py-2 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            View Details
          </button>
          {bed.status === 'Available' && (
            <button className="flex-1 text-xs py-2 px-3 bg-success text-white rounded-md hover:bg-success/90 transition-colors">
              Assign Patient
            </button>
          )}
          {bed.status === 'Occupied' && (
            <button className="flex-1 text-xs py-2 px-3 bg-warning text-white rounded-md hover:bg-warning/90 transition-colors">
              Discharge
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BedCard;