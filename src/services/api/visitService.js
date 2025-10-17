import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

class VisitService {
  constructor() {
    this.tableName = "visit_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "visit_id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "check_out_time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "attending_doctor_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "bill_amount_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching visits:", error?.response?.data?.message || error);
      toast.error("Failed to fetch visits");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "visit_id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "check_out_time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "attending_doctor_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "bill_amount_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching visit ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByPatientId(patientId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "visit_id_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "bill_amount_c"}},
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
      console.error("Error fetching visits by patient:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getActive() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "visit_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {"fieldName": "status_c", "operator": "EqualTo", "values": ["In Progress"]},
              {"fieldName": "status_c", "operator": "EqualTo", "values": ["Critical"]}
            ],
            "operator": "OR"
          }]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching active visits:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(visitData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          visit_id_c: visitData.visit_id_c,
          patient_id_c: visitData.patient_id_c,
          patient_name_c: visitData.patient_name_c,
          check_in_time_c: visitData.check_in_time_c || new Date().toISOString(),
          department_c: visitData.department_c,
          reason_c: visitData.reason_c,
          attending_doctor_c: visitData.attending_doctor_c,
          diagnosis_c: visitData.diagnosis_c,
          prescription_c: visitData.prescription_c,
          bill_amount_c: visitData.bill_amount_c,
          status_c: visitData.status_c || "In Progress"
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
          console.error(`Failed to create ${failed.length} visits:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Visit created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating visit:", error?.response?.data?.message || error);
      toast.error("Failed to create visit");
      return null;
    }
  }

  async checkOut(id, checkOutData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id),
        check_out_time_c: new Date().toISOString(),
        status_c: "Completed"
      };

      if (checkOutData.diagnosis_c !== undefined) updateData.diagnosis_c = checkOutData.diagnosis_c;
      if (checkOutData.prescription_c !== undefined) updateData.prescription_c = checkOutData.prescription_c;
      if (checkOutData.bill_amount_c !== undefined) updateData.bill_amount_c = checkOutData.bill_amount_c;

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
          console.error(`Failed to check out visit:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Visit checked out successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error checking out visit:", error?.response?.data?.message || error);
      toast.error("Failed to check out visit");
      return null;
    }
  }

  async update(id, visitData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      if (visitData.department_c !== undefined) updateData.department_c = visitData.department_c;
      if (visitData.reason_c !== undefined) updateData.reason_c = visitData.reason_c;
      if (visitData.attending_doctor_c !== undefined) updateData.attending_doctor_c = visitData.attending_doctor_c;
      if (visitData.diagnosis_c !== undefined) updateData.diagnosis_c = visitData.diagnosis_c;
      if (visitData.prescription_c !== undefined) updateData.prescription_c = visitData.prescription_c;
      if (visitData.bill_amount_c !== undefined) updateData.bill_amount_c = visitData.bill_amount_c;
      if (visitData.status_c !== undefined) updateData.status_c = visitData.status_c;
      if (visitData.check_out_time_c !== undefined) updateData.check_out_time_c = visitData.check_out_time_c;

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
          console.error(`Failed to update ${failed.length} visits:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Visit updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating visit:", error?.response?.data?.message || error);
      toast.error("Failed to update visit");
      return null;
    }
  }
}

export default new VisitService();