import { useContext, useEffect, useState } from "react";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import Popup from "@/component/ui/Popup/Popup";
import TreatmentHistoryForm from "@/component/ui/Form/View/TreatmentHistoryForm";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import PopupButton from "@/component/ui/Button/PopupButton";
import CreateTreatmentForm from "@/component/ui/Form/Create/CreateTreatmentForm";
import { UserContext } from "@/contexts/userContext";
import dayjs from "dayjs";

export default function PatientTreatmentHistory() {
  const { userData } = useContext(UserContext);
  const [isPopup, setIsPopup] = useState(false);
  const [specificTreatmentData, setSpecificTreatmentData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const headerData = ["id", "start_date", "doctor_name"];
  const { id } = useParams();
  const { data, isLoading, error } = useSWR(
    `http://localhost:8000/prescriptions/${id}`,
    fetcher
  );
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setSpecificTreatmentData(item);
  }
  useEffect(() => {
    console.log(`check data: ${JSON.stringify(data)}`);
  }, [data]);
  function handleOnSearch() {
    if (startTime && endTime && startTime <= endTime) {
      let start = dayjs(startTime).format("YYYY-MM-DD");
      let end = dayjs(endTime).format('YYYY-MM-DD');
    }
  }
  if (error) {
    return <div>errow when loading data</div>;
  } else if (isLoading) {
    return <div>is loading data</div>;
  }
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
            <button
              onClick={handleOnSearch}
              className="h-[40px] bg-custom-blue text-white"
            >
              search
            </button>
          </div>
          {userData.job_role == "Doctor" && (
            <PopupContextProvider>
              <PopupButton
                PopupComponent={<CreateTreatmentForm />}
                text={"create treatment +"}
              />
            </PopupContextProvider>
          )}
        </div>
        <PopupContext.Provider value={{ isPopup, setIsPopup }}>
          <DataTable
            headerData={headerData}
            data={Array.isArray(data) ? data : [data]}
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
