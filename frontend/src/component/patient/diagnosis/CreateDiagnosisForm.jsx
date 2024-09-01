import Editor from "@/component/ui/Editor";
import * as patientService from "@/services/patientService";
import { useState, useContext, useEffect } from "react";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "@/component/ui/CustomAutoComplete";
import { useEditor } from "@tiptap/react";

export default function CreateDiagnosisForm({ diagnosisId }) {
  const [createdData, setCreatedData] = useState([]);
  const [diagnosisNote, setDiagnosisNote] = useState(null);
  const { setIsPopup } = useContext(PopupContext);
  const headerData = ["diagnosis", "description", ""];

  function handleCreateDiagnosis() {
    let readyToCreateDiagnosis = true;
    /*----check if it meet requirement to create new treatment ( not allow any blank input )*/
    if (createdData.length > 0) {
      for (let i = 0; i < createdData.length; ++i) {
        for (let j = 0; j < headerData.length; j++) {
          if (!createdData[i][headerData[i]]) {
            readyToCreateDiagnosis = false;
          }
        }
      }
    } else {
      readyToCreateDiagnosis = false;
    }
    if (readyToCreateDiagnosis) {
      setIsPopup(false);
    }
  }
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[10px] relative">
      <div className="w-full h-[90%] overflow-scroll">
        <h2>Condition</h2>
        <CreateDiagnosisTable
          headerData={headerData}
          data={createdData}
          setData={setCreatedData}
        />
        <h3>Diagnosis note</h3>
        <div className="w-[50%]">
          <Editor value={diagnosisNote} setValue={setDiagnosisNote} />
        </div>
      </div>
      <div className="w-[95%] mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center absolute bottom-[10px]">
        <button
          onClick={handleCreateDiagnosis}
          className="h-[50px] w-[250px] bg-custom-blue text-white"
        >
          Create diagnosis +
        </button>
      </div>
    </div>
  );
}

function CreateDiagnosisTable({ headerData, data, setData }) {
  const diagnosisData = patientService.getDiagnosisData();
  /*-------------------------main function---------------------------*/
  function handleAutoCompleteOnChange(event, value, rowIndex) {
    data[rowIndex].code = value.code;
    data[rowIndex].name = value.name;
    data[rowIndex].description = value.description;
    setData([...data]);
  }
  function handleAddRowData() {
    setData([
      ...data,
      {
        code: null,
        name: null,
        description: null,
      },
    ]);
  }
  function removeRow(index) {
    data.splice(index, 1);
    setData([...data]);
  }
  /*-----------------------------------------------------------------*/
  return (
    <>
      <table className="w-full">
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
                /*----------------------auto complete input (diagnosis)--------------------------*/
                if (keyItem == "diagnosis") {
                  return (
                    <td className="w-[70px] h-[20px] py-[5px]">
                      <CustomAutoComplete
                        options={diagnosisData}
                        // value={patientValue}
                        onChange={(event, value) => {
                          handleAutoCompleteOnChange(event, value, rowIndex);
                        }}
                        getOptionLabel={(option) => {
                          return `${option.name} ( ${option.code} )`;
                        }}
                        label={"search by diagnosis or code ..."}
                        size={"full"}
                      />
                    </td>
                  );
                } else if (keyItem == "") {
                /*------------------------ remove row button -------------------------------*/
                  return (
                    <td className="w-[30px] h-[20px]  py-[5px]">
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
                    <td className="w-[70px] h-[20px]  py-[5px] ">
                      {item[keyItem]}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>{" "}
      {/*------------------------ add row button -------------------------------*/}
      <button
        onClick={handleAddRowData}
        className="bg-custom-blue text-white w-[150px]"
      >
        add condtion +{" "}
      </button>
    </>
  );
}
