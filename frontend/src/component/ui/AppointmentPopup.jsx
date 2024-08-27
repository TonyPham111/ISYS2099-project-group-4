import * as patientService from "@/services/patientService";
import * as staffService from "@/services/staffService";
import DataTable from "./DataTable";
import Editor from "./Editor";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import { useContext, useEffect, useState } from "react";
import { PopupContext } from "@/contexts/popupContext";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import PatientInfo from "@/pages/Hospital_management/Patient_management/PatientDetail/PatientInfo";
import fetcher from "@/utils/fetcher";
export default function AppointmentPopup({
  appointmentData,
  ableToCancel,
  ableToUpdate,
}) {
  const {isLoading, error, data:patientInfo} = useSWR(`http://localhost:8000/patients/${appointmentData.patient_id}`, fetcher);//data in here is patient data
  const location = useLocation();
  const { setIsPopup } = useContext(PopupContext);
  const [durningNote, setDuringNote] = useState(appointmentData.during_note);
  const [afterNote, setAfterNote] = useState(appointmentData.after_note);
  const timeIsPassed = Date.now() >= appointmentData.start;
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
  function handleUpdateAppointmentNote() {
    let condition = true;
    if (condition) {
      setIsPopup(false);
    }
  }

  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isLoading</div>;
  } else if (patientInfo) {
    console.log(`patient Info: ${JSON.stringify(patientInfo)}`)
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
            <p>{appointmentData.title}</p>
          </div>
          {/*-------doctor note-------*/}
          <h4>Doctor note:</h4>
          <div className="w-full flex justify-between gap-[10px]">
            {/** before note **/}
            <div className="w-1/3 ">
              <h5>Before note:</h5>
              <div
                className={`border-[1px] border-solid border-black h-[145px]`}
              >
                <Editor value={appointmentData.before_note} readOnly={true} />
              </div>
            </div>
            {/** before note **/}
            <div className="w-1/3 ">
              <h5>During note:</h5>
              <div
                className={
                  timeIsPassed || !ableToUpdate
                    ? `border-[1px] border-solid border-black  h-[145px]`
                    : ""
                }
              >
                <Editor
                  value={durningNote}
                  setValue={setDuringNote}
                  readOnly={!ableToUpdate || timeIsPassed}
                />
              </div>
            </div>
            {/** before note **/}
            <div className="w-1/3 ">
              <h5>After note:</h5>
              <div
                className={
                  timeIsPassed || !ableToUpdate
                    ? `border-[1px] border-solid border-black  h-[145px]`
                    : ""
                }
              >
                <Editor
                  value={afterNote}
                  setValue={setAfterNote}
                  readOnly={!ableToUpdate || timeIsPassed}
                />
              </div>
            </div>
          </div>
          {/*----------------------------*/}
        </div>
        {location.pathname == "/appointment" ||
        location.pathname == "/doctor-working-schedule" ? (
          <div className="w-full flex justify-center h-[7%] border-solid border-t-[1px] border-custom-dark-200 py-[5px]">
            {!timeIsPassed ? (
              ableToCancel ? (
                <button
                  onClick={handleCancelAppointment}
                  className="bg-red-700 text-white h-[40px] px-[40px]"
                >
                  Cancel
                </button>
              ) : //return cancel button if role can able to cancel
              ableToUpdate ? (
                //return update button if role can able to update

                <button
                  onClick={handleUpdateAppointmentNote}
                  className="bg-custom-blue text-white h-[40px] px-[40px]"
                >
                  update
                </button>
              ) : (
                <></>
              )
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
