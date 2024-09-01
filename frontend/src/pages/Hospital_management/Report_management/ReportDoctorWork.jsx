import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { PopupContext } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import TreatmentHistoryForm from "@/component/ui/Form/View/TreatmentHistoryForm";
import { useEffect, useState } from "react";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import Popup from "@/component/ui/Popup/Popup";
import AppointmentPopup from "@/component/ui/Popup/AppointmentPopup";
export default function ReportDoctorWork() {
  const [isPopup, setIsPopup] = useState(false);
  const [specificAppointmentData, setSpecificAppointmentData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [chosenDoctor, setChosenDoctor] = useState(null);
  const headerData = ["id", "purpose_of_appointment", "doctor_id", "patient_id", "date", "start_time", "end_time"];
  const [url, setUrl] = useState(`http://localhost:8000/appointments`);
  const { data: appointmentData } = useSWR(url, fetcher);
  const { data: doctorData } = useSWR(`http://localhost:8000/staffs?job_role=Doctor`, fetcher);
  useEffect(()=>{
    console.log(`doctorData: ${doctorData}`);
  },[doctorData]);
  function handleOnClickRowData(item, rowIndex) {
    setIsPopup(true);
    setSpecificAppointmentData(item);
  }
  function handleOnSearch() {
    console.log(`check chosen Doctor data: ${JSON.stringify(chosenDoctor)}`);
    if (chosenDoctor && chosenDoctor.id !== 0) {
      setUrl(
        `http://localhost:8000/appointments?doctorId=${chosenDoctor.id}`
      );
    } else if (chosenDoctor && chosenDoctor.id == 0) {
      setUrl(`http://localhost:8000/appointments`);
    }
  }
  if (!doctorData) {
    return <></>;
  }
  return (
    <section className="w-full h-full flex flex-col gap-[15px]">
      {/*searching treatmentHistory and trigger new treatment*/}

      <div className="w-full flex justify-between">
        <div className="flex gap-[10px] items-center">
          <CustomAutoComplete
            value={chosenDoctor}
            options={[
              { id: 0, first_name: "ALL", last_name: "" },
              ...doctorData,
            ]}
            onChange={(event, value) => {
              setChosenDoctor(value);
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
          data={appointmentData?appointmentData:[]}
          hoverOnRow={true}
          handleOnClick={handleOnClickRowData}
        />
        <Popup>
          <AppointmentPopup appointmentData={specificAppointmentData} />
        </Popup>
      </PopupContext.Provider>
    </section>
  );
}
