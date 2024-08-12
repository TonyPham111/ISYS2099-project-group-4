import * as patientService from "@/services/patientService";
import { useState } from "react";
export default function TreatmentHistoryForm({treatmentId}){
    const patientTreatmentHistoryData = patientService.getPatientTreatmentHistory(treatmentId);
    const headerData = ["drug_name", "quantity", "unit", "price_per_unit", "sub_total", ""];
    const [createdData, setCreatedData] = useState(null);
    function handleAddRowData(){

    }
    return(
        <div className="w-full h-full p-5 relative">
            <h2>Medical bill</h2>
            <table className=" w-full">
          <thead className="h-[50px] bg-custom-dark-100 p-3">
            <tr>
              {headerData.map((item, index) => (
                <td key={index}>{item}</td>
              ))}
            </tr>
          </thead>
          <tbody>

          </tbody>
          <button onClick={handleAddRowData} className="bg-custom-blue text-white">add drug + </button>
        </table>
        </div>
    );
}