import { useState } from "react";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/DataTable";
import Popup from "@/component/ui/Popup";
import CreateDiagnosisButton from "@/component/patient/diagnosis/CreateDiagnosisButton";
import DiagnosisForm from "@/component/patient/diagnosis/DiagnosisForm";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useParams } from "react-router-dom";
export default function PatientDiagnosis() {
  const [isPopup, setIsPopup] = useState(false);
  const [specificDiagnosisData, setSpecificDiagnosisData] = useState(null);
  const headerData = ["diagnosis_id", "doctor_id", "diagnosis_date"];
  const { id } = useParams();
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/patients/${id}/diagnosis`,
    fetcher
  );
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setSpecificDiagnosisData(item);
  }
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>is loading data</div>;
  }
  if (data) {
    return (
      <section className="w-full h-full flex flex-col gap-[15px]">
        {/*searching treatmentHistory and trigger new treatment*/}
        <div className="w-full flex justify-end">
          <PopupContextProvider>
            <CreateDiagnosisButton />
          </PopupContextProvider>
        </div>
        <PopupContext.Provider value={{ isPopup, setIsPopup }}>
          <DataTable
            headerData={headerData}
            data={data}
            hoverOnRow={true}
            handleOnClick={handleOnClickRowData}
          />
          <Popup>
            <DiagnosisForm diagnosisData={specificDiagnosisData} />
          </Popup>
        </PopupContext.Provider>
      </section>
    );
  }
}
