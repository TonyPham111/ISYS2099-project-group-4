import * as patientService from "@/services/patientService";
import * as staffService from "@/services/staffService";
import DataTable from "./DataTable";
import Editor from "./Editor";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import { useContext } from "react";
import { PopupContext } from "@/contexts/popupContext";
import { useLocation } from "react-router-dom";
export default function AppointmentPopup({
  patient_id,
  appointment_id,
  ableToCancel,
}) {
  const location = useLocation();
  const { setIsPopup } = useContext(PopupContext);
  const patientInfo = patientService.getPatient(patient_id);
  const appointmentInfo = staffService.getAppointment(appointment_id);
  const headerData = [
    "id",
    "first_name",
    "last_name",
    "gender",
    "birth_date",
    "contact_phone_number",
    "home_address",
  ];

  function handleCancelAppointment() {
    let condition = true;
    if (condition) {
      setIsPopup(false);
    }
  }

  if (!patientInfo || !appointmentInfo) {
    return <></>;
  } else {
    return (
      <section className="w-full h-full p-5 flex flex-col gap-[30px]">
        <div className="h-[95%] flex flex-col gap-[15px]">
          <h3>Patient Info</h3>
          <DataTable
            headerData={headerData}
            data={[patientInfo]}
            hoverOnRow={false}
            handleOnClick={() => {}}
          />
          <div className="flex flex-col gap-[10px]">
            <h4>Purpose of Appointment:</h4>
            <p>{appointmentInfo.purpose_of_appointment}</p>
          </div>
          {/*-------doctor note-------*/}
          <h4>Doctor note:</h4>
          <div className="w-1/2">
            <div className="flex  gap-[10px]">
              <h5 className="pt-[10px]">Before note:</h5>
              <Editor value={appointmentInfo.before_note} readOnly={true} />
            </div>
            <div className="flex  gap-[10px]">
              <h5 className="pt-[10px]">During note:</h5>
              <Editor value={appointmentInfo.during_note} readOnly={true} />
            </div>
            <div className="flex gap-[10px]">
              <h5 className="pt-[10px]">After note:</h5>
              <Editor value={appointmentInfo.after_note} readOnly={true} />
            </div>
          </div>
          {/*----------------------------*/}
        </div>
        {location.pathname == "/appointment" ? (
          <div className="w-full flex justify-center h-[7%] border-solid border-t-[1px] border-custom-dark-200 py-[5px]">
            {Date.now() <
            convertStringFormatToDate(
              appointmentInfo.date,
              appointmentInfo.start_time
            ) ? (
              <button
                onClick={handleCancelAppointment}
                className="bg-red-700 text-white h-[40px] px-[40px]"
              >
                Cancel
              </button>
            ) : (
              <h4 className="text-custom-dark-200">
                {" "}
                appointment already done{" "}
              </h4>
            )}
          </div>
        ) : (
          <></>
        )}
      </section>
    );
  }
}
