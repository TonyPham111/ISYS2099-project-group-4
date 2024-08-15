import * as data from "./sampleData";
export function getPatients() {
  //sample data, waiting for real api
  return data.patient;
}

export function getPatient(id) {
  const result = data.patient.filter((item) => {
    return item.id == id;
  });
  return result[0];
}

export function getPatientTreatmentHistories() {
  return data.treatmentHistory;
}
export function getPatientTreatmentHistory(id) {
  const result = data.treatmentHistory.filter((item) => {
    return item.treatment_id == id;
  });
  return result[0];
}
