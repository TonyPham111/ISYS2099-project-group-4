import Editor from "@/component/ui/Editor/Editor";
import { useState, useContext, useEffect } from "react";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function CreateAllergiesForm({ createdAllergiesData }) {
  const [createdData, setCreatedData] = useState([]);
  const { setIsPopup } = useContext(PopupContext);
  const headerData = ["name",""];
  const { id } = useParams();
  function handleCreateAllergies() {
    let readyToCreate = true;
    /*----check if it meet requirement to create new treatment ( not allow any blank input )*/
    if (createdData.length > 0) {
      for (let i = 0; i < createdData.length; ++i) {
        if (createdAllergiesData.indexOf(createdData[i].name) >= 0) {
          readyToCreate = false;
        }
        if (!createdData[i]["name"]) {
          readyToCreate = false;
        }
      }
    } else {
      readyToCreate = false;
    }
    if (readyToCreate) {
      const sendData = {
        date: dayjs().format("YYYY-MM-DD"),
        patient_id: Number(id),
        allergies: createdData.map((item) => {
          return item.name;
        }),
      };
      console.log(JSON.stringify(sendData));
      toast.success("new allergy record of this patient have been created");
      setIsPopup(false);
    } else {
      if (createdData.length == 0) {
        toast.error("please fill at least 1 record!");
      } else {
        toast.error(
          "please fill all data and allergy name cannot be the same with past record!"
        );
      }
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
      </div>
      <div className="w-[95%] mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center absolute bottom-[10px]">
        <button
          onClick={handleCreateAllergies}
          className="h-[50px] w-[250px] bg-custom-blue text-white"
        >
          Create allergies +
        </button>
      </div>
    </div>
  );
}

function CreateDiagnosisTable({ headerData, data, setData }) {
  const { data: allergiesData } = useSWR(
    "http://localhost:8000/allergies",
    fetcher
  );
  /*-------------------------main function---------------------------*/
  function handleAutoCompleteOnChange(event, value, rowIndex) {
    data[rowIndex].allergy_name = value?.allergy_name;
    console.log(`check value: ${JSON.stringify(value)}`);
    setData([...data]);
  }
  function handleAddRowData() {
    setData([
      ...data,
      {
        name: null,
        group: null,
        allergen: null,
        type: null,
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
                if (keyItem == "name") {
                  return (
                    <td className="w-[70px] h-[20px] py-[5px]">
                      <CustomAutoComplete
                        options={allergiesData ? allergiesData : []}
                        // value={patientValue}
                        onChange={(event, value) => {
                          handleAutoCompleteOnChange(event, value, rowIndex);
                        }}
                        getOptionLabel={(option) => {
                          return `${option?.allergy_name}`;
                        }}
                        label={"search by allergies name ..."}
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
