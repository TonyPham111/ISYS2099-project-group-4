import dayjs from "dayjs";
import { useState } from "react";
import CustomDatePicker from "@/component/ui/CustomDatePicker";
import * as patientService from "@/services/patientService";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import CreateTreatmentButton from "@/component/patient/treatment/CreateTreatmentButton";
import DataTable from "@/component/ui/DataTable";
import Popup from "@/component/ui/Popup";
import TreatmentHistoryForm from "@/component/patient/treatment/TreatmentHistoryForm";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export default function PatientTreatmentHistory() {
  const [isPopup, setIsPopup] = useState(false);
  const [specificTreatmentData, setSpecificTreatmentData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const headerData = [
    "treatment_id",
    "date",
    "doctor_id",
  ];
  const { id } = useParams();
  const { data, isLoading, error } = useSWR(
    `http://localhost:8000/treatment-histories?patientId=${id}`,
    fetcher
  );
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setSpecificTreatmentData(item);
  }
  if (error) {
    return <div>errow when loading data</div>;
  } else if (isLoading) {
    return <div>is loading data</div>;
  }
  if (data) {
    return (
      <section className="w-full h-full flex flex-col gap-[15px]">
        {/*searching treatmentHistory and trigger new treatment*/}
        <div className="w-full flex justify-between">
          <div className="flex gap-[10px] items-center">
            <CustomDatePicker
              value={startTime}
              setValue={setStartTime}
              size={"sm"}
            />
            <CustomDatePicker
              value={endTime}
              setValue={setEndTime}
              size={"sm"}
            />
            <button className="h-[40px] bg-custom-blue text-white">
              search
            </button>
          </div>
          <PopupContextProvider>
            <CreateTreatmentButton />
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
            <TreatmentHistoryForm treatmentData={specificTreatmentData} />
          </Popup>
        </PopupContext.Provider>
      </section>
    );
  }
}
