import * as data from "./sampleData";
export function getStaffs() {
  //sample data, waiting for real api
  return data.staffs;
}

export function getStaff(id) {
  const result = data.staffs.filter((item) => {
    return item.id == id;
  });
  return result[0];
}
export function getJob() {
  return data.job;
}

export function getStaffAppointments(staff_id, appointment_id) {
  const result = data.appointment.filter((item) => {
    return staff_id == item.doctor_id;
  });
  return result;
}
export function getAppointment(appointment_id) {
  const result = data.appointment.filter((item) => {
    return appointment_id == item.id;
  });
  return result[0];
}
export function getStaffSchedule(staff_id) {
  const result = data.workingTime.filter((item) => {
    return staff_id == item.staff_id;
  });
  return result;
}
