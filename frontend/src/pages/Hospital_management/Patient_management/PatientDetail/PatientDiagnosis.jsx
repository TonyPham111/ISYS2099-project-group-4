import { useState, useContext } from "react";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import Popup from "@/component/ui/Popup/Popup";
import DiagnosisForm from "@/component/ui/Form/View/DiagnosisForm";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useParams } from "react-router-dom";
import PopupButton from "@/component/ui/Button/PopupButton";
import CreateDiagnosisForm from "@/component/ui/Form/Create/CreateDiagnosisForm";
import { UserContext } from "@/contexts/userContext";
export default function PatientDiagnosis() {
  const { userData } = useContext(UserContext);
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
        <div className="w-full flex justify-end">
          {userData.job_role == "Doctor" && (
            <PopupContextProvider>
              <PopupButton
                PopupComponent={<CreateDiagnosisForm />}
                text={"create new diagnosis + "}
              />
            </PopupContextProvider>
          )}
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
