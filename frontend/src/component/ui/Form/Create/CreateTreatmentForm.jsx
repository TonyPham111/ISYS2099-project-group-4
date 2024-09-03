import Editor from "@/component/ui/Editor/Editor";
import * as patientService from "@/services/patientService";
import { useState, useContext } from "react";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateTreatmentForm({ treatmentId }) {
  const { id } = useParams();
  const [createdData, setCreatedData] = useState([]);
  const [diagnosisId, setDiagnosisId] = useState(null);
  const [doctorNote, setDoctorNote] = useState(null);
  const { setIsPopup } = useContext(PopupContext);
  const headerData = ["drug_name", "quantity", "unit", "price_per_unit", ""];
  const { data: drugData } = useSWR("http://localhost:8000/drugs", fetcher);
  const { data: diagnosisData } = useSWR(
    `http://localhost:8000/patients/${id}/diagnosis`,
    fetcher
  );
  function handleCreateTreatment() {
    let readToCreateTreatment = true;
    let quantityIsNegativeOrZero = false;
    if (!diagnosisId) {
      readToCreateTreatment = false;
    }
    /*----check if it meet requirement to create new treatment ( not allow any blank input )*/
    if (createdData.length > 0) {
      for (let i = 0; i < createdData.length; ++i) {
        if (createdData[i]["quantity"] <= 0) {
          quantityIsNegativeOrZero = true;
        }
        if (!createdData[i]["drug_name"]) {
          readToCreateTreatment = false;
        }
      }
    } else {
      readToCreateTreatment = false;
    }
    if (readToCreateTreatment) {
      toast.success("create treatment for this patient is success!");
      setIsPopup(false);
    } else {
      if (createdData.length == 0) {
        toast.error("must have at least 1 drug!");
      } else if (!diagnosisId) {
        toast.error("please link treatment with diagnosis!");
      } 
      else if(quantityIsNegativeOrZero){
        toast.error('quantity negative is not allowed for all field!');
      }
      else {
        toast.error("please ensure all drug field is not blank!");
      }
    }
  }
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[10px] relative">
      <div className="w-full h-[90%] overflow-scroll">
        <h2>Prescription</h2>
        <CreateTreatmentTable
          headerData={headerData}
          data={createdData}
          setData={setCreatedData}
          drugData={drugData}
        />
        <h3>Connect with diagnosis</h3>
        <CustomAutoComplete
          options={diagnosisData ? diagnosisData : []}
          onChange={(event, value) => {
            setDiagnosisId(Number(value?.diagnosis_id));
          }}
          getOptionLabel={(option) => {
            return `Id: ${option.diagnosis_id}, Date: ${
              option.diagnosis_date
            }, Condition: ${option.condition.map((item) => {
              return item.name;
            })} `;
          }}
          label={"search by diagnosis or code ..."}
          size={"full"}
        />
        <h3>Doctor note</h3>
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

export function CreateTreatmentTable({ headerData, data, setData, drugData }) {
  /*-----------main function ----------*/
  function handleAddRowData() {
    setData([
      ...data,
      {
        drug_name: null,
        inventory: 0,
        quantity: 0,
        unit: null,
        price_per_unit: null,
      },
    ]);
  }
  function removeRow(index) {
    data.splice(index, 1);
    setData([...data]);
  }
  function handleInputOnChange(rowIndex, keyItem, value, limit) {
    if (value <= limit) {
      data[rowIndex][keyItem] = value;
    }
    setData([...data]);
  }
  function handleAutoCompleteOnChange(event, value, rowIndex) {
    data[rowIndex].drug_name = value.drug_name;
    data[rowIndex].unit = value.unit;
    data[rowIndex].price_per_unit = value.price_per_unit;
    data[rowIndex].inventory = value.inventory;
    setData([...data]);
  }
  /*----------------------------------*/
  return (
    <>
      <table className=" w-full">
        <thead className="h-[50px] bg-custom-dark-100 p-3">
          <tr>
            {headerData.map((item, index) => (
              <td key={index}>{item}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr>
              {headerData.map((keyItem) => {
                /*--------------------autocomplete input drug --------------------*/
                if (keyItem == "drug_name") {
                  return (
                    <td className="w-[70px] h-[20px] py-[5px]">
                      <CustomAutoComplete
                        options={drugData ? drugData : []}
                        onChange={(event, value) => {
                          handleAutoCompleteOnChange(event, value, rowIndex);
                        }}
                        getOptionLabel={(option) => {
                          return `${option.drug_name} ( ${option.drug_code} )`;
                        }}
                        label={"search by drug name"}
                        size={"full"}
                      />
                    </td>
                  );
                } else if (keyItem == "quantity") {
                  /*--------------------quantity input --------------------*/
                  return (
                    <td className="w-[30px]  h-[20px] py-[5px]">
                      <div className="w-full h-full flex gap-[10px] items-center relative">
                        <input
                          value={item[keyItem]}
                          onChange={(e) => {
                            handleInputOnChange(
                              rowIndex,
                              keyItem,
                              e.target.value,
                              item["inventory"]
                            );
                          }}
                          className="w-full h-full"
                          type="number"
                          min={0}
                          max={item["inventory"]}
                        />
                        <span className="absolute right-[30px] bottom-[10px] text-custom-dark-300">
                          ({item["inventory"] - item["quantity"]})
                        </span>
                      </div>
                    </td>
                  );
                } else if (keyItem == "") {
                  /*--------------------delete button--------------------*/
                  return (
                    <td className="w-[30px] h-[20px] py-[5px]">
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
                } else {
                  return (
                    <td className="w-[20px] h-[20px] py-[5px]">
                      {item[keyItem]}
                    </td>
                  );
                }
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
    </>
  );
}
