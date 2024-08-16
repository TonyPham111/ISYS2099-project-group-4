import * as patientService from "@/services/patientService";
import * as staffService from "@/services/staffService";
import DataTable from "./DataTable";
import Editor from "./Editor";
export default function AppointmentPopup({ patient_id, appointment_id }) {
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
  if (!patientInfo || !appointmentInfo) {
    return <></>;
  } else {
    return (
      <section className="w-full h-full p-5 flex flex-col gap-[15px]">
        <h3>Patient Info</h3>
        <DataTable
          headerData={headerData}
          data={[patientInfo]}
          hoverOnRow={false}
          handleOnClick={()=>{}}
        />
        <h3>Purpose of Appointment:</h3>
        <p>{appointmentInfo.purpose_of_appointment}</p>
        {/*-------doctor note-------*/}
        <h3>Doctor note:</h3>
        <section className="w-1/2">
            <div className="flex gap-[10px] items-center">
                <h5>Before note:</h5>
                <Editor value={appointmentInfo.before_note} readOnly={true} />
            </div>
            <div className="flex gap-[10px] items-center">
                <h5>During note:</h5>
                <Editor value={appointmentInfo.during_note} readOnly={true} />
            </div>
            <div className="flex gap-[10px] items-center">
                <h5>After note:</h5>
                <Editor value={appointmentInfo.after_note} readOnly={true} />
            </div>
        </section>
      </section>
    );
  }
}
