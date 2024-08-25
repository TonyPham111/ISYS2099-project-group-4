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
  useEffect(() => {
    console.log(`currnet createdData: ${JSON.stringify(createdData)}\n`);
  }, [createdData]);
  const diagnosisData = patientService.getDiagnosisData();
  function handleAddRowData() {
    setCreatedData([
      ...createdData,
      {
        code: null,
        name: null,
        description: null,
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
                  } else if (keyItem == "diagnosis") {
                    return (
                      <td className="w-[70px] h-[20px] py-[5px]">
                        <CustomAutoComplete
                          options={diagnosisData}
                          // value={patientValue}
                          onChange={(event, value) => {
                            console.log(
                              `getValue: ${JSON.stringify(
                                value
                              )}\n index: ${rowIndex}`
                            );
                            createdData[rowIndex].code = value.code;
                            createdData[rowIndex].name = value.name;
                            createdData[rowIndex].description =
                              value.description;
                            console.log(
                              `check createdData: ${JSON.stringify(
                                createdData
                              )}`
                            );
                            setCreatedData([...createdData]);
                          }}
                          getOptionLabel={(option) => {
                            return `${option.name} ( ${option.code} )`;
                          }}
                          label={"search by diagnosis or code ..."}
                          size={"full"}
                        />
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
        </table>
        <button
          onClick={handleAddRowData}
          className="bg-custom-blue text-white w-[150px]"
        >
          add condtion +{" "}
        </button>
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
