import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "BarChart3" },
    { path: "/patients", label: "Patients", icon: "Users" },
    { path: "/appointments", label: "Appointments", icon: "Calendar" },
    { path: "/beds", label: "Beds", icon: "Bed" },
    { path: "/staff", label: "Staff", icon: "UserCheck" }
  ];

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MediFlow
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActivePath(item.path)
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              <ApperIcon name={item.icon} size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-success/20 to-accent/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" size={16} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">System Status</p>
              <p className="text-xs text-success">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MediFlow
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActivePath(item.path)
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              <ApperIcon name={item.icon} size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-success/20 to-accent/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" size={16} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">System Status</p>
              <p className="text-xs text-success">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;