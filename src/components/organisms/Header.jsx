import React from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar 
              placeholder="Search patients, appointments..." 
              className="w-80"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
            </button>

            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar placeholder="Search patients, appointments..." />
      </div>
    </header>
  );
};

export default Header;