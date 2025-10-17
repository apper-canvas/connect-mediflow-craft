import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-accent/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-100 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    available: "bg-gradient-to-r from-success/10 to-accent/10 text-success border border-success/20",
    occupied: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    pending: "bg-gradient-to-r from-warning/10 to-yellow-100 text-warning border border-warning/20"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;