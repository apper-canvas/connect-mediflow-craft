import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  onClick 
}) => {
  const colorClasses = {
    primary: "from-primary/10 to-secondary/20 text-primary",
    success: "from-success/10 to-accent/20 text-success",
    warning: "from-warning/10 to-yellow-100 text-warning",
    error: "from-error/10 to-red-100 text-error",
    info: "from-info/10 to-blue-100 text-info"
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <Card 
      className={`transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  size={16} 
                  className={trendColors[trend]} 
                />
                <span className={`text-sm font-medium ${trendColors[trend]}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;