import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay(200);
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    return appointment ? { ...appointment } : null;
  }

  async getByDate(date) {
    await this.delay(250);
    return this.appointments.filter(appointment => 
      appointment.date === date
    );
  }

  async getByPatientId(patientId) {
    await this.delay(250);
    return this.appointments.filter(appointment => 
      appointment.patientId === patientId
    );
  }

  async create(appointmentData) {
    await this.delay(500);
    const newId = Math.max(...this.appointments.map(a => a.Id)) + 1;
    const newAppointment = {
      ...appointmentData,
      Id: newId,
      appointmentId: `APT${String(newId).padStart(3, '0')}`,
      status: "Scheduled"
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay(400);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...appointmentData };
      return { ...this.appointments[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(300);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.appointments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async updateStatus(id, status) {
    await this.delay(200);
    return this.update(id, { status });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppointmentService();