import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg w-32"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;