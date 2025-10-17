import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

class AppointmentService {
  constructor() {
    this.tableName = "appointment_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "appointment_id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "doctor_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "duration_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      toast.error("Failed to fetch appointments");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "appointment_id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "doctor_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "duration_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "appointment_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "doctor_name_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "EqualTo",
          "Values": [date]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by date:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByPatientId(patientId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "appointment_id_c"}},
          {"field": {"Name": "doctor_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "patient_id_c",
          "Operator": "EqualTo",
          "Values": [patientId]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by patient:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(appointmentData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          appointment_id_c: appointmentData.appointment_id_c,
          patient_id_c: appointmentData.patient_id_c,
          patient_name_c: appointmentData.patient_name_c,
          doctor_id_c: appointmentData.doctor_id_c,
          doctor_name_c: appointmentData.doctor_name_c,
          date_c: appointmentData.date_c,
          time_c: appointmentData.time_c,
          department_c: appointmentData.department_c,
          reason_c: appointmentData.reason_c,
          status_c: appointmentData.status_c || "Scheduled",
          notes_c: appointmentData.notes_c,
          duration_c: appointmentData.duration_c
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Appointment created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to create appointment");
      return null;
    }
  }

  async update(id, appointmentData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      if (appointmentData.patient_name_c !== undefined) updateData.patient_name_c = appointmentData.patient_name_c;
      if (appointmentData.doctor_name_c !== undefined) updateData.doctor_name_c = appointmentData.doctor_name_c;
      if (appointmentData.date_c !== undefined) updateData.date_c = appointmentData.date_c;
      if (appointmentData.time_c !== undefined) updateData.time_c = appointmentData.time_c;
      if (appointmentData.department_c !== undefined) updateData.department_c = appointmentData.department_c;
      if (appointmentData.reason_c !== undefined) updateData.reason_c = appointmentData.reason_c;
      if (appointmentData.status_c !== undefined) updateData.status_c = appointmentData.status_c;
      if (appointmentData.notes_c !== undefined) updateData.notes_c = appointmentData.notes_c;
      if (appointmentData.duration_c !== undefined) updateData.duration_c = appointmentData.duration_c;

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Appointment updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to update appointment");
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Appointment deleted successfully");
          return { success: true };
        }
      }

      return null;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      toast.error("Failed to delete appointment");
      return null;
    }
  }

  async updateStatus(id, status) {
    return this.update(id, { status_c: status });
  }
}

export default new AppointmentService();