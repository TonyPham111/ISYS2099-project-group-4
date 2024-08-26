import dayjs from "dayjs";
import { useState } from "react";
import CustomDatePicker from "@/component/ui/CustomDateTimePicker";
import * as patientService from "@/services/patientService";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import CreateTreatmentButton from "@/component/patient/treatment/CreateTreatmentButton";
import DataTable from "@/component/ui/DataTable";
import Popup from "@/component/ui/Popup";
import TreatmentHistoryForm from "@/component/patient/treatment/TreatmentHistoryForm";

export default function PatientTreatmentHistory() {
  const [isPopup, setIsPopup] = useState(false);
  const [treatmentId, setTreatmentId] = useState(null);
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
    function handleOnClickRowData(item, rowIndex) {
      setIsPopup(true);
      setTreatmentId(item.treatment_id);
    }
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
      <PopupContext.Provider value={{ isPopup, setIsPopup }}>
        <DataTable
          headerData={headerData}
          data={patientTreatmentHistoriesData}
          hoverOnRow={true}
          handleOnClick={handleOnClickRowData}
        />
        <Popup>
          <TreatmentHistoryForm treatmentId={treatmentId} />
        </Popup>
      </PopupContext.Provider>
    </section>
  );
}