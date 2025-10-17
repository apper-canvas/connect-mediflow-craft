import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class DoctorService {
  constructor() {
    this.tableName = "doctor_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "current_patients_c"}},
          {"field": {"Name": "experience_c"}},
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
      console.error("Error fetching doctors:", error?.response?.data?.message || error);
      toast.error("Failed to fetch doctors");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "current_patients_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByDepartment(department) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "current_patients_c"}},
          {"field": {"Name": "experience_c"}}
        ],
        where: [{
          "FieldName": "department_c",
          "Operator": "EqualTo",
          "Values": [department]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching doctors by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAvailable() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "department_c"}},
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
      console.error("Error fetching available doctors:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(doctorData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          name_c: doctorData.name_c,
          doctor_id_c: doctorData.doctor_id_c,
          specialization_c: doctorData.specialization_c,
          department_c: doctorData.department_c,
          phone_c: doctorData.phone_c,
          email_c: doctorData.email_c,
          availability_c: doctorData.availability_c,
          current_patients_c: doctorData.current_patients_c || 0,
          experience_c: doctorData.experience_c,
          status_c: doctorData.status_c || "Available"
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
          console.error(`Failed to create ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Doctor created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating doctor:", error?.response?.data?.message || error);
      toast.error("Failed to create doctor");
      return null;
    }
  }

  async update(id, doctorData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      if (doctorData.name_c !== undefined) updateData.name_c = doctorData.name_c;
      if (doctorData.specialization_c !== undefined) updateData.specialization_c = doctorData.specialization_c;
      if (doctorData.department_c !== undefined) updateData.department_c = doctorData.department_c;
      if (doctorData.phone_c !== undefined) updateData.phone_c = doctorData.phone_c;
      if (doctorData.email_c !== undefined) updateData.email_c = doctorData.email_c;
      if (doctorData.availability_c !== undefined) updateData.availability_c = doctorData.availability_c;
      if (doctorData.current_patients_c !== undefined) updateData.current_patients_c = doctorData.current_patients_c;
      if (doctorData.experience_c !== undefined) updateData.experience_c = doctorData.experience_c;
      if (doctorData.status_c !== undefined) updateData.status_c = doctorData.status_c;

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
          console.error(`Failed to update ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Doctor updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating doctor:", error?.response?.data?.message || error);
      toast.error("Failed to update doctor");
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
          console.error(`Failed to delete ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Doctor deleted successfully");
          return { success: true };
        }
      }

      return null;
    } catch (error) {
      console.error("Error deleting doctor:", error?.response?.data?.message || error);
      toast.error("Failed to delete doctor");
      return null;
    }
  }
}

export default new DoctorService();
