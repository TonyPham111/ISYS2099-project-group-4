import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { PopupContext } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import TreatmentHistoryForm from "@/component/ui/Form/View/TreatmentHistoryForm";
import { useState } from "react";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import Popup from "@/component/ui/Popup/Popup";
export default function ReportTreatmentHistory() {
  const [isPopup, setIsPopup] = useState(false);
  const [specificTreatmentData, setSpecificTreatmentData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [chosenPatient, setChosenPatient] = useState(null);
  const headerData = ["treatment_id", "date", "doctor_id", "patient_id"];
  const [url, setUrl] = useState(`http://localhost:8000/treatment-histories`);
  const { data: treatmentData } = useSWR(url, fetcher);
  const { data: patientData } = useSWR("http://localhost:8000/patients");
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setSpecificTreatmentData(item);
  }
  function handleOnSearch() {
    if (chosenPatient && chosenPatient.id !== 0) {
      setUrl(`http://localhost:8000/treatment-histories?patientId=${chosenPatient.id}`);
    }else if(chosenPatient && chosenPatient.id ==0 ){
      setUrl(`http://localhost:8000/treatment-histories`);
    }
  }
  if (!treatmentData) {
    return <></>;
  }
  return (
    <section className="w-full h-full flex flex-col gap-[15px]">
      {/*searching treatmentHistory and trigger new treatment*/}

      <div className="w-full flex justify-between">
        <div className="flex gap-[10px] items-center">
          <CustomAutoComplete
          value={chosenPatient}
            options={[
              { id: 0, first_name: "ALL", last_name: "" },
              ...patientData,
            ]}
            onChange={(event, value) => {
              setChosenPatient(value);
            }}
            getOptionLabel={(option) => {
              return `#${option.id}: ${option.first_name} ${option.last_name} `;
            }}
            label={"choose patient"}
            size={"md"}
          />
          <CustomDatePicker
            value={startTime}
            setValue={setStartTime}
            size={"sm"}
          />
          <CustomDatePicker value={endTime} setValue={setEndTime} size={"sm"} />
          <button
            onClick={handleOnSearch}
            className="h-[40px] bg-custom-blue text-white"
          >
            search
          </button>
        </div>
      </div>
      <PopupContext.Provider value={{ isPopup, setIsPopup }}>
        <DataTable
          headerData={headerData}
          data={treatmentData?treatmentData:[]}
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
