import bedsData from "@/services/mockData/beds.json";

class BedService {
  constructor() {
    this.beds = [...bedsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.beds];
  }

  async getById(id) {
    await this.delay(200);
    const bed = this.beds.find(b => b.Id === parseInt(id));
    return bed ? { ...bed } : null;
  }

  async getByWard(ward) {
    await this.delay(250);
    return this.beds.filter(bed => 
      bed.ward.toLowerCase() === ward.toLowerCase()
    );
  }

  async getAvailable() {
    await this.delay(200);
    return this.beds.filter(bed => 
      bed.status === "Available"
    );
  }

  async getOccupied() {
    await this.delay(200);
    return this.beds.filter(bed => 
      bed.status === "Occupied"
    );
  }

  async assignPatient(bedId, patientId, patientName, estimatedDischarge) {
    await this.delay(400);
    const index = this.beds.findIndex(b => b.Id === parseInt(bedId));
    if (index !== -1 && this.beds[index].status === "Available") {
      this.beds[index] = {
        ...this.beds[index],
        status: "Occupied",
        patientId,
        patientName,
        assignedDate: new Date().toISOString().split('T')[0],
        estimatedDischarge
      };
      return { ...this.beds[index] };
    }
    return null;
  }

  async dischargeBed(bedId) {
    await this.delay(400);
    const index = this.beds.findIndex(b => b.Id === parseInt(bedId));
    if (index !== -1) {
      this.beds[index] = {
        ...this.beds[index],
        status: "Available",
        patientId: null,
        patientName: null,
        assignedDate: null,
        estimatedDischarge: null
      };
      return { ...this.beds[index] };
    }
    return null;
  }

  async update(id, bedData) {
    await this.delay(400);
    const index = this.beds.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      this.beds[index] = { ...this.beds[index], ...bedData };
      return { ...this.beds[index] };
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new BedService();