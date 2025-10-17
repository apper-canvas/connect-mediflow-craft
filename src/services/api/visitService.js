import visitsData from "@/services/mockData/visits.json";

class VisitService {
  constructor() {
    this.visits = [...visitsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.visits];
  }

  async getById(id) {
    await this.delay(200);
    const visit = this.visits.find(v => v.Id === parseInt(id));
    return visit ? { ...visit } : null;
  }

  async getByPatientId(patientId) {
    await this.delay(250);
    return this.visits.filter(visit => 
      visit.patientId === patientId
    );
  }

  async getActive() {
    await this.delay(200);
    return this.visits.filter(visit => 
      visit.status === "In Progress" || visit.status === "Critical"
    );
  }

  async create(visitData) {
    await this.delay(500);
    const newId = Math.max(...this.visits.map(v => v.Id)) + 1;
    const newVisit = {
      ...visitData,
      Id: newId,
      visitId: `VIS${String(newId).padStart(3, '0')}`,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      status: "In Progress"
    };
    this.visits.push(newVisit);
    return { ...newVisit };
  }

  async checkOut(id, checkOutData) {
    await this.delay(400);
    const index = this.visits.findIndex(v => v.Id === parseInt(id));
    if (index !== -1) {
      this.visits[index] = {
        ...this.visits[index],
        ...checkOutData,
        checkOutTime: new Date().toISOString(),
        status: "Completed"
      };
      return { ...this.visits[index] };
    }
    return null;
  }

  async update(id, visitData) {
    await this.delay(400);
    const index = this.visits.findIndex(v => v.Id === parseInt(id));
    if (index !== -1) {
      this.visits[index] = { ...this.visits[index], ...visitData };
      return { ...this.visits[index] };
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new VisitService();