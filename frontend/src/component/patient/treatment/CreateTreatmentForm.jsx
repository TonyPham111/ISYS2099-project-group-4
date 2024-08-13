import Editor from "@/component/ui/Editor";
import * as patientService from "@/services/patientService";
import { useState, useContext } from "react";
import { PopupContext } from "@/contexts/popupContext";

export default function CreateTreatmentForm({ treatmentId }) {
  const [createdData, setCreatedData] = useState([]);
  const [doctorNote, setDoctorNote] = useState(null);
  const { setIsPopup } = useContext(PopupContext);
  const headerData = ["drug_name", "quantity", "unit", "price_per_unit", ""];
  function handleAddRowData() {
    setCreatedData([
      ...createdData,
      {
        drug_name: null,
        quantity: null,
        unit: null,
        price_per_unit: null,
      },
    ]);
  }
  function removeRow(index) {
    const result = createdData;
    result.splice(index, 1);
    setCreatedData([...result]);
  }
  function handleInputOnChange(rowIndex, keyItem, value) {
    const result = createdData;
    result[rowIndex][keyItem] = value;
    setCreatedData(result);
  }
  function handleCreateTreatment() {
    let readToCreateTreatment = true;
    /*----check if it meet requirement to create new treatment ( not allow any blank input )*/
    if (createdData.length > 0) {
      for (let i = 0; i < createdData.length; ++i) {
        for (let j = 0; j < headerData.length; j++) {
          if (!createdData[i][headerData[i]]) {
            readToCreateTreatment = false;
          }
        }
      }
    } else {
      readToCreateTreatment = false;
    }
    if (readToCreateTreatment) {
      console.log(`check doctor note data: ${JSON.stringify(doctorNote)}`);
      setIsPopup(false);
    }
  }
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[10px] relative">
      <h2>Prescription</h2>
      <table className=" w-full">
        <thead className="h-[50px] bg-custom-dark-100 p-3">
          <tr>
            {headerData.map((item, index) => (
              <td key={index}>{item}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {createdData.map((item, rowIndex) => (
            <tr>
              {headerData.map((keyItem) => {
                if (keyItem == "") {
                  return (
                    <td className="w-[30px] h-[10px]">
                      <button
                        onClick={() => {
                          removeRow(rowIndex);
                        }}
                        className="bg-custom-blue text-white w-[50px] py-1"
                      >
                        -
                      </button>
                    </td>
                  );
                }
                return (
                  <td className="w-[30px] h-[10px]">
                    <input
                      onChange={(e) => {
                        handleInputOnChange(rowIndex, keyItem, e.target.value);
                      }}
                      className="w-full h-full"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRowData}
        className="bg-custom-blue text-white w-[150px]"
      >
        add drug +{" "}
      </button>
      <h3>Doctor note</h3>
      <div className="w-[50%]">
        <Editor value={doctorNote} setValue={setDoctorNote} />
      </div>
      <div className="w-[95%] mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center absolute bottom-[10px]">
        <button
          onClick={handleCreateTreatment}
          className="h-[50px] w-[250px] bg-custom-blue text-white"
        >
          Create treatment +
        </button>
      </div>
    </div>
  );
}
