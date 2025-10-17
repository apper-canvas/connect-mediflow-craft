import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

class PatientService {
  constructor() {
    this.tableName = "patient_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relation_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "registration_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_visit_c"}},
          {"field": {"Name": "total_visits_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      toast.error("Failed to fetch patients");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relation_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "registration_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_visit_c"}},
          {"field": {"Name": "total_visits_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(patientData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          patient_id_c: patientData.patient_id_c,
          name_c: patientData.name_c,
          age_c: patientData.age_c,
          gender_c: patientData.gender_c,
          phone_c: patientData.phone_c,
          email_c: patientData.email_c,
          address_c: patientData.address_c,
          blood_group_c: patientData.blood_group_c,
          allergies_c: patientData.allergies_c,
          medical_history_c: patientData.medical_history_c,
          emergency_contact_name_c: patientData.emergency_contact_name_c,
          emergency_contact_relation_c: patientData.emergency_contact_relation_c,
          emergency_contact_phone_c: patientData.emergency_contact_phone_c,
          registration_date_c: patientData.registration_date_c || new Date().toISOString().split('T')[0],
          status_c: patientData.status_c || "Active",
          total_visits_c: patientData.total_visits_c || 0
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
          console.error(`Failed to create ${failed.length} patients:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Patient created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      toast.error("Failed to create patient");
      return null;
    }
  }

  async update(id, patientData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      if (patientData.name_c !== undefined) updateData.name_c = patientData.name_c;
      if (patientData.age_c !== undefined) updateData.age_c = patientData.age_c;
      if (patientData.gender_c !== undefined) updateData.gender_c = patientData.gender_c;
      if (patientData.phone_c !== undefined) updateData.phone_c = patientData.phone_c;
      if (patientData.email_c !== undefined) updateData.email_c = patientData.email_c;
      if (patientData.address_c !== undefined) updateData.address_c = patientData.address_c;
      if (patientData.blood_group_c !== undefined) updateData.blood_group_c = patientData.blood_group_c;
      if (patientData.allergies_c !== undefined) updateData.allergies_c = patientData.allergies_c;
      if (patientData.medical_history_c !== undefined) updateData.medical_history_c = patientData.medical_history_c;
      if (patientData.emergency_contact_name_c !== undefined) updateData.emergency_contact_name_c = patientData.emergency_contact_name_c;
      if (patientData.emergency_contact_relation_c !== undefined) updateData.emergency_contact_relation_c = patientData.emergency_contact_relation_c;
      if (patientData.emergency_contact_phone_c !== undefined) updateData.emergency_contact_phone_c = patientData.emergency_contact_phone_c;
      if (patientData.status_c !== undefined) updateData.status_c = patientData.status_c;
      if (patientData.last_visit_c !== undefined) updateData.last_visit_c = patientData.last_visit_c;
      if (patientData.total_visits_c !== undefined) updateData.total_visits_c = patientData.total_visits_c;

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
          console.error(`Failed to update ${failed.length} patients:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Patient updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      toast.error("Failed to update patient");
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
          console.error(`Failed to delete ${failed.length} patients:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Patient deleted successfully");
          return { success: true };
        }
      }

      return null;
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      toast.error("Failed to delete patient");
      return null;
    }
  }

  async search(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registration_date_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "patient_id_c", "operator": "Contains", "values": [query]},
                {"fieldName": "phone_c", "operator": "Contains", "values": [query]},
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PatientService();