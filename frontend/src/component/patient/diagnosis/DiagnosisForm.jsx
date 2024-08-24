import Editor from "@/component/ui/Editor";
import * as patientService from "@/services/patientService";
import { useState } from "react";
import DataTable from "../../ui/DataTable";
export default function DiagnosisForm({ diagnosisId }) {
  let patientDiagnosisData = patientService.getPatientDiagnosis();
  const condition = patientDiagnosisData.condition;
  const diagnosisNote = patientDiagnosisData.diagnosis_note;
  const headerData = ["code", "name", "description"];
  function handleOnClick(item, index) {}
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[30px] relative">
      <h3>Condition</h3>
      <div className="w-full  overflow-scroll rounded-xl">
        <DataTable
          headerData={headerData}
          data={condition}
          handleOnClick={handleOnClick}
          hoverOnRow={false}
        />
      </div>
      <div>
        <h3>Diagnosis Note</h3>
        <Editor
          value={diagnosisNote ? diagnosisNote : "doctor don't have note"}
          readOnly={true}
        />
      </div>
      {patientDiagnosisData.diagnosis_image.length > 0 && (
        <div>
          <h3>Diagnosis Image</h3>
        </div>
      )}
    </div>
  );
}
