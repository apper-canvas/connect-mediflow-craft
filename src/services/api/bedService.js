import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

class BedService {
  constructor() {
    this.tableName = "bed_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "bed_id_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "assigned_date_c"}},
          {"field": {"Name": "estimated_discharge_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching beds:", error?.response?.data?.message || error);
      toast.error("Failed to fetch beds");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "bed_id_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "assigned_date_c"}},
          {"field": {"Name": "estimated_discharge_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching bed ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByWard(ward) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "bed_id_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_name_c"}}
        ],
        where: [{
          "FieldName": "ward_c",
          "Operator": "EqualTo",
          "Values": [ward]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching beds by ward:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAvailable() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "bed_id_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": ["Available"]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching available beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getOccupied() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "bed_id_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": ["Occupied"]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching occupied beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async assignPatient(bedId, patientId, patientName, estimatedDischarge) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: parseInt(bedId),
          status_c: "Occupied",
          patient_id_c: patientId,
          patient_name_c: patientName,
          assigned_date_c: new Date().toISOString().split('T')[0],
          estimated_discharge_c: estimatedDischarge
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
          console.error(`Failed to assign patient to bed:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Patient assigned to bed successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error assigning patient to bed:", error?.response?.data?.message || error);
      toast.error("Failed to assign patient to bed");
      return null;
    }
  }

  async dischargeBed(bedId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: parseInt(bedId),
          status_c: "Available",
          patient_id_c: null,
          patient_name_c: null,
          assigned_date_c: null,
          estimated_discharge_c: null
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
          console.error(`Failed to discharge bed:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Bed discharged successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error discharging bed:", error?.response?.data?.message || error);
      toast.error("Failed to discharge bed");
      return null;
    }
  }

  async update(id, bedData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      if (bedData.number_c !== undefined) updateData.number_c = bedData.number_c;
      if (bedData.ward_c !== undefined) updateData.ward_c = bedData.ward_c;
      if (bedData.floor_c !== undefined) updateData.floor_c = bedData.floor_c;
      if (bedData.type_c !== undefined) updateData.type_c = bedData.type_c;
      if (bedData.status_c !== undefined) updateData.status_c = bedData.status_c;
      if (bedData.patient_id_c !== undefined) updateData.patient_id_c = bedData.patient_id_c;
      if (bedData.patient_name_c !== undefined) updateData.patient_name_c = bedData.patient_name_c;
      if (bedData.assigned_date_c !== undefined) updateData.assigned_date_c = bedData.assigned_date_c;
      if (bedData.estimated_discharge_c !== undefined) updateData.estimated_discharge_c = bedData.estimated_discharge_c;

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
          console.error(`Failed to update ${failed.length} beds:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Bed updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating bed:", error?.response?.data?.message || error);
      toast.error("Failed to update bed");
      return null;
    }
  }
}

export default new BedService();