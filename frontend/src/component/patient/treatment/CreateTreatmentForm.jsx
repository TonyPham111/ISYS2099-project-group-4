import Editor from "@/component/ui/Editor";
import * as patientService from "@/services/patientService";
import { useState, useContext } from "react";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "@/component/ui/CustomAutoComplete";

export default function CreateTreatmentForm({ treatmentId }) {
  const [createdData, setCreatedData] = useState([]);
  const [doctorNote, setDoctorNote] = useState(null);
  const { setIsPopup } = useContext(PopupContext);
  const headerData = ["drug_name", "quantity", "unit", "price_per_unit", ""];

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
      setIsPopup(false);
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
        />

        <h3>Doctor note</h3>
        <div className="w-[50%]">
          <Editor value={doctorNote} setValue={setDoctorNote} />
        </div>
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

export function CreateTreatmentTable({ headerData, data, setData }) {
  const drugData = patientService.getDrugs();
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
                        options={drugData}
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
