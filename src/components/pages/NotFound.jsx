import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="AlertTriangle" size={48} className="text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back to safety.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full"
            icon="Home"
          >
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="w-full"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Navigation</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => navigate("/patients")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              Patients
            </button>
            <button
              onClick={() => navigate("/appointments")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              Appointments
            </button>
            <button
              onClick={() => navigate("/beds")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              Beds
            </button>
            <button
              onClick={() => navigate("/staff")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;