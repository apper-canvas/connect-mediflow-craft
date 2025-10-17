import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import bedService from "@/services/api/bedService";
import visitService from "@/services/api/visitService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    availableBeds: 0,
    activeVisits: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patients, appointments, beds, visits] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        bedService.getAll(),
        visitService.getAll()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(apt => apt.date === today);
      const availableBeds = beds.filter(bed => bed.status === "Available");
      const activeVisits = visits.filter(visit => 
        visit.status === "In Progress" || visit.status === "Critical"
      );

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppts.length,
        availableBeds: availableBeds.length,
        activeVisits: activeVisits.length
      });

      setTodayAppointments(todayAppts.slice(0, 5));
      setRecentVisits(activeVisits.slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getAppointmentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'primary';
      case 'confirmed': return 'success';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getVisitStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'error';
      case 'in progress': return 'warning';
      default: return 'primary';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Hospital Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening at your hospital today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="Calendar"
          color="success"
          trend="up"
          trendValue="+12.1%"
        />
        <StatCard
          title="Available Beds"
          value={stats.availableBeds}
          icon="Bed"
          color="info"
          trend="neutral"
          trendValue="85% capacity"
        />
        <StatCard
          title="Active Visits"
          value={stats.activeVisits}
          icon="Activity"
          color="warning"
          trend="down"
          trendValue="-3.2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
              <span>Today's Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                        <p className="text-xs text-gray-500">{appointment.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getAppointmentStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Activity" size={20} className="text-primary" />
              <span>Active Patient Visits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentVisits.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active visits at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentVisits.map((visit) => (
                  <div key={visit.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        visit.status === 'Critical' ? 'bg-gradient-to-br from-error/10 to-red-100' : 'bg-gradient-to-br from-warning/10 to-yellow-100'
                      }`}>
                        <ApperIcon 
                          name={visit.status === 'Critical' ? 'AlertCircle' : 'Clock'} 
                          size={16} 
                          className={visit.status === 'Critical' ? 'text-error' : 'text-warning'} 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{visit.patientName}</p>
                        <p className="text-sm text-gray-600">{visit.department}</p>
                        <p className="text-xs text-gray-500">{visit.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getVisitStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(visit.checkInTime), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Zap" size={20} className="text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-lg hover:scale-105 transition-transform">
              <ApperIcon name="UserPlus" size={32} className="text-primary mb-2" />
              <span className="text-sm font-medium">Add Patient</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-success/5 to-accent/10 rounded-lg hover:scale-105 transition-transform">
              <ApperIcon name="Calendar" size={32} className="text-success mb-2" />
              <span className="text-sm font-medium">Schedule Appointment</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-warning/5 to-yellow-100 rounded-lg hover:scale-105 transition-transform">
              <ApperIcon name="Bed" size={32} className="text-warning mb-2" />
              <span className="text-sm font-medium">Manage Beds</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-info/5 to-blue-100 rounded-lg hover:scale-105 transition-transform">
              <ApperIcon name="FileText" size={32} className="text-info mb-2" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;