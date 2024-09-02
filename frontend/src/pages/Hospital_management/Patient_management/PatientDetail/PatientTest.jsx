import PopupButton from "@/component/ui/Button/PopupButton";
import Popup from "@/component/ui/Popup/Popup";
import { PopupContext } from "@/contexts/popupContext";
import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import { useContext, useState } from "react";
import { UserContext } from "@/contexts/userContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useParams } from "react-router-dom";
import TestingForm from "@/component/ui/Form/View/TestingForm";
import CreateOrderTestingForm from "@/component/ui/Form/Create/CreateOrderTestingForm";
export default function PatientTest() {
  const [isPopup, setIsPopup] = useState(false);
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const { data: testingData } = useSWR(
    `http://localhost:8000/patients/${id}/testings`,
    fetcher
  );
  const [specificTestingData, setSpecificTestingData] = useState(null);
  const headerData = [
    "test_id",
    "ordering_date",
    "ordering_doctor",
    "test_name",
    "administrating_nurse",
    "administrating_date",
    "administrating_time",
  ];
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setSpecificTestingData(item);
  }  if (!testingData) {
    return <></>;
  }
  return (
    <section className="w-full h-full flex flex-col gap-[15px]">
      {/*searching treatmentHistory and trigger new treatment*/}
      <div className="w-full flex justify-end">
        {userData.job_role == "Doctor" && (
          <PopupContextProvider>
            <PopupButton
              PopupComponent={<CreateOrderTestingForm/>}
              text={"ordering test + "}
            />
          </PopupContextProvider>
        )}
      </div>
      <PopupContext.Provider value={{ isPopup, setIsPopup }}>
        <DataTable
          headerData={headerData}
          data={testingData}
          hoverOnRow={true}
          handleOnClick={handleOnClickRowData}
        />
        <Popup>
            <TestingForm testingData={specificTestingData}/>          
        </Popup>
      </PopupContext.Provider>
    </section>
  );
}
