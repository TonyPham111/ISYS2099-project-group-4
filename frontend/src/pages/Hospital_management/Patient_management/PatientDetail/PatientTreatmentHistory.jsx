import CustomDatePicker from "@/component/ui/CustomDateTimePicker";
import DataTreatmentTable from "@/component/patient/treatment/DataTreamentTable";
import dayjs from "dayjs";
import { useState } from "react";
import * as patientService from "@/services/patientService";
import { PopupContextProvider } from "@/contexts/popupContext";
import CreateTreatmentButton from "@/component/patient/treatment/CreateTreatmentButton";
export default function PatientTreatmentHistory() {
  const [startTime, setStartTime] = useState(dayjs(Date.now()));
  const [endTime, setEndTime] = useState(dayjs(Date.now()));
  const headerData = [
    "treatment_id",
    "date",
    "start_time",
    "end_time",
    "doctor_id",
  ];
  const patientTreatmentHistoriesData =
    patientService.getPatientTreatmentHistories();
  return (
    <section className="w-full h-full flex flex-col gap-[15px]">
      {/*searching treatmentHistory and trigger new treatment*/}
      <div className="w-full flex justify-between">
        <div className="flex gap-[10px]">
          <CustomDatePicker value={startTime} setValue={setStartTime} />
          <CustomDatePicker value={endTime} setValue={setEndTime} />
          <button className="h-[40px] bg-custom-blue text-white">search</button>
        </div>
        <PopupContextProvider>
          <CreateTreatmentButton />
        </PopupContextProvider>
      </div>
      <PopupContextProvider>
        <DataTreatmentTable
          headerData={headerData}
          data={patientTreatmentHistoriesData}
        />
      </PopupContextProvider>
    </section>
  );
}
