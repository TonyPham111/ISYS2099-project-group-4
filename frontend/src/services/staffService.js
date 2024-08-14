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
export function getJob(){
  return data.job;
}