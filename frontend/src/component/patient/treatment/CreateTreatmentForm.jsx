import * as patientService from "@/services/patientService";
import { useState } from "react";
export default function CreateTreatmentForm({ treatmentId }) {
  const patientTreatmentHistoryData =
    patientService.getPatientTreatmentHistory(treatmentId);
  const headerData = [
    "drug_name",
    "quantity",
    "unit",
    "price_per_unit",
    "sub_total",
    "",
  ];
  const [createdData, setCreatedData] = useState([]);
  function handleAddRowData() {
    setCreatedData([
      ...createdData,
      {
        drug_name: "",
        quantity: "",
        unit: "",
        price_per_unit: "",
        sub_total: "",
      },
    ]);
  }
  function removeRow(index) {
    const result = createdData;
    result.splice(index, 1);
    setCreatedData([...result]);
  }
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[10px] relative">
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
          {createdData.map((item, index) => (
            <tr>
              {headerData.map((keyItem) => {
                if (keyItem == "") {
                  return (
                    <td className="w-[30px] h-[10px">
                      <button
                        onClick={() => {
                          removeRow(index);
                        }}
                        className="bg-custom-blue text-white w-[50px] py-1"
                      >
                        -
                      </button>
                    </td>
                  );
                }
                return (
                  <td className="w-[30px] h-[10px">
                    <input className="w-full h-full" />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRowData} className="bg-custom-blue text-white w-[150px]">
        add drug +{" "}
      </button>
    </div>
  );
}
