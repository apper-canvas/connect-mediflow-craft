import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-primary/50",
    secondary: "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-primary/50",
    success: "bg-gradient-to-r from-success to-accent text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-success/50",
    error: "bg-gradient-to-r from-error to-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-error/50",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-primary/50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-sm min-h-[44px]",
    lg: "px-6 py-3 text-base min-h-[48px]"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;