import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction,
  icon = "Database"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={48} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;