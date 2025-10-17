import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-error" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={20} className="mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;