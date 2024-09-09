import Editor from "@/component/ui/Editor/Editor";
import * as patientService from "@/services/patientService";
import { useState } from "react";
import DataTable from "../../Table/DataTable";
export default function TreatmentHistoryForm({ treatmentData }) {
  const headerData = [
    "drug_name",
    "quantity",
    "unit",
    "price_per_unit",
  ];
  function handleOnClick(item, index){

  }
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[30px] relative">
      <h3>Prescription</h3>
      <div className="w-full  overflow-scroll rounded-xl">
       <DataTable headerData={headerData} data={treatmentData.drugs} handleOnClick={handleOnClick} hoverOnRow={false}/> 
      </div>
      <div>
        <h3>Doctor Note</h3>
        <Editor
          value={treatmentData.doctor_note? treatmentData.doctor_note: "doctor don't have note"}
          readOnly={true}
        />
      </div>
    </div>
  );
}
