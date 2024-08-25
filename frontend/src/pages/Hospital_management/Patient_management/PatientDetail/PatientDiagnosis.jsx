import dayjs from "dayjs";
import { useState } from "react";
import CustomDatePicker from "@/component/ui/CustomDateTimePicker";
import * as patientService from "@/services/patientService";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/DataTable";
import Popup from "@/component/ui/Popup";
import CreateDiagnosisButton from "@/component/patient/diagnosis/CreateDiagnosisButton";
import DiagnosisForm from "@/component/patient/diagnosis/DiagnosisForm";

export default function PatientDiagnosis() {
  const [isPopup, setIsPopup] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState(null);
  const headerData = ["diagnosis_id", "doctor_id", "diagnosis_date"];
  const patientDiagnosisData = patientService.getPatientDiagnoses();
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setDiagnosisId(item.id);
  }
  return (
    <section className="w-full h-full flex flex-col gap-[15px]">
      {/*searching treatmentHistory and trigger new treatment*/}
      <div className="w-full flex justify-end">
        <PopupContextProvider>
          <CreateDiagnosisButton/>
        </PopupContextProvider>
      </div>
      <PopupContext.Provider value={{ isPopup, setIsPopup }}>
        <DataTable
          headerData={headerData}
          data={patientDiagnosisData}
          hoverOnRow={true}
          handleOnClick={handleOnClickRowData}
        />
        <Popup>
            <DiagnosisForm diagnosisId={diagnosisId}/>
        </Popup>
      </PopupContext.Provider>
    </section>
  );
}
