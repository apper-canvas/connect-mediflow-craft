import doctorsData from "@/services/mockData/doctors.json";

class DoctorService {
  constructor() {
    this.doctors = [...doctorsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.doctors];
  }

  async getById(id) {
    await this.delay(200);
    const doctor = this.doctors.find(d => d.Id === parseInt(id));
    return doctor ? { ...doctor } : null;
  }

  async getByDepartment(department) {
    await this.delay(250);
    return this.doctors.filter(doctor => 
      doctor.department.toLowerCase() === department.toLowerCase()
    );
  }

  async getAvailable() {
    await this.delay(200);
    return this.doctors.filter(doctor => 
      doctor.status === "Available"
    );
  }

  async create(doctorData) {
    await this.delay(500);
    const newId = Math.max(...this.doctors.map(d => d.Id)) + 1;
    const newDoctor = {
      ...doctorData,
      Id: newId,
      doctorId: `DOC${String(newId).padStart(3, '0')}`,
      currentPatients: 0,
      status: "Available"
    };
    this.doctors.push(newDoctor);
    return { ...newDoctor };
  }

  async update(id, doctorData) {
    await this.delay(400);
    const index = this.doctors.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      this.doctors[index] = { ...this.doctors[index], ...doctorData };
      return { ...this.doctors[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(300);
    const index = this.doctors.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.doctors.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DoctorService();